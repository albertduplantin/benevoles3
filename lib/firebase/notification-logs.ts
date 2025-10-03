import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';

export interface NotificationLog {
  id: string;
  type: 'registration' | 'reminder' | 'custom' | 'responsibility_approved' | 'responsibility_rejected';
  subject: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  errors?: string[];
  sentBy: string; // UID de l'admin qui a envoyé (ou 'system' pour automatique)
  createdAt: Date;
}

const NOTIFICATION_LOGS = 'notificationLogs';

/**
 * Créer un log de notification
 */
export async function createNotificationLog(
  log: Omit<NotificationLog, 'id' | 'createdAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, NOTIFICATION_LOGS), {
      ...log,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating notification log:', error);
    throw new Error('Erreur lors de la création du log de notification');
  }
}

/**
 * Récupérer les derniers logs de notification
 */
export async function getRecentNotificationLogs(
  limitCount: number = 50
): Promise<NotificationLog[]> {
  try {
    const q = query(
      collection(db, NOTIFICATION_LOGS),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        subject: data.subject,
        recipientCount: data.recipientCount,
        sentCount: data.sentCount,
        failedCount: data.failedCount,
        errors: data.errors,
        sentBy: data.sentBy,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      };
    });
  } catch (error) {
    console.error('Error fetching notification logs:', error);
    throw new Error('Erreur lors de la récupération des logs');
  }
}

