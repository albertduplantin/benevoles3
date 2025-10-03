'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials, getAvatarColor } from '@/lib/utils/avatar';
import { formatDateTime } from '@/lib/utils/date';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

      <div className="grid gap-6">
        {/* Carte principale */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Vos informations de compte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.photoURL || undefined} alt={user.firstName} />
                  <AvatarFallback
                    className="text-2xl"
                    style={{ backgroundColor: getAvatarColor(user.uid) }}
                  >
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Informations */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Rôle</p>
                    <div className="mt-1">
                      {user.role === 'admin' && (
                        <Badge variant="destructive">Administrateur</Badge>
                      )}
                      {user.role === 'mission_responsible' && (
                        <Badge className="bg-purple-600">Responsable de mission</Badge>
                      )}
                      {user.role === 'volunteer' && (
                        <Badge className="bg-blue-600">Bénévole</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Membre depuis</p>
                    <p className="font-medium">
                      {formatDateTime(user.createdAt instanceof Date ? user.createdAt : new Date((user.createdAt as any).seconds * 1000))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte Consentements RGPD */}
        <Card>
          <CardHeader>
            <CardTitle>Consentements RGPD</CardTitle>
            <CardDescription>
              Gestion de vos données personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Traitement des données</p>
                <p className="text-sm text-gray-500">
                  Vous avez consenti au traitement de vos données personnelles
                </p>
              </div>
              <Badge variant={user.consents.dataProcessing ? 'default' : 'secondary'}>
                {user.consents.dataProcessing ? 'Accepté' : 'Refusé'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Communications</p>
                <p className="text-sm text-gray-500">
                  Recevoir des notifications par email
                </p>
              </div>
              <Badge variant={user.consents.communications ? 'default' : 'secondary'}>
                {user.consents.communications ? 'Accepté' : 'Refusé'}
              </Badge>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Date du consentement : {formatDateTime(user.consents.consentDate instanceof Date ? user.consents.consentDate : new Date((user.consents.consentDate as any).seconds * 1000))}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Préférences de notification */}
        {user.notificationPreferences && (
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Comment souhaitez-vous être contacté
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-gray-500">
                    Recevoir des mises à jour par email
                  </p>
                </div>
                <Badge variant={user.notificationPreferences.email ? 'default' : 'secondary'}>
                  {user.notificationPreferences.email ? 'Activé' : 'Désactivé'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications par SMS</p>
                  <p className="text-sm text-gray-500">
                    Recevoir des mises à jour par SMS
                  </p>
                </div>
                <Badge variant={user.notificationPreferences.sms ? 'default' : 'secondary'}>
                  {user.notificationPreferences.sms ? 'Activé' : 'Désactivé'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

