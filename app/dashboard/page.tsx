'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isProfileComplete, getUserById } from '@/lib/firebase/users';
import { getUserMissions, getAllMissions } from '@/lib/firebase/missions';
import { MissionClient, UserClient } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MissionCalendar } from '@/components/features/calendar/mission-calendar';
import { ExportButtons } from '@/components/features/exports/export-buttons';

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [missions, setMissions] = useState<MissionClient[]>([]);
  const [allMissions, setAllMissions] = useState<MissionClient[]>([]);
  const [isLoadingMissions, setIsLoadingMissions] = useState(true);
  const [missionParticipants, setMissionParticipants] = useState<Map<string, UserClient[]>>(new Map());

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/auth/login');
    } else if (!isProfileComplete(user)) {
      router.push('/auth/complete-profile');
    }
  }, [user, loading, router]);

  // Charger les missions
  useEffect(() => {
    const loadMissions = async () => {
      if (!user) return;
      try {
        setIsLoadingMissions(true);
        const userMissions = await getUserMissions(user.uid);
        setMissions(userMissions);

        // Pour les admins et responsables, charger toutes les missions
        if (user.role === 'admin' || user.role === 'category_responsible') {
          const all = await getAllMissions();
          setAllMissions(all);
        }

        // Charger les participants pour l'export planning
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
      } catch (error) {
        console.error('Error loading missions:', error);
      } finally {
        setIsLoadingMissions(false);
      }
    };
    loadMissions();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Calendrier</h1>
        <p className="text-muted-foreground">
          Visualisez toutes vos missions
        </p>
      </div>

      {/* Calendrier */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mes Missions</CardTitle>
              <CardDescription>
                Planning complet de vos missions
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
              isAdmin={isAdmin}
              onDelete={(missionId) => {
                setAllMissions(allMissions.filter(m => m.id !== missionId));
                setMissions(missions.filter(m => m.id !== missionId));
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
