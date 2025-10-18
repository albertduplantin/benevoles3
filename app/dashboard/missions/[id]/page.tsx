'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { getMissionById, duplicateMission } from '@/lib/firebase/missions';
import { registerToMission, unregisterFromMission } from '@/lib/firebase/registrations';
import { getUserById } from '@/lib/firebase/users';
import { isProfileComplete } from '@/lib/firebase/users';
// Ancien système de postulation supprimé - utiliser category-responsibles maintenant
import { MissionClient, UserClient } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDateTime } from '@/lib/utils/date';
import { getInitials, getAvatarColor } from '@/lib/utils/avatar';
import { hasPermission, canEditMissionAsync } from '@/lib/utils/permissions';
import { ExportButtons } from '@/components/features/exports/export-buttons';
import { AssignVolunteerModal } from '@/components/features/missions/assign-volunteer-modal';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  AlertCircleIcon,
  ArrowLeftIcon,
  CopyIcon,
  UserPlusIcon,
} from 'lucide-react';

export default function MissionDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const missionId = params.id as string;

  const [mission, setMission] = useState<MissionClient | null>(null);
  const [participants, setParticipants] = useState<UserClient[]>([]);
  const [categoryResponsibles, setCategoryResponsibles] = useState<UserClient[]>([]);
  const [isLoadingMission, setIsLoadingMission] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [canManageVolunteers, setCanManageVolunteers] = useState(false);

  const isUserRegistered = mission?.volunteers.includes(user?.uid || '') || false;
  const availableSpots = mission ? mission.maxVolunteers - mission.volunteers.length : 0;
  const canRegister =
    mission?.status === 'published' && !isUserRegistered && availableSpots > 0;
  const canUnregister = isUserRegistered && mission?.status !== 'completed';

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && !isProfileComplete(user)) {
      router.push('/auth/complete-profile');
    }
  }, [user, loading, router]);

  // Charger la mission (rapide)
  useEffect(() => {
    const fetchMission = async () => {
      if (!user || !missionId) return;

      try {
        setIsLoadingMission(true);
        const missionData = await getMissionById(missionId);

        if (!missionData) {
          setError('Mission introuvable');
          return;
        }

        setMission(missionData);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement de la mission');
      } finally {
        setIsLoadingMission(false);
      }
    };

    fetchMission();
  }, [user, missionId]);

  // Charger les participants en arrière-plan (après affichage)
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!user || !mission) return;

      // Charger les participants si admin, bénévole inscrit, ou responsable de catégorie
      if (
        hasPermission(user, 'admin') || 
        mission.volunteers.includes(user.uid) ||
        canManageVolunteers
      ) {
        try {
          const participantsData = await Promise.all(
            mission.volunteers.map((uid) => getUserById(uid))
          );
          setParticipants(participantsData.filter((p) => p !== null) as UserClient[]);
        } catch (err) {
          console.error('Erreur chargement participants:', err);
        }
      }
    };

    fetchParticipants();
  }, [user, mission, canManageVolunteers]);

  // Charger les responsables de la catégorie
  useEffect(() => {
    const fetchCategoryResponsibles = async () => {
      if (!mission || !mission.category) return;

      try {
        // Importer dynamiquement le helper
        const { getCategoryResponsiblesByValue } = await import('@/lib/utils/category-responsible-helper');
        const responsibles = await getCategoryResponsiblesByValue(mission.category);
        setCategoryResponsibles(responsibles);
      } catch (err) {
        console.error('Erreur chargement responsables de catégorie:', err);
      }
    };

    fetchCategoryResponsibles();
  }, [mission]);

  // Vérifier les permissions pour gérer les bénévoles
  useEffect(() => {
    const checkPermissions = async () => {
      if (!user || !mission) {
        setCanManageVolunteers(false);
        return;
      }

      // Admin peut gérer tous les bénévoles
      if (user.role === 'admin') {
        setCanManageVolunteers(true);
        return;
      }

      // Responsable de catégorie peut gérer les bénévoles de ses missions
      const canManage = await canEditMissionAsync(user, mission.category);
      setCanManageVolunteers(canManage);
    };

    checkPermissions();
  }, [user, mission]);

  // Rafraîchir les participants après assignation
  const handleVolunteerAssigned = async () => {
    if (!missionId) return;
    
    try {
      // Recharger la mission pour avoir la liste à jour
      const updatedMission = await getMissionById(missionId);
      if (updatedMission) {
        setMission(updatedMission);
        
        // Recharger les participants
        const participantsData = await Promise.all(
          updatedMission.volunteers.map((uid) => getUserById(uid))
        );
        setParticipants(participantsData.filter((p) => p !== null) as UserClient[]);
      }
    } catch (err) {
      console.error('Erreur rafraîchissement:', err);
    }
  };

  const handleRegister = async () => {
    if (!user || !missionId) return;

    setIsRegistering(true);
    setError(null);
    setSuccess(null);

    try {
      await registerToMission(missionId, user.uid);
      setSuccess('✅ Inscription réussie !');

      // Recharger la mission
      const updatedMission = await getMissionById(missionId);
      if (updatedMission) {
        setMission(updatedMission);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!user || !missionId) return;

    if (!confirm('Êtes-vous sûr de vouloir vous désinscrire de cette mission ?')) {
      return;
    }

    setIsRegistering(true);
    setError(null);
    setSuccess(null);

    try {
      await unregisterFromMission(missionId, user.uid);
      setSuccess('✅ Désinscription réussie');

      // Recharger la mission
      const updatedMission = await getMissionById(missionId);
      if (updatedMission) {
        setMission(updatedMission);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la désinscription');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDuplicate = async () => {
    if (!user || !missionId) return;

    if (!confirm('Voulez-vous dupliquer cette mission ? Une copie sera créée en mode brouillon.')) {
      return;
    }

    setIsDuplicating(true);

    try {
      const newMissionId = await duplicateMission(missionId, user.uid);
      toast.success('✅ Mission dupliquée avec succès !');
      
      // Rediriger vers la page d'édition de la nouvelle mission
      router.push(`/dashboard/missions/${newMissionId}/edit`);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la duplication');
      setIsDuplicating(false);
    }
  };


  if (loading || isLoadingMission) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user || !mission) {
    return null;
  }

  const statusLabels = {
    draft: 'Brouillon',
    published: 'Publiée',
    full: 'Complète',
    cancelled: 'Annulée',
    completed: 'Terminée',
  };

  const statusColors = {
    draft: 'bg-gray-500',
    published: 'bg-green-500',
    full: 'bg-orange-500',
    cancelled: 'bg-red-500',
    completed: 'bg-blue-500',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/missions">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Retour aux missions
            </Link>
          </Button>

          <div className="flex gap-2">
            {mission && (canManageVolunteers || participants.length > 0) && (
              <ExportButtons
                type="mission"
                mission={mission}
                volunteers={participants}
                categoryResponsible={categoryResponsibles[0]} // Pour compatibilité, on passe le premier
              />
            )}
            
            {mission && canManageVolunteers && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleDuplicate}
                  disabled={isDuplicating}
                >
                  <CopyIcon className="w-4 h-4 mr-2" />
                  {isDuplicating ? 'Duplication...' : 'Dupliquer'}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/missions/${missionId}/edit`}>Modifier</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>
        )}
        {success && (
          <div className="p-4 text-sm text-green-600 bg-green-50 rounded-md">
            {success}
          </div>
        )}

        {/* Mission Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-3xl">{mission.title}</CardTitle>
                  {mission.isUrgent && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircleIcon className="w-3 h-3" />
                      Urgent
                    </Badge>
                  )}
                </div>
                <Badge className={statusColors[mission.status]}>
                  {statusLabels[mission.status]}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {mission.description}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Catégorie */}
              {mission.category && (
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-muted-foreground mt-0.5">📂</div>
                  <div>
                    <p className="font-semibold">Catégorie</p>
                    <p className="text-sm text-muted-foreground">{mission.category}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              {mission.type === 'scheduled' && mission.startDate && (
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-semibold">Dates</p>
                    <p className="text-sm text-muted-foreground">
                      Début : {formatDateTime(mission.startDate)}
                    </p>
                    {mission.endDate && (
                      <p className="text-sm text-muted-foreground">
                        Fin : {formatDateTime(mission.endDate)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {mission.type === 'ongoing' && (
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-semibold">Type</p>
                    <p className="text-sm text-muted-foreground">
                      Mission continue (pas de dates fixes)
                    </p>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Lieu</p>
                  <p className="text-sm text-muted-foreground">{mission.location}</p>
                </div>
              </div>

              {/* Available Spots */}
              <div className="flex items-start gap-3">
                <UsersIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Places disponibles</p>
                  <p className="text-sm text-muted-foreground">
                    {availableSpots} / {mission.maxVolunteers} place
                    {mission.maxVolunteers > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {canRegister && (
                <Button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="flex-1"
                >
                  {isRegistering ? 'Inscription...' : 'Je m\'inscris'}
                </Button>
              )}

              {canUnregister && (
                <Button
                  onClick={handleUnregister}
                  disabled={isRegistering}
                  variant="outline"
                  className="flex-1"
                >
                  {isRegistering ? 'Désinscription...' : 'Me désinscrire'}
                </Button>
              )}

              {isUserRegistered && mission.status === 'completed' && (
                <div className="flex-1 p-4 bg-blue-50 rounded-md text-center">
                  <p className="text-sm text-blue-600 font-semibold">
                    ✅ Vous avez participé à cette mission
                  </p>
                </div>
              )}

              {mission.status === 'full' && !isUserRegistered && (
                <div className="flex-1 p-4 bg-orange-50 rounded-md text-center">
                  <p className="text-sm text-orange-600 font-semibold">
                    Cette mission est complète
                  </p>
                </div>
              )}

              {mission.status === 'cancelled' && (
                <div className="flex-1 p-4 bg-red-50 rounded-md text-center">
                  <p className="text-sm text-red-600 font-semibold">
                    Cette mission a été annulée
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Responsables de la catégorie */}
        {categoryResponsibles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>👤</span> Responsable{categoryResponsibles.length > 1 ? 's' : ''} de la catégorie
              </CardTitle>
              <CardDescription>
                Personne{categoryResponsibles.length > 1 ? 's' : ''} à contacter pour toute question concernant cette mission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryResponsibles.map((responsible) => (
                  <div key={responsible.uid} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        {responsible.photoURL ? (
                          <AvatarImage
                            src={responsible.photoURL}
                            alt={responsible.firstName}
                          />
                        ) : (
                          <AvatarFallback
                            style={{
                              backgroundColor: getAvatarColor(responsible.email),
                            }}
                          >
                            {getInitials(responsible.firstName, responsible.lastName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-semibold text-lg">
                          {responsible.firstName} {responsible.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          📧 {responsible.email}
                        </p>
                        {responsible.phone && (
                          <p className="text-sm text-muted-foreground">
                            📱 {responsible.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-blue-600">Responsable</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Participants List (Admin/Bénévoles inscrits/Responsables de catégorie) */}
        {(hasPermission(user, 'admin') || 
          mission.volunteers.includes(user.uid) ||
          canManageVolunteers) && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Participants ({participants.length}/{mission.maxVolunteers})
                  </CardTitle>
                  <CardDescription>
                    {canManageVolunteers
                      ? 'Liste des bénévoles inscrits à cette mission'
                      : 'Coordonnées des autres bénévoles pour vous coordonner'}
                  </CardDescription>
                </div>
                {canManageVolunteers && (
                  <Button
                    onClick={() => setShowAssignModal(true)}
                    variant="outline"
                    size="sm"
                  >
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Assigner
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {participants.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Aucun participant pour le moment
                </p>
              ) : (
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.uid}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {participant.photoURL ? (
                            <AvatarImage
                              src={participant.photoURL}
                              alt={participant.firstName}
                            />
                          ) : (
                            <AvatarFallback
                              style={{
                                backgroundColor: getAvatarColor(participant.email),
                              }}
                            >
                              {getInitials(participant.firstName, participant.lastName)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {participant.firstName} {participant.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {participant.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{participant.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal d'assignation de bénévoles */}
      {mission && canManageVolunteers && (
        <AssignVolunteerModal
          open={showAssignModal}
          onOpenChange={setShowAssignModal}
          missionId={missionId}
          missionTitle={mission.title}
          currentVolunteers={mission.volunteers}
          maxVolunteers={mission.maxVolunteers}
          onVolunteerAssigned={handleVolunteerAssigned}
        />
      )}
    </div>
  );
}

