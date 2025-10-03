'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from '@/lib/firebase/auth';
import { isProfileComplete } from '@/lib/firebase/users';
import { getUserMissions, getAllMissions } from '@/lib/firebase/missions';
import { getAdminSettings, updateAdminSettings } from '@/lib/firebase/admin-settings';
import { MissionClient } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MissionCalendar } from '@/components/features/calendar/mission-calendar';
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

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {isAdmin ? 'Dashboard Administrateur' : isResponsible ? 'Dashboard Responsable' : 'Mon Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              Bienvenue, {user.firstName} {user.lastName}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Déconnexion
          </Button>
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

        {/* Calendrier */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isAdmin
                ? 'Calendrier des Missions'
                : isResponsible
                ? 'Calendrier de Mes Missions'
                : 'Mon Calendrier'}
            </CardTitle>
            <CardDescription>
              {isAdmin
                ? 'Vue d\'ensemble de toutes les missions'
                : 'Visualisez vos missions sur le calendrier'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMissions ? (
              <p>Chargement du calendrier...</p>
            ) : (
              <MissionCalendar
                missions={isAdmin ? allMissions : missions}
                currentUserId={user.uid}
              />
            )}
          </CardContent>
        </Card>

        {/* Actions Rapides */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/dashboard/missions">Voir toutes les missions</Link>
              </Button>
              {isAdmin && (
                <Button asChild className="w-full" variant="secondary">
                  <Link href="/dashboard/missions/new">Créer une mission</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Paramètres Admin */}
          {isAdmin && !isLoadingSettings && (
            <Card>
              <CardHeader>
                <CardTitle>Paramètres</CardTitle>
                <CardDescription>
                  Configuration des validations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="auto-approve">Validation automatique</Label>
                    <p className="text-xs text-muted-foreground">
                      Approuver automatiquement les demandes de responsabilité
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
          )}

          {/* Missions Coordonnées (Responsable) */}
          {isResponsible && coordinatingMissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Missions que je coordonne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {coordinatingMissions.slice(0, 3).map((mission) => (
                    <Link
                      key={mission.id}
                      href={`/dashboard/missions/${mission.id}`}
                      className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <p className="font-semibold">{mission.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {mission.volunteers.length}/{mission.maxVolunteers} bénévoles
                      </p>
                    </Link>
                  ))}
                  {coordinatingMissions.length > 3 && (
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/missions">
                        Voir toutes ({coordinatingMissions.length})
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
