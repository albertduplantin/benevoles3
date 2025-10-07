'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getMissionById, deleteMission } from '@/lib/firebase/missions';
import { MissionClient } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { canEditMission } from '@/lib/utils/permissions';
import { MissionForm } from '@/components/features/missions/mission-form';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function EditMissionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const missionId = params.id as string;

  const [mission, setMission] = useState<MissionClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchMission = async () => {
      if (!missionId || !user) return;
      try {
        setIsLoading(true);
        const missionData = await getMissionById(missionId);
        if (!missionData) {
          setError('Mission introuvable');
          return;
        }

        // Vérifier les permissions (basé sur la catégorie maintenant)
        const canEdit = canEditMission(user, missionData.category);
        if (!canEdit) {
          setError('Vous n\'avez pas la permission d\'éditer cette mission');
          setTimeout(() => router.push('/dashboard/missions'), 2000);
          return;
        }

        setMission(missionData);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement de la mission');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMission();
  }, [missionId, user, router]);

  const handleDelete = async () => {
    if (!missionId || !user) return;

    // Seuls les admins peuvent supprimer des missions
    if (user.role !== 'admin') {
      setError('Seuls les administrateurs peuvent supprimer des missions');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteMission(missionId);
      router.push('/dashboard/missions');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de la mission');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading || isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error && !mission) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Mission non trouvée.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href={`/dashboard/missions/${missionId}`}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Retour à la mission
            </Link>
          </Button>

          {user.role === 'admin' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  <Trash2Icon className="w-4 h-4 mr-2" />
                  Supprimer la mission
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Cela supprimera définitivement la mission
                    et toutes les données associées.
                    {mission.volunteers.length > 0 && (
                      <p className="mt-2 font-semibold text-red-600">
                        Attention : {mission.volunteers.length} bénévole(s) sont inscrit(s) à cette mission.
                      </p>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {error && mission && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <MissionForm mode="edit" missionId={missionId} initialData={mission} />
      </div>
    </div>
  );
}
