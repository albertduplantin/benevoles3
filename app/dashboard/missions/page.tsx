'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getPublishedMissions, getAllMissions } from '@/lib/firebase/missions';
import { MissionClient, MissionStatus, MissionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isProfileComplete } from '@/lib/firebase/users';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils/date';
import { SearchIcon, FilterIcon, XIcon } from 'lucide-react';

export default function MissionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [missions, setMissions] = useState<MissionClient[]>([]);
  const [isLoadingMissions, setIsLoadingMissions] = useState(true);
  
  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<MissionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<MissionStatus | 'all'>('all');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && !isProfileComplete(user)) {
      router.push('/auth/complete-profile');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchMissions = async () => {
      if (!user) return;

      try {
        console.log('Fetching missions for user role:', user.role);
        // Les admins voient toutes les missions, les bénévoles seulement les publiées
        const data =
          user.role === 'admin'
            ? await getAllMissions()
            : await getPublishedMissions();
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

  // Filtrer les missions
  const filteredMissions = useMemo(() => {
    return missions.filter((mission) => {
      // Filtre par recherche (titre)
      if (searchQuery && !mission.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filtre par type
      if (filterType !== 'all' && mission.type !== filterType) {
        return false;
      }

      // Filtre par statut
      if (filterStatus !== 'all' && mission.status !== filterStatus) {
        return false;
      }

      // Filtre urgentes uniquement
      if (showUrgentOnly && !mission.isUrgent) {
        return false;
      }

      return true;
    });
  }, [missions, searchQuery, filterType, filterStatus, showUrgentOnly]);

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterStatus('all');
    setShowUrgentOnly(false);
  };

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = searchQuery || filterType !== 'all' || filterStatus !== 'all' || showUrgentOnly;

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

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
        {isAdmin && (
          <Button asChild>
            <Link href="/dashboard/missions/new">Nouvelle mission</Link>
          </Button>
        )}
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Rechercher par titre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtre Type */}
            <div className="space-y-2">
              <Label htmlFor="filterType">Type</Label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as MissionType | 'all')}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">Tous les types</option>
                <option value="scheduled">Planifiée</option>
                <option value="ongoing">Au long cours</option>
              </select>
            </div>

            {/* Filtre Statut */}
            <div className="space-y-2">
              <Label htmlFor="filterStatus">Statut</Label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as MissionStatus | 'all')}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">Tous les statuts</option>
                <option value="draft">Brouillon</option>
                <option value="published">Publiée</option>
                <option value="full">Complète</option>
                <option value="cancelled">Annulée</option>
                <option value="completed">Terminée</option>
              </select>
            </div>

            {/* Filtre Urgentes */}
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={showUrgentOnly}
                  onChange={(e) => setShowUrgentOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="urgent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Urgentes uniquement
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des missions */}
      {isLoadingMissions ? (
        <p>Chargement des missions...</p>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/missions/${mission.id}`}>Voir détails</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

