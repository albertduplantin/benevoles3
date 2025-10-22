'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPublishedMissions, getVisibleMissions, getAllMissions, deleteMission, duplicateMission } from '@/lib/firebase/missions';
import { registerToMission, unregisterFromMission } from '@/lib/firebase/registrations';
import { MissionClient, MissionStatus, MissionType, UserClient } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getGroupedCategories } from '@/lib/firebase/mission-categories-db';
import { MissionCategoryClient } from '@/types/category';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { isProfileComplete } from '@/lib/firebase/users';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils/date';
import { SearchIcon, FilterIcon, XIcon, EditIcon, TrashIcon, UserPlusIcon, UserMinusIcon, CalendarDaysIcon, CopyIcon } from 'lucide-react';
import { WhatsAppShareButton } from '@/components/features/missions/whatsapp-share-button';
import { useMissionPermissions } from '@/hooks/useMissionPermissions';
import { toast } from 'sonner';
import { MissionListSkeleton, MissionListSkeletonMobile } from '@/components/ui/mission-skeleton';
import { getAdminSettings } from '@/lib/firebase/admin-settings';
import { ExportButtons } from '@/components/features/exports/export-buttons';
import { getUserById } from '@/lib/firebase/users';
import { ResponsibleCategoriesBanner } from '@/components/features/category-responsibles/responsible-categories-banner';

// Fonction pour générer tous les jours entre deux dates
function generateFestivalDays(startDate: Date, endDate: Date): Array<{ date: string; label: string }> {
  const days: Array<{ date: string; label: string }> = [];
  
  // Utiliser les composantes de date locales pour éviter les problèmes de fuseau horaire
  let currentYear = startDate.getFullYear();
  let currentMonth = startDate.getMonth();
  let currentDay = startDate.getDate();
  
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();
  const endDay = endDate.getDate();

  while (true) {
    const current = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0);
    const end = new Date(endYear, endMonth, endDay, 0, 0, 0, 0);
    
    if (current > end) break;
    
    // Format YYYY-MM-DD pour la valeur
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Format français pour le label
    const label = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(current);
    
    days.push({ 
      date: dateStr, 
      label: label.charAt(0).toUpperCase() + label.slice(1) 
    });
    
    // Passer au jour suivant
    currentDay++;
    // Créer une nouvelle date pour gérer correctement le passage au mois suivant
    const nextDate = new Date(currentYear, currentMonth, currentDay);
    currentYear = nextDate.getFullYear();
    currentMonth = nextDate.getMonth();
    currentDay = nextDate.getDate();
  }
  
  return days;
}

// Fonction pour vérifier si une mission a lieu un jour donné
function missionHappenOnDay(mission: MissionClient, dayDate: string): boolean {
  if (mission.type === 'ongoing') {
    return true; // Les missions continues sont toujours visibles
  }
  
  if (!mission.startDate) {
    return false;
  }

  // Créer des COPIES des dates pour ne pas modifier les originales
  const missionStartOriginal = mission.startDate instanceof Date 
    ? mission.startDate 
    : new Date((mission.startDate as any).seconds * 1000);
  const missionEndOriginal = mission.endDate 
    ? (mission.endDate instanceof Date 
        ? mission.endDate 
        : new Date((mission.endDate as any).seconds * 1000))
    : missionStartOriginal;

  // Parser la date cible en tant que date locale (pas UTC)
  const [year, month, day] = dayDate.split('-').map(Number);
  const targetDay = new Date(year, month - 1, day, 0, 0, 0, 0);

  // Extraire le jour de début et fin de la mission (sans heures)
  const missionStartDay = new Date(
    missionStartOriginal.getFullYear(),
    missionStartOriginal.getMonth(),
    missionStartOriginal.getDate(),
    0, 0, 0, 0
  );
  
  const missionEndDay = new Date(
    missionEndOriginal.getFullYear(),
    missionEndOriginal.getMonth(),
    missionEndOriginal.getDate(),
    0, 0, 0, 0
  );

  console.log(`🔍 [FILTER] Mission "${mission.title}" - Target: ${targetDay.toLocaleDateString()} | Start: ${missionStartDay.toLocaleDateString()} | End: ${missionEndDay.toLocaleDateString()}`);

  // La mission a lieu ce jour si le jour cible est entre le début et la fin (inclus)
  const result = targetDay.getTime() >= missionStartDay.getTime() && targetDay.getTime() <= missionEndDay.getTime();
  console.log(`🔍 [FILTER] Result: ${result} (${targetDay.getTime()} >= ${missionStartDay.getTime()} && ${targetDay.getTime()} <= ${missionEndDay.getTime()})`);
  
  return result;
}

function MissionsPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [missions, setMissions] = useState<MissionClient[]>([]);
  const [isLoadingMissions, setIsLoadingMissions] = useState(true);
  const [groupedCategories, setGroupedCategories] = useState<Array<{ group: string; categories: MissionCategoryClient[] }>>([]);
  
  // États pour les filtres
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDay, setFilterDay] = useState<string>('all');
  const [showMyMissionsOnly, setShowMyMissionsOnly] = useState(false);
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [festivalDays, setFestivalDays] = useState<Array<{ date: string; label: string }>>([]);
  
  // Filtres intelligents
  const [smartFilter, setSmartFilter] = useState<string | null>(null);
  
  // État pour la modale mobile
  const [selectedMission, setSelectedMission] = useState<MissionClient | null>(null);
  
  // État pour la suppression
  const [missionToDelete, setMissionToDelete] = useState<MissionClient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // État pour l'inscription/désinscription
  const [isRegistering, setIsRegistering] = useState<string | null>(null);
  
  // État pour l'export de planning
  const [missionParticipants, setMissionParticipants] = useState<Map<string, UserClient[]>>(new Map());

  // Calculer les permissions pour toutes les missions
  const missionPermissions = useMissionPermissions(user, missions);

  // Détecter le paramètre URL "filter=my"
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'my') {
      setShowMyMissionsOnly(true);
    } else {
      // Si on arrive sur /dashboard/missions sans le paramètre ?filter=my,
      // on décoche "Mes missions uniquement"
      setShowMyMissionsOnly(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && !isProfileComplete(user)) {
      router.push('/auth/complete-profile');
    }
  }, [user, loading, router]);

  // Charger les dates du festival
  useEffect(() => {
    const loadFestivalDates = async () => {
      try {
        const settings = await getAdminSettings();
        if (settings.festivalStartDate && settings.festivalEndDate) {
          const days = generateFestivalDays(settings.festivalStartDate, settings.festivalEndDate);
          setFestivalDays(days);
        }
      } catch (error) {
        console.error('Error loading festival dates:', error);
      }
    };
    loadFestivalDates();
  }, []);

  // Charger les catégories depuis Firestore
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getGroupedCategories();
        setGroupedCategories(categories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchMissions = async () => {
      if (!user) return;

      try {
        console.log('Fetching missions for user role:', user.role);
        // Les admins voient toutes les missions
        // Les responsables de catégories et bénévoles voient les missions publiées ET complètes
        const data =
          user.role === 'admin'
            ? await getAllMissions()
            : await getVisibleMissions();
        console.log('Missions fetched:', data.length, data);
        setMissions(data);
      } catch (error) {
        console.error('Error fetching missions:', error);
      } finally {
        setIsLoadingMissions(false);
      }
    };

    fetchMissions();
  }, [user]);

  // Charger les participants pour l'export de planning (uniquement si "Mes missions" est activé)
  useEffect(() => {
    const loadParticipants = async () => {
      if (!user || !showMyMissionsOnly || user.role === 'admin' || missions.length === 0) return;

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
  }, [showMyMissionsOnly, missions, user]);
  
  // Fonction pour supprimer une mission
  const handleDeleteMission = async () => {
    if (!missionToDelete || !user) return;
    
    setIsDeleting(true);
    try {
      await deleteMission(missionToDelete.id);
      setMissions(missions.filter(m => m.id !== missionToDelete.id));
      toast.success('Mission supprimée avec succès');
      setMissionToDelete(null);
    } catch (error: any) {
      console.error('Error deleting mission:', error);
      toast.error(error.message || 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Fonction pour s'inscrire à une mission
  const handleRegister = async (missionId: string) => {
    if (!user) return;
    
    setIsRegistering(missionId);
    try {
      await registerToMission(missionId, user.uid);
      // Mettre à jour la mission dans l'état local
      setMissions(missions.map(m => 
        m.id === missionId 
          ? { ...m, volunteers: [...m.volunteers, user.uid] }
          : m
      ));
      toast.success('Inscription réussie !');
    } catch (error: any) {
      console.error('Error registering:', error);
      toast.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsRegistering(null);
    }
  };
  
  // Fonction pour se désinscrire d'une mission
  const handleUnregister = async (missionId: string) => {
    if (!user) return;
    
    setIsRegistering(missionId);
    try {
      await unregisterFromMission(missionId, user.uid);
      // Mettre à jour la mission dans l'état local
      setMissions(missions.map(m => 
        m.id === missionId 
          ? { ...m, volunteers: m.volunteers.filter(id => id !== user.uid) }
          : m
      ));
      toast.success('Désinscription réussie');
    } catch (error: any) {
      console.error('Error unregistering:', error);
      toast.error(error.message || 'Erreur lors de la désinscription');
    } finally {
      setIsRegistering(null);
    }
  };

  // Filtrer les missions
  const filteredMissions = useMemo(() => {
    return missions.filter((mission) => {
      // Filtre par catégorie
      if (filterCategory !== 'all' && mission.category !== filterCategory) {
        return false;
      }

      // Filtre par jour du festival
      if (filterDay !== 'all') {
        // Cas spécial : missions au long cours uniquement
        if (filterDay === 'ongoing') {
          if (mission.type !== 'ongoing') {
            return false;
          }
        } else {
          // Filtre par jour spécifique
          if (!missionHappenOnDay(mission, filterDay)) {
            return false;
          }
        }
      }

      // Filtre "Mes missions" (seulement les missions où l'utilisateur est inscrit)
      if (showMyMissionsOnly && user && !mission.volunteers.includes(user.uid)) {
        return false;
      }

      // Filtre urgentes uniquement
      if (showUrgentOnly && !mission.isUrgent) {
        return false;
      }

      // Filtres intelligents
      if (smartFilter) {
        const now = new Date();
        
        if (smartFilter === 'weekend') {
          // Missions ce week-end
          if (!mission.startDate) return false;
          const missionDate = new Date(mission.startDate);
          const day = missionDate.getDay();
          // 0 = dimanche, 6 = samedi
          if (day !== 0 && day !== 6) return false;
        }
        
        if (smartFilter === 'short') {
          // Missions courtes (<3h)
          if (!mission.startDate || !mission.endDate) return false;
          const duration = (new Date(mission.endDate).getTime() - new Date(mission.startDate).getTime()) / (1000 * 60 * 60);
          if (duration >= 3) return false;
        }
        
        if (smartFilter === 'evening') {
          // Missions de soirée (après 18h)
          if (!mission.startDate) return false;
          const hour = new Date(mission.startDate).getHours();
          if (hour < 18) return false;
        }
        
        if (smartFilter === 'morning') {
          // Missions de matin (avant 12h)
          if (!mission.startDate) return false;
          const hour = new Date(mission.startDate).getHours();
          if (hour >= 12) return false;
        }
        
        if (smartFilter === 'lowDemand') {
          // Missions peu demandées (<50% rempli)
          const fillRate = (mission.volunteers.length / mission.maxVolunteers) * 100;
          if (fillRate >= 50) return false;
        }
      }

      return true;
    });
  }, [missions, filterCategory, filterDay, showMyMissionsOnly, showUrgentOnly, smartFilter, user]);

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setFilterCategory('all');
    setFilterDay('all');
    setShowMyMissionsOnly(false);
    setShowUrgentOnly(false);
    setSmartFilter(null);
    // Retirer le paramètre URL
    router.push('/dashboard/missions');
  };

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = filterCategory !== 'all' || filterDay !== 'all' || showMyMissionsOnly || showUrgentOnly || smartFilter !== null;

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';
  const canCreateMission = isAdmin || user.role === 'category_responsible';
  
  // Filtrer les missions du bénévole pour l'export
  const myMissions = missions.filter(m => m.volunteers.includes(user.uid));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Missions</h1>
          <p className="text-muted-foreground">
            {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''} 
            {hasActiveFilters ? ' (filtrées)' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isAdmin && myMissions.length > 0 && (
            <ExportButtons
              type="volunteer-planning"
              missions={myMissions}
              volunteerName={`${user.firstName} ${user.lastName}`}
              allParticipants={missionParticipants}
            />
          )}
          {canCreateMission && (
            <Button asChild>
              <Link href="/dashboard/missions/new">Nouvelle mission</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Bandeau pour les responsables de catégorie */}
      <ResponsibleCategoriesBanner />

      {/* Filtres Rapides / Intelligents */}
      {!isAdmin && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">⚡</span>
              Filtres Rapides
            </CardTitle>
            <CardDescription>
              Trouvez rapidement les missions qui vous correspondent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={smartFilter === 'weekend' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80 transition-colors px-3 py-1.5 text-sm"
                onClick={() => setSmartFilter(smartFilter === 'weekend' ? null : 'weekend')}
              >
                📅 Ce week-end
              </Badge>
              <Badge
                variant={smartFilter === 'short' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80 transition-colors px-3 py-1.5 text-sm"
                onClick={() => setSmartFilter(smartFilter === 'short' ? null : 'short')}
              >
                ⏰ Courtes (&lt;3h)
              </Badge>
              <Badge
                variant={smartFilter === 'evening' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80 transition-colors px-3 py-1.5 text-sm"
                onClick={() => setSmartFilter(smartFilter === 'evening' ? null : 'evening')}
              >
                🌙 Soirée (après 18h)
              </Badge>
              <Badge
                variant={smartFilter === 'morning' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80 transition-colors px-3 py-1.5 text-sm"
                onClick={() => setSmartFilter(smartFilter === 'morning' ? null : 'morning')}
              >
                🌅 Matin (avant 12h)
              </Badge>
              <Badge
                variant={smartFilter === 'lowDemand' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80 transition-colors px-3 py-1.5 text-sm"
                onClick={() => setSmartFilter(smartFilter === 'lowDemand' ? null : 'lowDemand')}
              >
                💪 Peu demandées (&lt;50%)
              </Badge>
              <Badge
                variant={showUrgentOnly ? 'destructive' : 'outline'}
                className="cursor-pointer hover:bg-destructive/80 transition-colors px-3 py-1.5 text-sm border-red-300"
                onClick={() => setShowUrgentOnly(!showUrgentOnly)}
              >
                🔥 Urgentes
              </Badge>
            </div>
            {smartFilter && (
              <p className="text-xs text-muted-foreground mt-3">
                💡 Cliquez à nouveau sur le filtre pour le désactiver
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5" />
              <CardTitle className="text-xl">Filtres</CardTitle>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <XIcon className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtre Catégorie */}
            <div className="space-y-2">
              <Label htmlFor="filterCategory">Catégorie</Label>
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">Toutes les catégories</option>
                {groupedCategories.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.categories.map((cat) => (
                      <option key={cat.id} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Filtre par jour du festival */}
            {festivalDays.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="filterDay" className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4" />
                  Jour du festival
                </Label>
                <select
                  id="filterDay"
                  value={filterDay}
                  onChange={(e) => setFilterDay(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">Tous les jours</option>
                  {festivalDays.map((day) => (
                    <option key={day.date} value={day.date}>
                      {day.label}
                    </option>
                  ))}
                  <option value="ongoing">Missions au long cours</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Afficher uniquement les missions ayant lieu ce jour-là
                </p>
              </div>
            )}

            {/* Options de filtrage */}
            {!isAdmin && (
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="myMissions"
                      checked={showMyMissionsOnly}
                      onChange={(e) => setShowMyMissionsOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <label htmlFor="myMissions" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Mes missions uniquement
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste des missions */}
      {isLoadingMissions ? (
        <>
          {/* Skeleton pour desktop */}
          <div className="hidden md:block">
            <MissionListSkeleton count={6} />
          </div>
          {/* Skeleton pour mobile */}
          <div className="md:hidden">
            <MissionListSkeletonMobile count={8} />
          </div>
        </>
      ) : filteredMissions.length === 0 && missions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucune mission trouvée</CardTitle>
            <CardDescription>
              Aucune mission ne correspond à vos critères de recherche.
              {hasActiveFilters && (
                <Button variant="link" onClick={resetFilters} className="p-0 h-auto ml-1">
                  Réinitialiser les filtres
                </Button>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : filteredMissions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucune mission disponible</CardTitle>
            <CardDescription>
              {isAdmin
                ? 'Créez votre première mission pour commencer !'
                : 'Aucune mission n\'est disponible pour le moment.'}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {/* Vue mobile ultra-compacte */}
          <div className="md:hidden space-y-1.5">
            {filteredMissions.map((mission) => {
              const isRegistered = user && mission.volunteers.includes(user.uid);
              const isFull = mission.volunteers.length >= mission.maxVolunteers;
              const canRegister = mission.status === 'published' && !isFull;
              
              return (
                <Card 
                  key={mission.id} 
                  className={`hover:shadow-md transition-shadow ${mission.isUrgent ? 'border-l-4 border-l-red-500' : ''}`}
                >
                  <div className="p-2.5 space-y-1" onClick={() => setSelectedMission(mission)}>
                    {/* Ligne 1: Titre et badge urgent */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold line-clamp-1 flex-1 cursor-pointer">
                        {mission.title}
                      </h3>
                      {mission.isUrgent && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                          URG
                        </Badge>
                      )}
                    </div>
                    
                    {/* Ligne 2: Infos + bouton action */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                        <span className="truncate max-w-[120px]">📍 {mission.location}</span>
                        <span className="shrink-0">👥 {mission.volunteers.length}/{mission.maxVolunteers}</span>
                      </div>
                      
                      {/* Bouton d'action discret */}
                      {!isAdmin && (
                        <div onClick={(e) => e.stopPropagation()}>
                          {isRegistered ? (
                            <button
                              onClick={() => handleUnregister(mission.id)}
                              disabled={isRegistering === mission.id}
                              className="p-1 rounded-full hover:bg-orange-100 text-orange-600 transition-colors disabled:opacity-50"
                              title="Se désinscrire"
                            >
                              {isRegistering === mission.id ? (
                                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <UserMinusIcon className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRegister(mission.id)}
                              disabled={isRegistering === mission.id || !canRegister}
                              className={`p-1 rounded-full transition-colors disabled:opacity-50 ${
                                canRegister 
                                  ? 'hover:bg-green-100 text-green-600' 
                                  : 'text-gray-400'
                              }`}
                              title={
                                !canRegister && mission.status !== 'published'
                                  ? 'Mission non publiée'
                                  : isFull
                                  ? 'Mission complète'
                                  : 'S\'inscrire'
                              }
                            >
                              {isRegistering === mission.id ? (
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <UserPlusIcon className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Vue desktop (grille) */}
          <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMissions.map((mission) => (
            <Card key={mission.id} className={mission.isUrgent ? 'border-red-500 border-2' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {mission.title}
                      {mission.isUrgent && (
                        <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                          URGENT
                        </span>
                      )}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Badge catégorie */}
                      {mission.category && (
                        <Badge variant="outline" className="text-xs">
                          {mission.category}
                        </Badge>
                      )}
                      {/* Badge si l'utilisateur est inscrit */}
                      {user && mission.volunteers.includes(user.uid) && (
                        <Badge className="bg-blue-600 text-white">
                          ✓ Inscrit
                        </Badge>
                      )}
                      {/* Badge si l'utilisateur est responsable */}
                      {user && mission.responsibles.includes(user.uid) && (
                        <Badge className="bg-purple-600 text-white">
                          👑 Responsable
                        </Badge>
                      )}
                      {/* Badge pour les admins : demandes en attente (seulement si pas encore de responsable) */}
                      {isAdmin && mission.pendingResponsibles && mission.pendingResponsibles.length > 0 && mission.responsibles.length === 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {mission.pendingResponsibles.length} demande{mission.pendingResponsibles.length > 1 ? 's' : ''} responsable
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      mission.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : mission.status === 'draft'
                        ? 'bg-gray-100 text-gray-800'
                        : mission.status === 'full'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {mission.status === 'published' && 'Publiée'}
                    {mission.status === 'draft' && 'Brouillon'}
                    {mission.status === 'full' && 'Complète'}
                    {mission.status === 'cancelled' && 'Annulée'}
                    {mission.status === 'completed' && 'Terminée'}
                  </span>
                </div>
                <CardDescription className="line-clamp-2">
                  {mission.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <p className="font-semibold">📍 {mission.location}</p>
                  {mission.type === 'scheduled' && mission.startDate && (
                    <p className="text-muted-foreground">
                      📅 {formatDateTime(mission.startDate)}
                    </p>
                  )}
                  {mission.type === 'ongoing' && (
                    <p className="text-muted-foreground">⏱️ Mission au long cours</p>
                  )}
                  <p className="text-muted-foreground">
                    👥 {mission.volunteers.length}/{mission.maxVolunteers} bénévoles
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/dashboard/missions/${mission.id}`}>Voir détails</Link>
                  </Button>
                  
                  {/* Bouton Partage WhatsApp - Accessible à tous */}
                  <WhatsAppShareButton mission={mission} size="icon" showLabel={false} />
                  
                  {missionPermissions.get(mission.id)?.canEdit ? (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          if (!user) return;
                          try {
                            const newMissionId = await duplicateMission(mission.id, user.uid);
                            toast.success('✅ Mission dupliquée avec succès !');
                            router.push(`/dashboard/missions/${newMissionId}/edit`);
                          } catch (err: any) {
                            toast.error(err.message || 'Erreur lors de la duplication');
                          }
                        }}
                        title="Dupliquer"
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        title="Éditer"
                      >
                        <Link href={`/dashboard/missions/${mission.id}/edit`}>
                          <EditIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                      {missionPermissions.get(mission.id)?.canDelete && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setMissionToDelete(mission)}
                          title="Supprimer"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      {user && mission.volunteers.includes(user.uid) ? (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUnregister(mission.id)}
                          disabled={isRegistering === mission.id}
                          title="Se désinscrire"
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        >
                          {isRegistering === mission.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
                          ) : (
                            <UserMinusIcon className="h-4 w-4" />
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRegister(mission.id)}
                          disabled={
                            isRegistering === mission.id ||
                            mission.status !== 'published' ||
                            mission.volunteers.length >= mission.maxVolunteers
                          }
                          title={
                            mission.status !== 'published'
                              ? 'Mission non publiée'
                              : mission.volunteers.length >= mission.maxVolunteers
                              ? 'Mission complète'
                              : 'S\'inscrire'
                          }
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          {isRegistering === mission.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                          ) : (
                            <UserPlusIcon className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </>
      )}
      
      {/* Modale détails mission (mobile) */}
      <Dialog open={!!selectedMission} onOpenChange={(open) => !open && setSelectedMission(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          {selectedMission && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-start gap-2">
                  <span className="flex-1">
                    {selectedMission.title}
                  </span>
                  {selectedMission.isUrgent && (
                    <Badge variant="destructive" className="text-xs shrink-0">
                      URGENT
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {selectedMission.category}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        selectedMission.status === 'published' ? 'bg-green-100 text-green-800' :
                        selectedMission.status === 'full' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedMission.status === 'published' && 'Publiée'}
                      {selectedMission.status === 'draft' && 'Brouillon'}
                      {selectedMission.status === 'full' && 'Complète'}
                      {selectedMission.status === 'cancelled' && 'Annulée'}
                      {selectedMission.status === 'completed' && 'Terminée'}
                    </Badge>
                    {user && selectedMission.volunteers.includes(user.uid) && (
                      <Badge className="bg-blue-600 text-white text-xs">
                        ✓ Inscrit
                      </Badge>
                    )}
                    {user && selectedMission.responsibles.includes(user.uid) && (
                      <Badge className="bg-purple-600 text-white text-xs">
                        👑 Responsable
                      </Badge>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <DialogDescription className="text-sm">
                  {selectedMission.description}
                </DialogDescription>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">📍 Lieu :</span>
                    <span>{selectedMission.location}</span>
                  </div>
                  
                  {selectedMission.type === 'scheduled' && selectedMission.startDate && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">📅 Date :</span>
                      <span>{formatDateTime(selectedMission.startDate)}</span>
                    </div>
                  )}
                  
                  {selectedMission.type === 'ongoing' && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">⏱️ Type :</span>
                      <span>Mission au long cours</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">👥 Bénévoles :</span>
                    <span>{selectedMission.volunteers.length}/{selectedMission.maxVolunteers}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => {
                      setSelectedMission(null);
                      router.push(`/dashboard/missions/${selectedMission.id}`);
                    }}
                  >
                    Voir détails
                  </Button>
                  
                  {/* Bouton Partage WhatsApp - Accessible à tous */}
                  <WhatsAppShareButton mission={selectedMission} size="icon" showLabel={false} />
                  
                  {missionPermissions.get(selectedMission.id)?.canEdit ? (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          if (!user) return;
                          setSelectedMission(null);
                          try {
                            const newMissionId = await duplicateMission(selectedMission.id, user.uid);
                            toast.success('✅ Mission dupliquée avec succès !');
                            router.push(`/dashboard/missions/${newMissionId}/edit`);
                          } catch (err: any) {
                            toast.error(err.message || 'Erreur lors de la duplication');
                          }
                        }}
                        title="Dupliquer"
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedMission(null);
                          router.push(`/dashboard/missions/${selectedMission.id}/edit`);
                        }}
                        title="Éditer"
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      {missionPermissions.get(selectedMission.id)?.canDelete && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setMissionToDelete(selectedMission);
                            setSelectedMission(null);
                          }}
                          title="Supprimer"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      {user && selectedMission.volunteers.includes(user.uid) ? (
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleUnregister(selectedMission.id);
                            setSelectedMission(null);
                          }}
                          disabled={isRegistering === selectedMission.id}
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        >
                          {isRegistering === selectedMission.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
                          ) : (
                            <>
                              <UserMinusIcon className="h-4 w-4 mr-2" />
                              Se désinscrire
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            handleRegister(selectedMission.id);
                            setSelectedMission(null);
                          }}
                          disabled={
                            isRegistering === selectedMission.id ||
                            selectedMission.status !== 'published' ||
                            selectedMission.volunteers.length >= selectedMission.maxVolunteers
                          }
                          className={
                            selectedMission.status !== 'published' ||
                            selectedMission.volunteers.length >= selectedMission.maxVolunteers
                              ? 'bg-gray-400'
                              : 'bg-green-600 hover:bg-green-700'
                          }
                        >
                          {isRegistering === selectedMission.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          ) : (
                            <>
                              <UserPlusIcon className="h-4 w-4 mr-2" />
                              {selectedMission.status !== 'published'
                                ? 'Non publiée'
                                : selectedMission.volunteers.length >= selectedMission.maxVolunteers
                                ? 'Complète'
                                : 'S\'inscrire'}
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!missionToDelete} onOpenChange={(open) => !open && setMissionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette mission ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la mission "{missionToDelete?.title}" ?
              Cette action est irréversible et supprimera également toutes les inscriptions associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMission}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function MissionsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p>Chargement...</p></div>}>
      <MissionsPageContent />
    </Suspense>
  );
}
