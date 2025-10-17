'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangleIcon, CheckCircleIcon, RefreshCwIcon, TrashIcon } from 'lucide-react';

interface OrphanData {
  userId: string;
  userName: string;
  userEmail: string;
  missions: Array<{
    missionId: string;
    missionTitle: string;
    missionCategory: string;
  }>;
}

export default function MaintenancePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [orphanVolunteers, setOrphanVolunteers] = useState<OrphanData[]>([]);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const scanForOrphans = async () => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/maintenance/scan-orphan-volunteers');
      if (!response.ok) {
        throw new Error('Erreur lors du scan');
      }
      const data = await response.json();
      setOrphanVolunteers(data.orphans || []);
      
      setMessage({
        type: 'success',
        text: `Scan terminé : ${data.orphans?.length || 0} problème(s) détecté(s)`,
      });
    } catch (error) {
      console.error('Error scanning:', error);
      setMessage({
        type: 'error',
        text: 'Impossible de scanner les données',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const removeFromMission = async (missionId: string, userId: string, missionTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir retirer cet utilisateur de la mission "${missionTitle}" ?`)) {
      return;
    }

    setIsRemoving(`${missionId}-${userId}`);
    try {
      const response = await fetch('/api/maintenance/remove-volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, userId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setMessage({
        type: 'success',
        text: '✅ Bénévole retiré de la mission avec succès',
      });

      // Rafraîchir les données
      await scanForOrphans();
    } catch (error) {
      console.error('Error removing:', error);
      setMessage({
        type: 'error',
        text: 'Impossible de retirer le bénévole',
      });
    } finally {
      setIsRemoving(null);
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🔧 Maintenance</h1>
        <p className="text-muted-foreground">
          Outils de diagnostic et de nettoyage des données
        </p>
      </div>

      {/* Message de notification */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
            Bénévoles inscrits à des missions inexistantes
          </CardTitle>
          <CardDescription>
            Détecte les bénévoles qui apparaissent dans des missions alors qu'ils ne devraient pas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={scanForOrphans}
            disabled={isScanning}
            className="w-full md:w-auto"
          >
            {isScanning ? (
              <>
                <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                Scan en cours...
              </>
            ) : (
              <>
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Lancer le scan
              </>
            )}
          </Button>

          {orphanVolunteers.length > 0 && (
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangleIcon className="h-5 w-5 text-amber-600" />
                <p className="text-sm text-amber-800 font-medium">
                  {orphanVolunteers.length} bénévole(s) avec des inscriptions orphelines détecté(s)
                </p>
              </div>

              {orphanVolunteers.map((orphan) => (
                <Card key={orphan.userId} className="border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {orphan.userName}
                    </CardTitle>
                    <CardDescription>{orphan.userEmail}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      Inscrit à {orphan.missions.length} mission(s) :
                    </p>
                    {orphan.missions.map((mission) => (
                      <div
                        key={mission.missionId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{mission.missionTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            {mission.missionCategory}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            removeFromMission(
                              mission.missionId,
                              orphan.userId,
                              mission.missionTitle
                            )
                          }
                          disabled={isRemoving === `${mission.missionId}-${orphan.userId}`}
                        >
                          {isRemoving === `${mission.missionId}-${orphan.userId}` ? (
                            <>
                              <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                              Suppression...
                            </>
                          ) : (
                            <>
                              <TrashIcon className="h-4 w-4 mr-2" />
                              Retirer
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isScanning && orphanVolunteers.length === 0 && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-800 font-medium">
                Aucun problème détecté ! 🎉
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

