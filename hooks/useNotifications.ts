import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  missionId?: string;
  missionTitle?: string;
  volunteerName?: string;
  volunteerId?: string;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
}

/**
 * Hook pour les notifications push navigateur (stub pour compatibilité)
 * Retourne des valeurs par défaut pour éviter les erreurs
 */
export function useNotifications() {
  return {
    isSupported: false,
    permission: 'default' as NotificationPermission,
    isLoading: false,
    isEnabled: false,
    enableNotifications: async () => false,
    disableNotifications: async () => false,
  };
}

/**
 * Hook pour récupérer les notifications Firestore d'un utilisateur en temps réel
 * (Pour les notifications d'inscription aux missions)
 */
export function useFirestoreNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            missionId: data.missionId,
            missionTitle: data.missionTitle,
            volunteerName: data.volunteerName,
            volunteerId: data.volunteerId,
            read: data.read,
            createdAt: data.createdAt?.toDate() || new Date(),
            readAt: data.readAt?.toDate(),
          };
        });

        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.read).length);
        setLoading(false);
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  /**
   * Marquer une notification comme lue
   */
  const markAsRead = async (notificationId: string) => {
    try {
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, {
        read: true,
        readAt: new Date(),
      });
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  /**
   * Marquer toutes les notifications comme lues
   */
  const markAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter((n) => !n.read);
      const promises = unreadNotifs.map((n) => markAsRead(n.id));
      await Promise.all(promises);
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
}
