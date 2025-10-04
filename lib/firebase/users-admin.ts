import { adminDb } from './admin';
import { UserClient } from '@/types';

/**
 * Récupérer un utilisateur par ID (côté serveur)
 * À utiliser dans les API Routes
 */
export async function getUserByIdAdmin(userId: string): Promise<UserClient | null> {
  try {
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    const data = userDoc.data()!;
    
    return {
      uid: userDoc.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      photoURL: data.photoURL,
      createdAt: data.createdAt?.toDate() || new Date(),
      consents: {
        dataProcessing: data.consents?.dataProcessing || false,
        communications: data.consents?.communications || false,
        consentDate: data.consents?.consentDate?.toDate() || new Date(),
      },
      notificationPreferences: {
        email: data.notificationPreferences?.email || false,
        sms: data.notificationPreferences?.sms || false,
      },
    };
  } catch (error) {
    console.error('Error getting user (admin):', error);
    throw new Error('Erreur lors de la récupération de l\'utilisateur');
  }
}

/**
 * Récupérer tous les bénévoles (côté serveur)
 * À utiliser dans les API Routes
 */
export async function getAllVolunteersAdmin(): Promise<UserClient[]> {
  try {
    const snapshot = await adminDb
      .collection('users')
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        photoURL: data.photoURL,
        createdAt: data.createdAt?.toDate() || new Date(),
        consents: {
          dataProcessing: data.consents?.dataProcessing || false,
          communications: data.consents?.communications || false,
          consentDate: data.consents?.consentDate?.toDate() || new Date(),
        },
        notificationPreferences: {
          email: data.notificationPreferences?.email || false,
          sms: data.notificationPreferences?.sms || false,
        },
      };
    });
  } catch (error) {
    console.error('Error getting all volunteers (admin):', error);
    throw new Error('Erreur lors de la récupération des bénévoles');
  }
}

