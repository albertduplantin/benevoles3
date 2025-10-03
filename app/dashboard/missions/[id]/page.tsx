'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { getMissionById } from '@/lib/firebase/missions';
import { registerToMission, unregisterFromMission } from '@/lib/firebase/registrations';
import { getUserById } from '@/lib/firebase/users';
import { isProfileComplete } from '@/lib/firebase/users';
import {
  requestMissionResponsibility,
  cancelResponsibilityRequest,
  approveResponsibilityRequest,
  rejectResponsibilityRequest,
  removeResponsibility,
} from '@/lib/firebase/mission-responsibles';
import { MissionClient, UserClient } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDateTime } from '@/lib/utils/date';
import { getInitials, getAvatarColor } from '@/lib/utils/avatar';
import { hasPermission, canEditMission } from '@/lib/utils/permissions';
import Link from 'next/link';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  AlertCircleIcon,
  ArrowLeftIcon,
} from 'lucide-react';

export default function MissionDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const missionId = params.id as string;

  const [mission, setMission] = useState<MissionClient | null>(null);
  const [participants, setParticipants] = useState<UserClient[]>([]);
  const [pendingResponsibles, setPendingResponsibles] = useState<UserClient[]>([]);
  const [currentResponsibles, setCurrentResponsibles] = useState<UserClient[]>([]);
  const [isLoadingMission, setIsLoadingMission] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isProcessingResponsibility, setIsProcessingResponsibility] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isUserRegistered = mission?.volunteers.includes(user?.uid || '') || false;
  const availableSpots = mission ? mission.maxVolunteers - mission.volunteers.length : 0;
  const canRegister =
    mission?.status === 'published' && !isUserRegistered && availableSpots > 0;
  const canUnregister = isUserRegistered && mission?.status !== 'completed';
  
  // États pour la responsabilité
  const isUserResponsible = mission?.responsibles.includes(user?.uid || '') || false;
  const hasPendingRequest = mission?.pendingResponsibles.includes(user?.uid || '') || false;
  const missionHasResponsible = mission ? mission.responsibles.length > 0 : false;
  // Peut demander si : inscrit à la mission, pas déjà responsable, pas de demande en attente, pas admin, et mission n'a pas déjà un responsable
  const canRequestResponsibility = isUserRegistered && !isUserResponsible && !hasPendingRequest && user?.role !== 'admin' && !missionHasResponsible;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && !isProfileComplete(user)) {
      router.push('/auth/complete-profile');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchMission = async () => {
      if (!user || !missionId) return;

      try {
        setIsLoadingMission(true);
        const missionData = await getMissionById(missionId);

        if (!missionData) {
          setError('Mission introuvable');
          return;
        }

        setMission(missionData);

        // Charger les participants si admin, responsable OU bénévole inscrit
        if (
          hasPermission(user, 'admin') || 
          missionData.responsibles.includes(user.uid) ||
          missionData.volunteers.includes(user.uid)
        ) {
          const participantsData = await Promise.all(
            missionData.volunteers.map((uid) => getUserById(uid))
          );
          setParticipants(participantsData.filter((p) => p !== null) as UserClient[]);
        }

        // Charger les responsables actuels (pour affichage)
        if (missionData.responsibles.length > 0) {
          const responsiblesData = await Promise.all(
            missionData.responsibles.map((uid) => getUserById(uid))
          );
          setCurrentResponsibles(responsiblesData.filter((r) => r !== null) as UserClient[]);
        }

        // Charger les demandes en attente (admin uniquement)
        if (hasPermission(user, 'admin') && missionData.pendingResponsibles.length > 0) {
          const pendingData = await Promise.all(
            missionData.pendingResponsibles.map((uid) => getUserById(uid))
          );
          setPendingResponsibles(pendingData.filter((p) => p !== null) as UserClient[]);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement de la mission');
      } finally {
        setIsLoadingMission(false);
      }
    };

    fetchMission();
  }, [user, missionId]);

  const handleRegister = async () => {
    if (!user || !missionId) return;

    setIsRegistering(true);
    setError(null);
    setSuccess(null);

    try {
      await registerToMission(missionId, user.uid);
      setSuccess('✅ Inscription réussie !');

      // Recharger la mission
      const updatedMission = await getMissionById(missionId);
      if (updatedMission) {
        setMission(updatedMission);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!user || !missionId) return;

    if (!confirm('Êtes-vous sûr de vouloir vous désinscrire de cette mission ?')) {
      return;
    }

    setIsRegistering(true);
    setError(null);
    setSuccess(null);

    try {
      await unregisterFromMission(missionId, user.uid);
      setSuccess('✅ Désinscription réussie');

      // Recharger la mission
      const updatedMission = await getMissionById(missionId);
      if (updatedMission) {
        setMission(updatedMission);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la désinscription');
    } finally {
      setIsRegistering(false);
    }
  };

  // === Gestion des responsabilités ===

  const handleRequestResponsibility = async () => {
    if (!user || !missionId) return;

    setIsProcessingResponsibility(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await requestMissionResponsibility(missionId, user.uid);
      
      if (result.autoApproved) {
        setSuccess('✅ Vous êtes maintenant responsable de cette mission !');
      } else {
        setSuccess('✅ Demande de responsabilité envoyée !');
      }

      // Recharger la mission
      const updatedMission = await getMissionById(missionId);
      if (updatedMission) {
        setMission(updatedMission);
        
        // Mettre à jour les responsables si auto-approuvé
        if (result.autoApproved && user) {
          setCurrentResponsibles([{
            uid: user.uid,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            photoURL: user.photoURL,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            consents: user.consents,
          }]);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la demande');
    } finally {
      setIsProcessingResponsibility(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!user || !missionId) return;

    setIsProcessingResponsibility(true);
    setError(null);
    setSuccess(null);

    try {
      await cancelResponsibilityRequest(missionId, user.uid);
      setSuccess('✅ Demande annulée');

      // Recharger la mission
      const updatedMission = await getMissionById(missionId);
      if (updatedMission) {
        setMission(updatedMission);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'annulation');
    } finally {
      setIsProcessingResponsibility(false);
    }
  };

  const handleRemoveResponsibility = async () => {
    if (!user || !missionId) return;

    if (!confirm('Êtes-vous sûr de vouloir vous retirer comme responsable de cette mission ?')) {
      return;
    }

    setIsProcessingResponsibility(true);
    setError(null);
    setSuccess(null);

    try {
      await removeResponsibility(missionId, user.uid);
      setSuccess('✅ Vous n\'êtes plus responsable de cette mission');

      // Recharger la mission
      const updatedMission = await getMissionById(missionId);
      if (updatedMission) {
        setMission(updatedMission);
        setCurrentResponsibles(prev => prev.filter(r => r.uid !== user.uid));
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du retrait');
    } finally {
      setIsProcessingResponsibility(false);
    }
  };

  const handleApproveRequest = async (userId: string) => {
    if (!missionId) return;

    setIsProcessingResponsibility(true);
    setError(null);
    setSuccess(null);

    try {
      await approveResponsibilityRequest(missionId, userId);
      setSuccess('✅ Demande approuvée');

      // Recharger la mission
      const updatedMission = await getMissionById(missionId);
      if (updatedMission) {
        setMission(updatedMission);
        
        // Mettre à jour les listes
        const approvedUser = pendingResponsibles.find(p => p.uid === userId);
        if (approvedUser) {
          setPendingResponsibles(prev => prev.filter(p => p.uid !== userId));
          setCurrentResponsibles(prev => [...prev, approvedUser]);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'approbation');
    } finally {
      setIsProcessingResponsibility(false);
    }
  };

  const handleRejectRequest = async (userId: string) => {
    if (!missionId) return;

    setIsProcessingResponsibility(true);
    setError(null);
    setSuccess(null);

    try {
      await rejectResponsibilityRequest(missionId, userId);
      setSuccess('✅ Demande rejetée');

      // Recharger la mission
      const updatedMission = await getMissionById(missionId);
      if (updatedMission) {
        setMission(updatedMission);
        setPendingResponsibles(prev => prev.filter(p => p.uid !== userId));
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du rejet');
    } finally {
      setIsProcessingResponsibility(false);
    }
  };

  if (loading || isLoadingMission) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user || !mission) {
    return null;
  }

  const statusLabels = {
    draft: 'Brouillon',
    published: 'Publiée',
    full: 'Complète',
    cancelled: 'Annulée',
    completed: 'Terminée',
  };

  const statusColors = {
    draft: 'bg-gray-500',
    published: 'bg-green-500',
    full: 'bg-orange-500',
    cancelled: 'bg-red-500',
    completed: 'bg-blue-500',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/missions">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Retour aux missions
            </Link>
          </Button>

          {mission && canEditMission(user.role, user.uid, mission.responsibles) && (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/missions/${missionId}/edit`}>Modifier</Link>
            </Button>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>
        )}
        {success && (
          <div className="p-4 text-sm text-green-600 bg-green-50 rounded-md">
            {success}
          </div>
        )}

        {/* Mission Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-3xl">{mission.title}</CardTitle>
                  {mission.isUrgent && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircleIcon className="w-3 h-3" />
                      Urgent
                    </Badge>
                  )}
                </div>
                <Badge className={statusColors[mission.status]}>
                  {statusLabels[mission.status]}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {mission.description}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dates */}
              {mission.type === 'scheduled' && mission.startDate && (
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-semibold">Dates</p>
                    <p className="text-sm text-muted-foreground">
                      Début : {formatDateTime(mission.startDate)}
                    </p>
                    {mission.endDate && (
                      <p className="text-sm text-muted-foreground">
                        Fin : {formatDateTime(mission.endDate)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {mission.type === 'ongoing' && (
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-semibold">Type</p>
                    <p className="text-sm text-muted-foreground">
                      Mission continue (pas de dates fixes)
                    </p>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Lieu</p>
                  <p className="text-sm text-muted-foreground">{mission.location}</p>
                </div>
              </div>

              {/* Available Spots */}
              <div className="flex items-start gap-3">
                <UsersIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Places disponibles</p>
                  <p className="text-sm text-muted-foreground">
                    {availableSpots} / {mission.maxVolunteers} place
                    {mission.maxVolunteers > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {canRegister && (
                <Button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="flex-1"
                >
                  {isRegistering ? 'Inscription...' : 'Je m\'inscris'}
                </Button>
              )}

              {canUnregister && (
                <Button
                  onClick={handleUnregister}
                  disabled={isRegistering}
                  variant="outline"
                  className="flex-1"
                >
                  {isRegistering ? 'Désinscription...' : 'Me désinscrire'}
                </Button>
              )}

              {isUserRegistered && mission.status === 'completed' && (
                <div className="flex-1 p-4 bg-blue-50 rounded-md text-center">
                  <p className="text-sm text-blue-600 font-semibold">
                    ✅ Vous avez participé à cette mission
                  </p>
                </div>
              )}

              {mission.status === 'full' && !isUserRegistered && (
                <div className="flex-1 p-4 bg-orange-50 rounded-md text-center">
                  <p className="text-sm text-orange-600 font-semibold">
                    Cette mission est complète
                  </p>
                </div>
              )}

              {mission.status === 'cancelled' && (
                <div className="flex-1 p-4 bg-red-50 rounded-md text-center">
                  <p className="text-sm text-red-600 font-semibold">
                    Cette mission a été annulée
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section Responsabilité */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <UsersIcon className="w-5 h-5" />
              Responsables de Mission
            </CardTitle>
            <CardDescription className="text-purple-800">
              Les responsables coordonnent cette mission et ont accès aux coordonnées des bénévoles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Liste des responsables actuels */}
            {currentResponsibles.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-purple-900">Responsables actuels</h4>
                <div className="space-y-2">
                  {currentResponsibles.map((responsible) => (
                    <div
                      key={responsible.uid}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {responsible.photoURL ? (
                            <AvatarImage
                              src={responsible.photoURL}
                              alt={responsible.firstName}
                            />
                          ) : (
                            <AvatarFallback
                              style={{
                                backgroundColor: getAvatarColor(responsible.email),
                              }}
                            >
                              {getInitials(responsible.firstName, responsible.lastName)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {responsible.firstName} {responsible.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {responsible.email}
                          </p>
                        </div>
                      </div>
                      {responsible.uid === user.uid && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveResponsibility}
                          disabled={isProcessingResponsibility}
                        >
                          Me retirer
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentResponsibles.length === 0 && (
              <p className="text-sm text-purple-800 text-center py-2">
                Aucun responsable pour cette mission
              </p>
            )}

            {/* Boutons d'action pour les bénévoles */}
            {!isUserRegistered && !missionHasResponsible && user?.role !== 'admin' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-sm text-blue-900">
                  💡 Vous devez d'abord vous inscrire à cette mission pour pouvoir devenir responsable
                </p>
              </div>
            )}

            {canRequestResponsibility && (
              <Button
                onClick={handleRequestResponsibility}
                disabled={isProcessingResponsibility}
                className="w-full"
                variant="secondary"
              >
                {isProcessingResponsibility
                  ? 'Envoi en cours...'
                  : '🙋 Me porter volontaire comme responsable'}
              </Button>
            )}

            {missionHasResponsible && !isUserResponsible && user?.role !== 'admin' && (
              <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg text-center">
                <p className="text-sm text-gray-700">
                  Cette mission a déjà un responsable
                </p>
              </div>
            )}

            {hasPendingRequest && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm font-semibold text-yellow-900">
                    Demande en attente de validation
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelRequest}
                  disabled={isProcessingResponsibility}
                >
                  Annuler
                </Button>
              </div>
            )}

            {isUserResponsible && !hasPendingRequest && !canRequestResponsibility && user.role !== 'admin' && (
              <div className="p-3 bg-purple-100 rounded-lg text-center">
                <p className="text-sm font-semibold text-purple-900">
                  ✅ Vous êtes responsable de cette mission
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section Admin : Demandes en attente */}
        {hasPermission(user, 'admin') && pendingResponsibles.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-900">
                Demandes de responsabilité en attente ({pendingResponsibles.length})
              </CardTitle>
              <CardDescription className="text-orange-800">
                Validez ou rejetez les demandes de responsabilité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingResponsibles.map((pending) => (
                  <div
                    key={pending.uid}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {pending.photoURL ? (
                          <AvatarImage src={pending.photoURL} alt={pending.firstName} />
                        ) : (
                          <AvatarFallback
                            style={{
                              backgroundColor: getAvatarColor(pending.email),
                            }}
                          >
                            {getInitials(pending.firstName, pending.lastName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {pending.firstName} {pending.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{pending.email}</p>
                        <p className="text-sm text-muted-foreground">{pending.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(pending.uid)}
                        disabled={isProcessingResponsibility}
                      >
                        ✓ Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectRequest(pending.uid)}
                        disabled={isProcessingResponsibility}
                      >
                        ✗ Rejeter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Participants List (Admin/Responsable/Bénévoles inscrits) */}
        {(hasPermission(user, 'admin') || 
          mission.responsibles.includes(user.uid) ||
          mission.volunteers.includes(user.uid)) && (
          <Card>
            <CardHeader>
              <CardTitle>
                Participants ({participants.length}/{mission.maxVolunteers})
              </CardTitle>
              <CardDescription>
                {hasPermission(user, 'admin') || mission.responsibles.includes(user.uid)
                  ? 'Liste des bénévoles inscrits à cette mission'
                  : 'Coordonnées des autres bénévoles pour vous coordonner'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {participants.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Aucun participant pour le moment
                </p>
              ) : (
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.uid}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {participant.photoURL ? (
                            <AvatarImage
                              src={participant.photoURL}
                              alt={participant.firstName}
                            />
                          ) : (
                            <AvatarFallback
                              style={{
                                backgroundColor: getAvatarColor(participant.email),
                              }}
                            >
                              {getInitials(participant.firstName, participant.lastName)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {participant.firstName} {participant.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {participant.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{participant.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

