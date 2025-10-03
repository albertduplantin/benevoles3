'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isProfileComplete, getUserById } from '@/lib/firebase/users';
import { getUserMissions, getAllMissions } from '@/lib/firebase/missions';
import { getAdminSettings, updateAdminSettings } from '@/lib/firebase/admin-settings';
import { MissionClient, UserClient } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MissionCalendar } from '@/components/features/calendar/mission-calendar';
import { VolunteerCallGenerator } from '@/components/features/admin/volunteer-call-generator';
import { ExportButtons } from '@/components/features/exports/export-buttons';
import Link from 'next/link';
import {
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  TrendingUpIcon,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [missions, setMissions] = useState<MissionClient[]>([]);
  const [allMissions, setAllMissions] = useState<MissionClient[]>([]);
  const [isLoadingMissions, setIsLoadingMissions] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [missionParticipants, setMissionParticipants] = useState<Map<string, UserClient[]>>(new Map());
  const [allVolunteersMap, setAllVolunteersMap] = useState<Map<string, UserClient>>(new Map());

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && !isProfileComplete(user)) {
      router.push('/auth/complete-profile');
    }
  }, [user, loading, router]);

  // Charger les missions de l'utilisateur
  useEffect(() => {
    const loadMissions = async () => {
      if (!user) return;
      try {
        setIsLoadingMissions(true);
        const userMissions = await getUserMissions(user.uid);
        setMissions(userMissions);

        // Pour les admins et responsables, charger toutes les missions
        if (user.role === 'admin' || user.role === 'mission_responsible') {
          const all = await getAllMissions();
          setAllMissions(all);
        }

        // Charger les participants pour chaque mission du bénévole (pour l'export planning)
        if (user.role === 'volunteer') {
          const participantsMap = new Map<string, UserClient[]>();
          for (const mission of userMissions) {
            try {
              const participants: UserClient[] = [];
              for (const uid of mission.volunteers) {
                const participant = await getUserById(uid);
                if (participant) {
                  participants.push(participant);
                }
              }
              participantsMap.set(mission.id, participants);
            } catch (error) {
              console.error(`Error loading participants for mission ${mission.id}:`, error);
            }
          }
          setMissionParticipants(participantsMap);
        }

        // Pour les admins, charger tous les bénévoles (pour l'export planning global)
        if (user.role === 'admin') {
          const allMissionsForAdmin = await getAllMissions();
          const uniqueVolunteerIds = new Set<string>();
          
          // Collecter tous les UIDs de bénévoles uniques
          allMissionsForAdmin.forEach((mission) => {
            mission.volunteers.forEach((uid) => uniqueVolunteerIds.add(uid));
            mission.responsibles.forEach((uid) => uniqueVolunteerIds.add(uid));
          });

          // Charger les données de chaque bénévole
          const volunteersMap = new Map<string, UserClient>();
          for (const uid of uniqueVolunteerIds) {
            try {
              const volunteer = await getUserById(uid);
              if (volunteer) {
                volunteersMap.set(uid, volunteer);
              }
            } catch (error) {
              console.error(`Error loading volunteer ${uid}:`, error);
            }
          }
          setAllVolunteersMap(volunteersMap);
        }
      } catch (error) {
        console.error('Error loading missions:', error);
      } finally {
        setIsLoadingMissions(false);
      }
    };
    loadMissions();
  }, [user]);

  // Charger les paramètres admin (seulement pour les admins)
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        return;
      }
      
      if (user.role !== 'admin') {
        setIsLoadingSettings(false);
        return;
      }
      
      try {
        setIsLoadingSettings(true);
        const settings = await getAdminSettings();
        setAutoApprove(settings.autoApproveResponsibility);
      } catch (error) {
        console.error('Error loading admin settings:', error);
      } finally {
        setIsLoadingSettings(false);
      }
    };
    loadSettings();
  }, [user]);

  const handleToggleAutoApprove = async (checked: boolean) => {
    if (!user || user.role !== 'admin') return;
    
    setIsSavingSettings(true);
    try {
      await updateAdminSettings({ autoApproveResponsibility: checked }, user.uid);
      setAutoApprove(checked);
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  // Statistiques
  const upcomingMissions = missions.filter(
    (m) => m.startDate && new Date(m.startDate) > new Date()
  );
  const completedMissions = missions.filter((m) => m.status === 'completed');
  
  // Stats admin
  const totalMissions = allMissions.length;
  const publishedMissions = allMissions.filter((m) => m.status === 'published').length;
  const pendingRequests = allMissions.reduce(
    (sum, m) => sum + (m.pendingResponsibles?.length || 0),
    0
  );
  const totalVolunteers = new Set(
    allMissions.flatMap((m) => m.volunteers)
  ).size;

  // Missions que l'utilisateur coordonne (responsable)
  const coordinatingMissions = allMissions.filter((m) =>
    m.responsibles.includes(user.uid)
  );

  const isAdmin = user.role === 'admin';
  const isResponsible = user.role === 'mission_responsible' || coordinatingMissions.length > 0;

  return (
    <div className="space-y-6">
      {/* Header simplifié */}
      <div>
        <h1 className="text-3xl font-bold">
          {isAdmin ? 'Tableau de bord' : 'Mon Tableau de bord'}
        </h1>
        <p className="text-muted-foreground">
          Bienvenue, {user.firstName} 👋
        </p>
      </div>

        {/* Stats Cards */}
        {isAdmin ? (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Missions</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMissions}</div>
                <p className="text-xs text-muted-foreground">
                  {publishedMissions} publiées
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bénévoles Actifs</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVolunteers}</div>
                <p className="text-xs text-muted-foreground">
                  Inscrits aux missions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demandes</CardTitle>
                <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingRequests}</div>
                <p className="text-xs text-muted-foreground">
                  En attente validation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de Remplissage</CardTitle>
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalMissions > 0
                    ? Math.round(
                        (allMissions.reduce((sum, m) => sum + m.volunteers.length, 0) /
                          allMissions.reduce((sum, m) => sum + m.maxVolunteers, 0)) *
                          100
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Moyenne globale
                </p>
              </CardContent>
            </Card>
          </div>
        ) : isResponsible ? (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Missions Coordonnées</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{coordinatingMissions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Dont vous êtes responsable
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mes Missions</CardTitle>
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{missions.length}</div>
                <p className="text-xs text-muted-foreground">
                  {upcomingMissions.length} à venir
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Terminées</CardTitle>
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedMissions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Missions accomplies
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mes Missions</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{missions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Missions inscrites
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">À Venir</CardTitle>
                <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingMissions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Missions futures
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Terminées</CardTitle>
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedMissions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Missions accomplies
                </p>
              </CardContent>
            </Card>
          </div>
        )}

      {/* Calendrier - Plus central et épuré */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mon Calendrier</CardTitle>
              <CardDescription>
                Visualisez vos missions sur le calendrier
              </CardDescription>
            </div>
            {!isAdmin && missions.length > 0 && !isLoadingMissions && (
              <ExportButtons
                type="volunteer-planning"
                missions={missions}
                volunteerName={`${user.firstName} ${user.lastName}`}
                allParticipants={missionParticipants}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingMissions ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : (
            <MissionCalendar
              missions={isAdmin ? allMissions : missions}
              currentUserId={user.uid}
            />
          )}
        </CardContent>
      </Card>

      {/* Section inférieure : Appel Bénévoles et Paramètres Admin ou Missions Coordonnées */}
      {isAdmin && !isLoadingSettings && (
        <>
          {/* Communication et Exports */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Générateur d'appel aux bénévoles */}
            <Card>
              <CardHeader>
                <CardTitle>Communication</CardTitle>
                <CardDescription>
                  Générez un message d'appel aux bénévoles pour les missions incomplètes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VolunteerCallGenerator missions={allMissions} />
              </CardContent>
            </Card>

            {/* Exports de données */}
            <Card>
              <CardHeader>
                <CardTitle>Exports</CardTitle>
                <CardDescription>
                  Exportez les statistiques et données du festival au format PDF ou Excel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExportButtons
                  type="global"
                  missions={allMissions}
                  totalVolunteers={totalVolunteers}
                  allVolunteers={allVolunteersMap}
                />
              </CardContent>
            </Card>
          </div>

          {/* Paramètres Admin */}
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Administrateur</CardTitle>
              <CardDescription>
              Configuration de la validation des demandes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="auto-approve" className="text-base">
                  Validation automatique des responsables
                </Label>
                <p className="text-sm text-muted-foreground">
                  Les bénévoles deviennent automatiquement responsables sans validation manuelle
                </p>
              </div>
              <Switch
                id="auto-approve"
                checked={autoApprove}
                onCheckedChange={handleToggleAutoApprove}
                disabled={isSavingSettings}
              />
            </div>
          </CardContent>
        </Card>
        </>
      )}

      {/* Missions Coordonnées (Responsable) */}
      {!isAdmin && isResponsible && coordinatingMissions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Missions que je coordonne</CardTitle>
                <CardDescription>
                  Les missions dont vous êtes responsable
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/missions">Voir tout</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {coordinatingMissions.slice(0, 3).map((mission) => (
                <Link
                  key={mission.id}
                  href={`/dashboard/missions/${mission.id}`}
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{mission.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {mission.volunteers.length}/{mission.maxVolunteers} bénévoles
                      </p>
                    </div>
                    <Badge className="bg-purple-600">👑 Responsable</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
