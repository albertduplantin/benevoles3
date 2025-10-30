import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  requestNotificationPermission,
  onMessageListener,
  isNotificationSupported,
  getNotificationPermission,
} from '@/lib/firebase/messaging';
import { saveFCMToken, removeFCMToken, getUserFCMTokens } from '@/lib/firebase/fcm-tokens';
import { toast } from 'sonner';
import { MessagePayload } from 'firebase/messaging';

export function useNotifications() {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [hasTokens, setHasTokens] = useState(false);

  // Vérifier le support et la permission au chargement
  useEffect(() => {
    setIsSupported(isNotificationSupported());
    setPermission(getNotificationPermission());
  }, []);

  // Charger les tokens existants depuis Firestore
  useEffect(() => {
    const loadTokens = async () => {
      if (!user) return;

      try {
        const tokens = await getUserFCMTokens(user.uid);
        setHasTokens(tokens.length > 0);
        
        // Si on a des tokens, récupérer le token actuel du navigateur
        if (tokens.length > 0 && permission === 'granted') {
          try {
            const { getMessaging, getToken } = await import('firebase/messaging');
            const { app } = await import('@/lib/firebase/config');
            const messaging = getMessaging(app);
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            if (currentToken) {
              setFcmToken(currentToken);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du token actuel:', error);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des tokens:', error);
      }
    };

    loadTokens();
  }, [user, permission]);

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
      setHasTokens(true);
      
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
    if (!user) {
      toast.error('Vous devez être connecté');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Si on a le token actuel, le supprimer
      if (fcmToken) {
        await removeFCMToken(user.uid, fcmToken);
      } else {
        // Sinon, récupérer tous les tokens et supprimer le premier (celui du navigateur actuel)
        const tokens = await getUserFCMTokens(user.uid);
        if (tokens.length > 0) {
          // Essayer de récupérer le token du navigateur actuel
          try {
            const { getMessaging, getToken } = await import('firebase/messaging');
            const { app } = await import('@/lib/firebase/config');
            const messaging = getMessaging(app);
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            if (currentToken) {
              await removeFCMToken(user.uid, currentToken);
            }
          } catch (error) {
            console.error('Impossible de récupérer le token actuel, suppression du premier token:', error);
            // Si on ne peut pas récupérer le token actuel, supprimer le premier
            await removeFCMToken(user.uid, tokens[0]);
          }
        }
      }
      
      setFcmToken(null);
      setHasTokens(false);
      
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
    isEnabled: permission === 'granted' && hasTokens,
    fcmToken,
    enableNotifications,
    disableNotifications,
  };
}




