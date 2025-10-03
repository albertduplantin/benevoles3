import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';
import { getAdminSettings } from './admin-settings';

/**
 * Demander à devenir responsable d'une mission
 * Note: Si l'auto-approbation est activée, approuve automatiquement
 */
export async function requestMissionResponsibility(
  missionId: string,
  userId: string
): Promise<{ autoApproved: boolean }> {
  try {
    const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId);
    const missionSnap = await getDoc(missionRef);
    
    if (!missionSnap.exists()) {
      throw new Error('Mission introuvable');
    }

    const missionData = missionSnap.data();
    
    // Vérifier si la mission a déjà un responsable
    if (missionData.responsibles && missionData.responsibles.length > 0) {
      throw new Error('Cette mission a déjà un responsable');
    }

    // Récupérer les paramètres admin
    const settings = await getAdminSettings();
    const autoApprove = settings.autoApproveResponsibility;

    if (autoApprove) {
      // Auto-approbation activée : ajouter directement dans responsibles + volunteers
      await updateDoc(missionRef, {
        responsibles: arrayUnion(userId),
        volunteers: arrayUnion(userId), // Auto-inscription
        updatedAt: serverTimestamp(),
      });
      return { autoApproved: true };
    } else {
      // Auto-approbation désactivée : ajouter dans pendingResponsibles
      await updateDoc(missionRef, {
        pendingResponsibles: arrayUnion(userId),
        updatedAt: serverTimestamp(),
      });
      return { autoApproved: false };
    }
  } catch (error: any) {
    console.error('Error requesting mission responsibility:', error);
    throw error;
  }
}

/**
 * Annuler une demande de responsabilité
 */
export async function cancelResponsibilityRequest(
  missionId: string,
  userId: string
): Promise<void> {
  try {
    const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId);
    
    // Retirer l'utilisateur de pendingResponsibles
    await updateDoc(missionRef, {
      pendingResponsibles: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error canceling responsibility request:', error);
    throw new Error('Erreur lors de l\'annulation de la demande');
  }
}

/**
 * Approuver une demande de responsabilité (Admin uniquement)
 * Note: Inscrit automatiquement l'utilisateur à la mission si pas déjà inscrit
 */
export async function approveResponsibilityRequest(
  missionId: string,
  userId: string
): Promise<void> {
  try {
    const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId);
    
    // Retirer de pendingResponsibles, ajouter à responsibles, et assurer inscription
    await updateDoc(missionRef, {
      pendingResponsibles: arrayRemove(userId),
      responsibles: arrayUnion(userId),
      volunteers: arrayUnion(userId), // Auto-inscription si pas déjà inscrit
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error approving responsibility request:', error);
    throw new Error('Erreur lors de l\'approbation de la demande');
  }
}

/**
 * Rejeter une demande de responsabilité (Admin uniquement)
 */
export async function rejectResponsibilityRequest(
  missionId: string,
  userId: string
): Promise<void> {
  try {
    const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId);
    
    // Simplement retirer de pendingResponsibles
    await updateDoc(missionRef, {
      pendingResponsibles: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error rejecting responsibility request:', error);
    throw new Error('Erreur lors du rejet de la demande');
  }
}

/**
 * Se retirer comme responsable d'une mission
 */
export async function removeResponsibility(
  missionId: string,
  userId: string
): Promise<void> {
  try {
    const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId);
    
    // Retirer de responsibles
    await updateDoc(missionRef, {
      responsibles: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error removing responsibility:', error);
    throw new Error('Erreur lors du retrait de la responsabilité');
  }
}

