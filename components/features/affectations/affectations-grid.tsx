'use client';

import { useState, useCallback } from 'react';
import { MissionClient, UserClient } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { adminRegisterVolunteer, adminUnregisterVolunteer } from '@/lib/firebase/volunteers';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

interface AffectationsGridProps {
  missions: MissionClient[];
  volunteers: UserClient[];
  onUpdate: (missions: MissionClient[]) => void;
}

// Couleurs par catégorie (mêmes que l'export Excel)
const CATEGORY_COLORS: Record<string, string> = {
  'accreditations': '#FFFF00',
  'accueil_public_pr': '#FF9900',
  'animation_1': '#00CCFF',
  'animation_2': '#00FF00',
  'billetterie_vente': '#FF66CC',
  'catering_buvette': '#CC66FF',
  'communication': '#FF6600',
  'controle_acces_se': '#00FFFF',
  'festival_court_ca': '#FFCC00',
  'logistique': '#66FF66',
  'nuit_courte': '#FF3399',
  'scolaire': '#9999FF',
};

export function AffectationsGrid({ missions, volunteers, onUpdate }: AffectationsGridProps) {
  const [draggedItem, setDraggedItem] = useState<{
    missionId: string;
    volunteerId: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Grouper et trier les missions par catégorie puis date
  const sortedMissions = [...missions].sort((a, b) => {
    if (a.category !== b.category) {
      return (a.category || '').localeCompare(b.category || '');
    }
    if (!a.startDate && !b.startDate) return 0;
    if (!a.startDate) return -1;
    if (!b.startDate) return 1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  // Trier les bénévoles par nom
  const sortedVolunteers = [...volunteers].sort((a, b) =>
    a.lastName.localeCompare(b.lastName)
  );

  // Vérifier les conflits de créneaux
  const hasConflict = (volunteerId: string, mission: MissionClient): boolean => {
    if (!mission.startDate || !mission.endDate) return false;

    const missionStart = new Date(mission.startDate);
    const missionEnd = new Date(mission.endDate);

    // Vérifier toutes les autres missions du bénévole
    for (const otherMission of missions) {
      if (otherMission.id === mission.id) continue;
      if (!otherMission.volunteers.includes(volunteerId)) continue;
      if (!otherMission.startDate || !otherMission.endDate) continue;

      const otherStart = new Date(otherMission.startDate);
      const otherEnd = new Date(otherMission.endDate);

      // Vérifier le chevauchement
      if (missionStart < otherEnd && missionEnd > otherStart) {
        return true;
      }
    }

    return false;
  };

  // Gérer le clic sur une cellule
  const handleCellClick = async (missionId: string, volunteerId: string) => {
    if (isProcessing) return;

    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    const isAssigned = mission.volunteers.includes(volunteerId);

    // Si on désaffecte, pas de vérification de conflit
    if (isAssigned) {
      setIsProcessing(true);
      try {
        await adminUnregisterVolunteer(missionId, volunteerId);
        
        const updatedMissions = missions.map(m =>
          m.id === missionId
            ? { ...m, volunteers: m.volunteers.filter(v => v !== volunteerId) }
            : m
        );
        onUpdate(updatedMissions);
        toast.success('Bénévole désaffecté');
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la désaffectation');
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Vérifier les conflits avant d'affecter
      if (hasConflict(volunteerId, mission)) {
        toast.error('Conflit de créneaux détecté ! Le bénévole a déjà une mission à ce moment.', {
          duration: 5000,
        });
        return;
      }

      // Vérifier si la mission est pleine
      if (mission.volunteers.length >= mission.maxVolunteers) {
        toast.error('Mission complète !');
        return;
      }

      setIsProcessing(true);
      try {
        await adminRegisterVolunteer(missionId, volunteerId);
        
        const updatedMissions = missions.map(m =>
          m.id === missionId
            ? { ...m, volunteers: [...m.volunteers, volunteerId] }
            : m
        );
        onUpdate(updatedMissions);
        toast.success('Bénévole affecté');
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors de l\'affectation');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, missionId: string, volunteerId: string) => {
    setDraggedItem({ missionId, volunteerId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetMissionId: string, targetVolunteerId: string) => {
    e.preventDefault();
    
    if (!draggedItem || isProcessing) return;

    const { missionId: sourceMissionId, volunteerId: sourceVolunteerId } = draggedItem;

    // Ne rien faire si on drop sur la même cellule
    if (sourceMissionId === targetMissionId && sourceVolunteerId === targetVolunteerId) {
      setDraggedItem(null);
      return;
    }

    const targetMission = missions.find(m => m.id === targetMissionId);
    if (!targetMission) {
      setDraggedItem(null);
      return;
    }

    // Vérifier les conflits
    if (hasConflict(sourceVolunteerId, targetMission)) {
      toast.error('Conflit de créneaux détecté !', { duration: 5000 });
      setDraggedItem(null);
      return;
    }

    // Vérifier si mission pleine
    if (!targetMission.volunteers.includes(sourceVolunteerId) && 
        targetMission.volunteers.length >= targetMission.maxVolunteers) {
      toast.error('Mission de destination complète !');
      setDraggedItem(null);
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Désaffecter de la mission source
      await adminUnregisterVolunteer(sourceMissionId, sourceVolunteerId);
      
      // 2. Affecter à la mission cible
      await adminRegisterVolunteer(targetMissionId, sourceVolunteerId);

      // 3. Mettre à jour l'état
      const updatedMissions = missions.map(m => {
        if (m.id === sourceMissionId) {
          return { ...m, volunteers: m.volunteers.filter(v => v !== sourceVolunteerId) };
        }
        if (m.id === targetMissionId) {
          return { ...m, volunteers: [...m.volunteers, sourceVolunteerId] };
        }
        return m;
      });

      onUpdate(updatedMissions);
      toast.success('Affectation déplacée avec succès');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du déplacement');
    } finally {
      setIsProcessing(false);
      setDraggedItem(null);
    }
  };

  // Obtenir la couleur de la catégorie
  const getCategoryColor = (category: string | undefined): string => {
    if (!category) return '#FFFFFF';
    return CATEGORY_COLORS[category] || '#CCCCCC';
  };

  return (
    <div className="overflow-auto max-h-[70vh] border rounded-lg">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-gray-100 z-10">
          <tr>
            <th className="border p-2 text-left bg-gray-200 min-w-[300px] sticky left-0 z-20">
              Mission
            </th>
            {sortedVolunteers.map((volunteer) => (
              <th
                key={volunteer.uid}
                className="border p-1 text-center min-w-[60px] max-w-[60px]"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                <div className="text-xs font-medium whitespace-nowrap">
                  {volunteer.firstName} {volunteer.lastName}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedMissions.map((mission) => {
            const categoryColor = getCategoryColor(mission.category);
            const missionLabel = mission.startDate
              ? `${format(new Date(mission.startDate), 'dd/MM HH:mm', { locale: fr })} - ${mission.title}`
              : mission.title;

            return (
              <tr key={mission.id} className="hover:bg-gray-50">
                <td
                  className="border p-2 text-xs font-medium sticky left-0 z-10"
                  style={{ backgroundColor: categoryColor }}
                >
                  {missionLabel}
                  <div className="text-[10px] text-gray-600 mt-1">
                    {mission.volunteers.length}/{mission.maxVolunteers} bénévoles
                  </div>
                </td>
                {sortedVolunteers.map((volunteer) => {
                  const isAssigned = mission.volunteers.includes(volunteer.uid);
                  const hasConflictHere = isAssigned ? false : hasConflict(volunteer.uid, mission);

                  return (
                    <td
                      key={`${mission.id}-${volunteer.uid}`}
                      className={`border p-1 text-center cursor-pointer select-none transition-colors ${
                        isProcessing ? 'opacity-50 cursor-wait' : 'hover:bg-gray-100'
                      }`}
                      style={{
                        backgroundColor: isAssigned ? categoryColor : 'transparent',
                      }}
                      onClick={() => handleCellClick(mission.id, volunteer.uid)}
                      draggable={isAssigned}
                      onDragStart={(e) => isAssigned && handleDragStart(e, mission.id, volunteer.uid)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, mission.id, volunteer.uid)}
                    >
                      {isAssigned && (
                        <span className="font-bold text-sm">X</span>
                      )}
                      {hasConflictHere && (
                        <AlertTriangle className="h-3 w-3 text-red-500 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

