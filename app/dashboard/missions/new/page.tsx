'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { MissionForm } from '@/components/features/missions/mission-form';

export default function NewMissionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (user.role === 'volunteer') {
        // Les bénévoles n'ont pas accès à la création
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role === 'volunteer') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <MissionForm
        onSuccess={() => {
          router.push('/dashboard/missions');
        }}
      />
    </div>
  );
}

