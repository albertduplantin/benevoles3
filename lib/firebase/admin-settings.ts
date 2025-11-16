import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

const ADMIN_SETTINGS_DOC = 'settings/admin';

export interface AdminSettings {
  autoApproveResponsibility: boolean;
  festivalStartDate?: Date;
  festivalEndDate?: Date;
  registrationsBlocked: boolean;
  registrationBlockedMessage?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

/**
 * Récupérer les paramètres admin
 */
export async function getAdminSettings(): Promise<AdminSettings> {
  try {
    const docRef = doc(db, ADMIN_SETTINGS_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        autoApproveResponsibility: data.autoApproveResponsibility || false,
        festivalStartDate: data.festivalStartDate?.toDate(),
        festivalEndDate: data.festivalEndDate?.toDate(),
        registrationsBlocked: data.registrationsBlocked || false,
        registrationBlockedMessage: data.registrationBlockedMessage || '',
        updatedAt: data.updatedAt?.toDate(),
        updatedBy: data.updatedBy,
      };
    }

    // Valeurs par défaut
    return {
      autoApproveResponsibility: false,
      registrationsBlocked: false,
      registrationBlockedMessage: '',
    };
  } catch (error) {
    console.error('Error getting admin settings:', error);
    return {
      autoApproveResponsibility: false,
      registrationsBlocked: false,
      registrationBlockedMessage: '',
    };
  }
}

/**
 * Mettre à jour les paramètres admin
 */
export async function updateAdminSettings(
  settings: Partial<AdminSettings>,
  adminId: string
): Promise<void> {
  try {
    const docRef = doc(db, ADMIN_SETTINGS_DOC);
    
    await setDoc(
      docRef,
      {
        ...settings,
        updatedAt: serverTimestamp(),
        updatedBy: adminId,
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating admin settings:', error);
    throw new Error('Erreur lors de la mise à jour des paramètres');
  }
}

