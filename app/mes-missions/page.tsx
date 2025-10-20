'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUserByToken } from '@/lib/firebase/email-only-users';
import { getAllMissions } from '@/lib/firebase/missions';
import { unregisterFromMission } from '@/lib/firebase/registrations';
import { getUserById } from '@/lib/firebase/users';
import { UserClient, MissionClient } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils/date';
import { CalendarIcon, MapPinIcon, UsersIcon, LogOutIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ExportButtons } from '@/components/features/exports/export-buttons';

function MyMissionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token');

  const [user, setUser] = useState<UserClient | null>(null);
  const [missions, setMissions] = useState<MissionClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unregisteringMissionId, setUnregisteringMissionId] = useState<string | null>(null);
  const [missionParticipants, setMissionParticipants] = useState<Map<string, UserClient[]>>(new Map());

  useEffect(() => {
    const loadUserAndMissions = async () => {
      if (!token) {
        setError('Token manquant. Veuillez utiliser le lien envoyé par email.');
        setIsLoading(false);
        return;
      }

      try {
        // Récupérer l'utilisateur par son token
        const userData = await getUserByToken(token);
        
        if (!userData) {
          setError('Lien invalide ou expiré. Veuillez contacter l\'administrateur.');
          setIsLoading(false);
          return;
        }

        setUser(userData);

        // Charger toutes les missions
        const allMissions = await getAllMissions();
        
        // Filtrer les missions où l'utilisateur est inscrit
        const userMissions = allMissions.filter(m => 
          m.volunteers.includes(userData.uid)
        );

        // Trier par date (les plus proches en premier)
        userMissions.sort((a, b) => {
          if (!a.startDate || !b.startDate) return 0;
          return a.startDate.getTime() - b.startDate.getTime();
        });

        setMissions(userMissions);
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError('Erreur lors du chargement de vos missions. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAndMissions();
  }, [token]);

  // Charger les participants pour l'export de planning
  useEffect(() => {
    const loadParticipants = async () => {
      if (missions.length === 0) return;

      const participantsMap = new Map<string, UserClient[]>();

      for (const mission of missions) {
        if (mission.volunteers.length > 0) {
          const participants: UserClient[] = [];
          for (const volunteerId of mission.volunteers) {
            try {
              const volunteer = await getUserById(volunteerId);
              if (volunteer) {
                participants.push(volunteer);
              }
            } catch (error) {
              console.error(`Error loading volunteer ${volunteerId}:`, error);
            }
          }
          participantsMap.set(mission.id, participants);
        }
      }

      setMissionParticipants(participantsMap);
    };

    loadParticipants();
  }, [missions]);

  const handleUnregister = async (missionId: string, missionTitle: string) => {
    if (!user) return;

    if (!confirm(`Êtes-vous sûr de vouloir vous désinscrire de "${missionTitle}" ?`)) {
      return;
    }

    try {
      setUnregisteringMissionId(missionId);
      await unregisterFromMission(missionId, user.uid);
      
      // Retirer la mission de la liste locale
      setMissions(prev => prev.filter(m => m.id !== missionId));
      
      toast.success('Vous avez été désinscrit avec succès');
    } catch (err: any) {
      console.error('Error unregistering:', err);
      toast.error(err.message || 'Erreur lors de la désinscription');
    } finally {
      setUnregisteringMissionId(null);
    }
  };

  const statusLabels: Record<string, string> = {
    draft: 'Brouillon',
    published: 'Publiée',
    full: 'Complète',
    cancelled: 'Annulée',
    completed: 'Terminée',
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-500',
    published: 'bg-green-500',
    full: 'bg-orange-500',
    cancelled: 'bg-red-500',
    completed: 'bg-blue-500',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de vos missions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <CardTitle>Erreur d'accès</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">
              Si le problème persiste, contactez l'administrateur du festival.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                Bonjour {user?.firstName} 👋
              </h1>
              <p className="text-muted-foreground">
                Voici le récapitulatif de vos missions pour le festival
              </p>
            </div>
            {missions.length > 0 && user && (
              <div className="flex-shrink-0">
                <ExportButtons
                  type="volunteer-planning"
                  missions={missions}
                  volunteerName={`${user.firstName} ${user.lastName}`}
                  allParticipants={missionParticipants}
                />
              </div>
            )}
          </div>
        </div>

        {/* Info message */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Conservez ce lien précieusement</p>
                <p>
                  Cette page vous permet de consulter vos missions et de vous désinscrire si nécessaire.
                  Vous pouvez enregistrer cette page dans vos favoris ou retrouver le lien dans vos emails.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Missions count */}
        <Card>
          <CardHeader>
            <CardTitle>
              Vos missions ({missions.length})
            </CardTitle>
            <CardDescription>
              {missions.length === 0
                ? 'Vous n\'êtes inscrit à aucune mission pour le moment'
                : `Vous êtes inscrit à ${missions.length} mission${missions.length > 1 ? 's' : ''}`}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Missions list */}
        {missions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucune mission assignée pour le moment
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vous recevrez un email dès qu'une mission vous sera attribuée
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {missions.map((mission) => (
              <Card key={mission.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{mission.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={statusColors[mission.status]}>
                          {statusLabels[mission.status]}
                        </Badge>
                        {mission.isUrgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-muted-foreground">{mission.description}</p>

                  {/* Info grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    {/* Catégorie */}
                    {mission.category && (
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 text-muted-foreground mt-0.5">📂</div>
                        <div>
                          <p className="font-semibold text-sm">Catégorie</p>
                          <p className="text-sm text-muted-foreground">{mission.category}</p>
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    {mission.type === 'scheduled' && mission.startDate && (
                      <div className="flex items-start gap-3">
                        <CalendarIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Date et heure</p>
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

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Lieu</p>
                        <p className="text-sm text-muted-foreground">{mission.location}</p>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="flex items-start gap-3">
                      <UsersIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Bénévoles</p>
                        <p className="text-sm text-muted-foreground">
                          {mission.volunteers.length} / {mission.maxVolunteers} inscrit{mission.volunteers.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Unregister button */}
                  {mission.status !== 'completed' && mission.status !== 'cancelled' && (
                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleUnregister(mission.id, mission.title)}
                        disabled={unregisteringMissionId === mission.id}
                      >
                        {unregisteringMissionId === mission.id ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent mr-2"></div>
                            Désinscription...
                          </>
                        ) : (
                          <>
                            <LogOutIcon className="h-4 w-4 mr-2" />
                            Me désinscrire de cette mission
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <Card className="bg-gray-100">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Pour toute question, contactez l'équipe d'organisation du festival
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MyMissionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    }>
      <MyMissionsContent />
    </Suspense>
  );
}

