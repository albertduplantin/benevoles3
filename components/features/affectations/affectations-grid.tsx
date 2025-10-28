'use client';

import { useState, useCallback } from 'react';
import { MissionClient, UserClient, VolunteerPreferences } from '@/types';
import { format, differenceInHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { adminRegisterVolunteer, adminUnregisterVolunteer } from '@/lib/firebase/volunteers';
import { toast } from 'sonner';
import { AlertTriangle, ZoomIn, ZoomOut, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [zoomLevel, setZoomLevel] = useState(100); // Pourcentage de zoom
  const [selectedVolunteer, setSelectedVolunteer] = useState<UserClient | null>(null);
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false);

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

  /**
   * Vérifier si une mission correspond aux préférences d'un bénévole
   * Retourne un score de correspondance (0 = pas de match, plus le score est élevé, meilleur est le match)
   */
  const getMissionMatchScore = (mission: MissionClient, volunteer: UserClient): number => {
    if (!volunteer.preferences) return 0;

    const prefs = volunteer.preferences;
    let score = 0;

    // 1. Vérifier la disponibilité par date (poids: 3 points)
    if (prefs.availableDates && prefs.availableDates.length > 0 && mission.startDate) {
      const missionDate = format(new Date(mission.startDate), 'yyyy-MM-dd');
      if (prefs.availableDates.includes(missionDate)) {
        score += 3;
      }
    }

    // 2. Vérifier la catégorie préférée (poids: 2 points)
    if (prefs.preferredCategories && prefs.preferredCategories.length > 0) {
      if (mission.category && prefs.preferredCategories.includes(mission.category)) {
        score += 2;
      }
    }

    // 3. Vérifier le créneau horaire (poids: 1 point)
    if (prefs.preferredTimeSlots && prefs.preferredTimeSlots.length > 0 && mission.startDate) {
      const hour = new Date(mission.startDate).getHours();
      let matchesTimeSlot = false;
      
      if (hour >= 6 && hour < 12 && prefs.preferredTimeSlots.includes('morning')) matchesTimeSlot = true;
      if (hour >= 12 && hour < 18 && prefs.preferredTimeSlots.includes('afternoon')) matchesTimeSlot = true;
      if (hour >= 18 && hour < 24 && prefs.preferredTimeSlots.includes('evening')) matchesTimeSlot = true;
      if ((hour >= 0 && hour < 6) && prefs.preferredTimeSlots.includes('night')) matchesTimeSlot = true;
      
      if (matchesTimeSlot) score += 1;
    }

    // 4. Vérifier la durée (poids: 1 point)
    if (prefs.preferredDuration && prefs.preferredDuration.length > 0 && mission.startDate && mission.endDate) {
      const durationHours = differenceInHours(new Date(mission.endDate), new Date(mission.startDate));
      let matchesDuration = false;
      
      if (durationHours < 3 && prefs.preferredDuration.includes('short')) matchesDuration = true;
      if (durationHours >= 3 && durationHours <= 6 && prefs.preferredDuration.includes('medium')) matchesDuration = true;
      if (durationHours > 6 && prefs.preferredDuration.includes('long')) matchesDuration = true;
      
      if (matchesDuration) score += 1;
    }

    return score;
  };

  /**
   * Vérifier si une mission correspond aux préférences (score >= 2 pour être considéré comme match)
   */
  const doesMissionMatchPreferences = (mission: MissionClient, volunteer: UserClient): boolean => {
    return getMissionMatchScore(mission, volunteer) >= 2;
  };

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

  // Gérer le double clic sur une cellule
  const handleCellDoubleClick = async (missionId: string, volunteerId: string) => {
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

  // Gestion du zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  // Calculer la largeur des colonnes en fonction du zoom
  const getColumnWidth = () => {
    const baseWidth = 32; // pixels
    return (baseWidth * zoomLevel) / 100;
  };

  const getMissionColumnWidth = () => {
    const baseWidth = 280; // pixels - augmenté pour tenir toutes les infos sur une ligne
    return (baseWidth * zoomLevel) / 100;
  };

  const getFontSize = () => {
    const baseSize = 11; // pixels
    return (baseSize * zoomLevel) / 100;
  };

  // Vérifier si une mission est complète
  const isMissionComplete = (mission: MissionClient): boolean => {
    return mission.volunteers.length >= mission.maxVolunteers;
  };

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {/* Contrôles de zoom */}
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleResetZoom}
            >
              {zoomLevel}%
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 150}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            💡 Double-cliquez sur une case pour affecter/désaffecter
          </div>
        </div>

        {/* Légende des préférences */}
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-1">Système de préférences</p>
              <div className="flex flex-wrap gap-4 text-xs text-blue-800">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#d1f4d1' }}></div>
                  <span>Mission correspondant aux préférences du bénévole</span>
                </div>
                <div className="flex items-center gap-1">
                  <Info className="h-3 w-3 text-green-600" />
                  <span>Icône = match détecté (survolez pour plus d'infos)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Tableau */}
      <div className="overflow-auto border rounded-lg" style={{ maxHeight: 'calc(100vh - 320px)' }}>
        <table className="border-collapse" style={{ fontSize: `${getFontSize()}px` }}>
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              <th
                className="border p-2 text-left bg-gray-200 sticky left-0 z-20"
                style={{ minWidth: `${getMissionColumnWidth()}px`, maxWidth: `${getMissionColumnWidth()}px` }}
              >
                Mission
              </th>
              {sortedVolunteers.map((volunteer) => {
                const hasPreferences = volunteer.preferences && (
                  (volunteer.preferences.availableDates && volunteer.preferences.availableDates.length > 0) ||
                  (volunteer.preferences.preferredCategories && volunteer.preferences.preferredCategories.length > 0) ||
                  (volunteer.preferences.preferredTimeSlots && volunteer.preferences.preferredTimeSlots.length > 0)
                );

                return (
                  <th
                    key={volunteer.uid}
                    className="border p-1 text-center"
                    style={{
                      minWidth: `${getColumnWidth()}px`,
                      maxWidth: `${getColumnWidth()}px`,
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      height: '120px',
                      backgroundColor: hasPreferences ? '#e8f5e9' : '#f5f5f5',
                    }}
                  >
                    <div className="font-medium whitespace-nowrap flex items-center gap-1">
                      {volunteer.firstName} {volunteer.lastName}
                      {hasPreferences && (
                        <span className="text-green-600 font-bold" title="Préférences renseignées">★</span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedMissions.map((mission) => {
              const categoryColor = getCategoryColor(mission.category);
              const missionLabel = mission.startDate
                ? `${format(new Date(mission.startDate), 'dd/MM HH:mm', { locale: fr })} - ${mission.title}`
                : mission.title;
              const isComplete = isMissionComplete(mission);

              return (
                <tr key={mission.id} className="hover:bg-gray-50">
                  <td
                    className="border p-1 px-2 font-medium sticky left-0 z-10 bg-white"
                    style={{
                      backgroundColor: categoryColor,
                      minWidth: `${getMissionColumnWidth()}px`,
                      maxWidth: `${getMissionColumnWidth()}px`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                        {missionLabel}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span 
                          className="text-gray-700 font-semibold"
                          style={{ fontSize: `${getFontSize() * 0.9}px` }}
                        >
                          {mission.volunteers.length}/{mission.maxVolunteers}
                        </span>
                        {isComplete && (
                          <CheckCircle2 
                            className="text-green-600" 
                            style={{ 
                              width: `${getFontSize() * 1.2}px`, 
                              height: `${getFontSize() * 1.2}px` 
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                  {sortedVolunteers.map((volunteer) => {
                    const isAssigned = mission.volunteers.includes(volunteer.uid);
                    const hasConflictHere = isAssigned ? false : hasConflict(volunteer.uid, mission);
                    const matchesPreferences = doesMissionMatchPreferences(mission, volunteer);
                    const matchScore = getMissionMatchScore(mission, volunteer);

                    // Déterminer la couleur de fond
                    let bgColor = 'transparent';
                    if (isAssigned) {
                      bgColor = categoryColor;
                    } else if (matchesPreferences) {
                      // Vert pâle pour les missions qui correspondent aux préférences
                      bgColor = '#d1f4d1'; // Vert pâle
                    }

                    return (
                      <Tooltip key={`${mission.id}-${volunteer.uid}`}>
                        <TooltipTrigger asChild>
                          <td
                            className={`border text-center cursor-pointer select-none transition-colors ${
                              isProcessing ? 'opacity-50 cursor-wait' : 'hover:bg-gray-100'
                            }`}
                            style={{
                              backgroundColor: bgColor,
                              minWidth: `${getColumnWidth()}px`,
                              maxWidth: `${getColumnWidth()}px`,
                              padding: '4px',
                            }}
                            onDoubleClick={() => handleCellDoubleClick(mission.id, volunteer.uid)}
                            draggable={isAssigned}
                            onDragStart={(e) => isAssigned && handleDragStart(e, mission.id, volunteer.uid)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, mission.id, volunteer.uid)}
                          >
                            {isAssigned && (
                              <span className="font-bold">X</span>
                            )}
                            {hasConflictHere && (
                              <AlertTriangle className="h-3 w-3 text-red-500 mx-auto" />
                            )}
                            {!isAssigned && matchesPreferences && !hasConflictHere && (
                              <Info className="h-3 w-3 text-green-600 mx-auto" />
                            )}
                          </td>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            <p className="font-medium">
                              {isAssigned 
                                ? 'Double-clic pour désaffecter' 
                                : hasConflictHere 
                                  ? 'Conflit de créneaux !'
                                  : isComplete
                                    ? 'Mission complète'
                                    : 'Double-clic pour affecter'}
                            </p>
                            {matchesPreferences && !isAssigned && (
                              <p className="text-green-600 border-t pt-1 mt-1">
                                ✓ Correspond aux préférences (score: {matchScore}/7)
                              </p>
                            )}
                            {volunteer.preferences && (
                              <div className="border-t pt-1 mt-1 text-gray-500 max-w-[200px]">
                                <p className="font-medium mb-1">Préférences :</p>
                                {volunteer.preferences.availableDates && volunteer.preferences.availableDates.length > 0 && (
                                  <p>📅 {volunteer.preferences.availableDates.length} jour(s) dispo</p>
                                )}
                                {volunteer.preferences.preferredCategories && volunteer.preferences.preferredCategories.length > 0 && (
                                  <p>🎯 {volunteer.preferences.preferredCategories.length} catégorie(s)</p>
                                )}
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    </TooltipProvider>
  );
}

