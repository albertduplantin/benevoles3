'use client';

import { MissionClient, UserClient } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircleIcon,
  CalendarIcon,
  TrendingUpIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  AwardIcon,
} from 'lucide-react';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils/date';

interface AdvancedStatisticsProps {
  missions: MissionClient[];
  allVolunteers?: Map<string, UserClient>;
  isAdmin?: boolean;
}

export function AdvancedStatistics({ missions, allVolunteers, isAdmin = false }: AdvancedStatisticsProps) {
  // 1. Missions urgentes avec sous-effectif
  const urgentUnderstaffed = missions.filter((m) => {
    if (m.status !== 'published' || !m.isUrgent) return false;
    const fillRate = (m.volunteers.length / m.maxVolunteers) * 100;
    return fillRate < 50;
  });

  // 2. Missions des 7 prochains jours
  const now = new Date();
  const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingMissions = missions
    .filter((m) => {
      if (!m.startDate || m.status === 'draft' || m.status === 'cancelled') return false;
      const startDate = new Date(m.startDate);
      return startDate >= now && startDate <= next7Days;
    })
    .sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 5);

  // 3. Répartition par catégorie
  const categoryStats = missions.reduce((acc, mission) => {
    const category = mission.category || 'Non catégorisée';
    if (!acc[category]) {
      acc[category] = {
        total: 0,
        volunteers: 0,
        maxVolunteers: 0,
      };
    }
    acc[category].total++;
    acc[category].volunteers += mission.volunteers.length;
    acc[category].maxVolunteers += mission.maxVolunteers;
    return acc;
  }, {} as Record<string, { total: number; volunteers: number; maxVolunteers: number }>);

  const categoryArray = Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      ...stats,
      fillRate: (stats.volunteers / stats.maxVolunteers) * 100,
    }))
    .sort((a, b) => a.fillRate - b.fillRate); // Trier par taux de remplissage (les plus faibles en premier)

  // 4. Top 5 bénévoles actifs
  const volunteerCounts = new Map<string, number>();
  missions.forEach((mission) => {
    mission.volunteers.forEach((volunteerId) => {
      volunteerCounts.set(volunteerId, (volunteerCounts.get(volunteerId) || 0) + 1);
    });
  });

  const topVolunteers = Array.from(volunteerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([volunteerId, count]) => ({
      volunteerId,
      count,
      volunteer: allVolunteers?.get(volunteerId),
    }))
    .filter((v) => v.volunteer);

  // 5. Statistiques globales
  const publishedMissions = missions.filter((m) => m.status === 'published' || m.status === 'full');
  const totalVolunteerSpots = publishedMissions.reduce((sum, m) => sum + m.maxVolunteers, 0);
  const filledSpots = publishedMissions.reduce((sum, m) => sum + m.volunteers.length, 0);
  const globalFillRate = totalVolunteerSpots > 0 ? (filledSpots / totalVolunteerSpots) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Alertes Missions Urgentes */}
      {urgentUnderstaffed.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircleIcon className="h-5 w-5" />
              Missions Urgentes en Sous-effectif
            </CardTitle>
            <CardDescription className="text-red-600">
              {urgentUnderstaffed.length} mission(s) urgente(s) avec moins de 50% de bénévoles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentUnderstaffed.map((mission) => {
                const fillRate = (mission.volunteers.length / mission.maxVolunteers) * 100;
                return (
                  <Link
                    key={mission.id}
                    href={`/dashboard/missions/${mission.id}`}
                    className="block p-3 bg-white rounded-lg border hover:border-red-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{mission.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {mission.startDate && formatDateTime(mission.startDate)}
                        </p>
                      </div>
                      <Badge variant="destructive" className="ml-2">
                        {mission.volunteers.length}/{mission.maxVolunteers}
                      </Badge>
                    </div>
                    <Progress value={fillRate} className="mt-2 h-2" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Taux de Remplissage Global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5" />
            Taux de Remplissage Global
          </CardTitle>
          <CardDescription>
            {filledSpots} / {totalVolunteerSpots} places occupées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-bold">{globalFillRate.toFixed(1)}%</span>
            </div>
            <Progress value={globalFillRate} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {globalFillRate >= 80 ? (
                <span className="text-green-600 font-medium">✓ Excellent taux de remplissage</span>
              ) : globalFillRate >= 50 ? (
                <span className="text-orange-600 font-medium">⚠ Bon taux, mais peut être amélioré</span>
              ) : (
                <span className="text-red-600 font-medium">⚠ Besoin de plus de bénévoles</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline 7 prochains jours */}
      {upcomingMissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Prochaines Missions (7 jours)
            </CardTitle>
            <CardDescription>Missions à venir cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingMissions.map((mission) => {
                const fillRate = (mission.volunteers.length / mission.maxVolunteers) * 100;
                const isUrgent = mission.isUrgent;
                const isFull = mission.status === 'full';

                return (
                  <Link
                    key={mission.id}
                    href={`/dashboard/missions/${mission.id}`}
                    className="block p-3 rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-16 text-center">
                        <p className="text-xs text-muted-foreground">
                          {mission.startDate &&
                            new Date(mission.startDate).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                            })}
                        </p>
                        <p className="text-sm font-medium">
                          {mission.startDate &&
                            new Date(mission.startDate).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{mission.title}</p>
                          {isUrgent && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                          {isFull && (
                            <Badge variant="secondary" className="text-xs">
                              Complète
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <UsersIcon className="h-3 w-3" />
                            <span>
                              {mission.volunteers.length}/{mission.maxVolunteers}
                            </span>
                          </div>
                          <Progress value={fillRate} className="h-1.5 flex-1 max-w-[100px]" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Répartition par Catégorie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5" />
            Répartition par Catégorie
          </CardTitle>
          <CardDescription>Taux de remplissage par catégorie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryArray.slice(0, 8).map(({ category, total, volunteers, maxVolunteers, fillRate }) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate flex-1">{category}</span>
                  <span className="text-muted-foreground ml-2">
                    {volunteers}/{maxVolunteers}
                  </span>
                  <span
                    className={`ml-2 font-semibold ${
                      fillRate >= 80 ? 'text-green-600' : fillRate >= 50 ? 'text-orange-600' : 'text-red-600'
                    }`}
                  >
                    {fillRate.toFixed(0)}%
                  </span>
                </div>
                <Progress value={fillRate} className="h-2" />
                <p className="text-xs text-muted-foreground">{total} mission(s)</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top 5 Bénévoles Actifs */}
      {isAdmin && topVolunteers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AwardIcon className="h-5 w-5" />
              Top 5 Bénévoles Actifs
            </CardTitle>
            <CardDescription>Les bénévoles les plus engagés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topVolunteers.map(({ volunteer, count }, index) => (
                <div key={volunteer!.uid} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0
                        ? 'bg-yellow-500'
                        : index === 1
                        ? 'bg-gray-400'
                        : index === 2
                        ? 'bg-orange-600'
                        : 'bg-blue-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {volunteer!.firstName} {volunteer!.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{volunteer!.email}</p>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {count} mission{count > 1 ? 's' : ''}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

