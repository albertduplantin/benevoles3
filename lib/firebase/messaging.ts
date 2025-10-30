import { getMessaging, getToken, onMessage, Messaging, MessagePayload } from 'firebase/messaging';
import { app } from './config';

let messaging: Messaging | null = null;

// Initialiser Firebase Messaging (uniquement côté client)
export function initializeMessaging(): Messaging | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!messaging) {
    try {
      messaging = getMessaging(app);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Firebase Messaging:', error);
      return null;
    }
  }

  return messaging;
}

// Demander la permission pour les notifications et récupérer le token FCM
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    // Vérifier si les notifications sont supportées
    if (!('Notification' in window)) {
      console.warn('Ce navigateur ne supporte pas les notifications');
      return null;
    }

    // Demander la permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('Permission de notification refusée');
      return null;
    }

    // Initialiser messaging
    const messagingInstance = initializeMessaging();
    if (!messagingInstance) {
      console.error('Impossible d\'initialiser Firebase Messaging');
      return null;
    }

    // Récupérer le token FCM
    const token = await getToken(messagingInstance, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log('Token FCM obtenu:', token);
      return token;
    } else {
      console.log('Pas de token disponible');
      return null;
    }
  } catch (error: any) {
    console.error('Erreur lors de la demande de permission:', error);
    
    // Erreurs spécifiques avec messages clairs
    if (error?.code === 'messaging/invalid-vapid-key') {
      console.error('❌ VAPID KEY INVALIDE : Vérifiez NEXT_PUBLIC_FIREBASE_VAPID_KEY dans .env.local');
    } else if (error?.message?.includes('atob') || error?.name === 'InvalidCharacterError') {
      console.error('❌ TOKEN MAL ENCODÉ : La clé VAPID contient des caractères invalides');
    } else if (error?.code === 'messaging/permission-blocked') {
      console.warn('⚠️ Notifications bloquées par l\'utilisateur');
    }
    
    return null;
  }
}

// Écouter les messages en premier plan
export function onMessageListener(callback: (payload: MessagePayload) => void): (() => void) | null {
  const messagingInstance = initializeMessaging();
  
  if (!messagingInstance) {
    return null;
  }

  return onMessage(messagingInstance, callback);
}

// Vérifier si les notifications sont supportées
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

// Obtenir le statut de la permission
export function getNotificationPermission(): NotificationPermission | null {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }
  return Notification.permission;
}


