import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  requestNotificationPermission,
  onMessageListener,
  isNotificationSupported,
  getNotificationPermission,
} from '@/lib/firebase/messaging';
import { saveFCMToken, removeFCMToken } from '@/lib/firebase/fcm-tokens';
import { toast } from 'sonner';
import { MessagePayload } from 'firebase/messaging';

export function useNotifications() {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // Vérifier le support et la permission au chargement
  useEffect(() => {
    setIsSupported(isNotificationSupported());
    setPermission(getNotificationPermission());
  }, []);

  // Écouter les messages en premier plan
  useEffect(() => {
    if (!isSupported || !user) return;

    const unsubscribe = onMessageListener((payload: MessagePayload) => {
      console.log('Message reçu en premier plan:', payload);
      
      const title = payload.notification?.title || 'Nouvelle notification';
      const body = payload.notification?.body || '';
      
      // Afficher un toast avec la notification
      toast.info(body, {
        description: title,
        duration: 5000,
        action: payload.data?.url
          ? {
              label: 'Voir',
              onClick: () => {
                window.location.href = payload.data!.url;
              },
            }
          : undefined,
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isSupported, user]);

  // Demander la permission et enregistrer le token
  const enableNotifications = useCallback(async () => {
    if (!isSupported) {
      toast.error('Les notifications ne sont pas supportées par votre navigateur');
      return false;
    }

    if (!user) {
      toast.error('Vous devez être connecté');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Demander la permission
      const token = await requestNotificationPermission();
      
      if (!token) {
        toast.error('Permission de notification refusée');
        setPermission('denied');
        return false;
      }

      // Sauvegarder le token dans Firestore
      await saveFCMToken(user.uid, token);
      setFcmToken(token);
      setPermission('granted');
      
      toast.success('Notifications activées avec succès !');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'activation des notifications:', error);
      toast.error('Erreur lors de l\'activation des notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, user]);

  // Désactiver les notifications
  const disableNotifications = useCallback(async () => {
    if (!user || !fcmToken) {
      return false;
    }

    try {
      setIsLoading(true);
      
      // Supprimer le token de Firestore
      await removeFCMToken(user.uid, fcmToken);
      setFcmToken(null);
      
      toast.success('Notifications désactivées');
      return true;
    } catch (error) {
      console.error('Erreur lors de la désactivation des notifications:', error);
      toast.error('Erreur lors de la désactivation des notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, fcmToken]);

  return {
    isSupported,
    permission,
    isLoading,
    isEnabled: permission === 'granted',
    enableNotifications,
    disableNotifications,
  };
}

