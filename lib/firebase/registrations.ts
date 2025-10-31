import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  runTransaction,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';
import { Mission } from '@/types';

/**
 * Vérifier si deux missions se chevauchent temporellement
 */
export function doMissionsOverlap(mission1: Mission, mission2: Mission): boolean {
  // Si l'une des missions n'a pas de dates, pas de chevauchement
  if (!mission1.startDate || !mission2.startDate) {
    return false;
  }

  const start1 = mission1.startDate instanceof Date 
    ? mission1.startDate 
    : mission1.startDate.toDate();
  const end1 = mission1.endDate 
    ? (mission1.endDate instanceof Date ? mission1.endDate : mission1.endDate.toDate())
    : start1;

  const start2 = mission2.startDate instanceof Date 
    ? mission2.startDate 
    : mission2.startDate.toDate();
  const end2 = mission2.endDate 
    ? (mission2.endDate instanceof Date ? mission2.endDate : mission2.endDate.toDate())
    : start2;

  // Deux missions se chevauchent si :
  // - Le début de mission1 est avant la fin de mission2 ET
  // - La fin de mission1 est après le début de mission2
  return start1 < end2 && end1 > start2;
}

/**
 * Vérifier si un utilisateur a des conflits d'horaire avec une mission
 */
export async function checkUserMissionConflicts(
  userId: string,
  targetMission: Mission
): Promise<Mission[]> {
  // Récupérer toutes les missions de l'utilisateur
  const userMissionsQuery = query(
    collection(db, COLLECTIONS.MISSIONS),
    where('volunteers', 'array-contains', userId)
  );
  const userMissionsSnapshot = await getDocs(userMissionsQuery);
  const userMissions = userMissionsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Mission));

  // Filtrer les missions qui se chevauchent
  return userMissions.filter(userMission => 
    doMissionsOverlap(targetMission, userMission)
  );
}

/**
 * Inscrire un bénévole à une mission
 */
export async function registerToMission(
  missionId: string,
  userId: string
): Promise<void> {
  try {
    const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId);
    
    // Récupérer d'abord la mission pour la vérification des chevauchements
    const missionDoc = await getDoc(missionRef);
    
    if (!missionDoc.exists()) {
      throw new Error('Mission introuvable');
    }

    const mission = missionDoc.data() as Mission;

    // Vérifier les chevauchements avec les missions existantes AVANT la transaction
    const overlappingMissions = await checkUserMissionConflicts(userId, mission);

    if (overlappingMissions.length > 0) {
      const overlappingTitles = overlappingMissions.map(m => m.title).join(', ');
      throw new Error(
        `Vous ne pouvez pas vous inscrire à cette mission car elle se chevauche avec : ${overlappingTitles}`
      );
    }

    // Utiliser une transaction pour éviter les problèmes de concurrence
    await runTransaction(db, async (transaction) => {
      const missionDoc = await transaction.get(missionRef);

      if (!missionDoc.exists()) {
        throw new Error('Mission introuvable');
      }

      const mission = missionDoc.data() as Mission;

      // Vérifications
      if (mission.status === 'cancelled') {
        throw new Error('Cette mission a été annulée');
      }

      if (mission.status === 'completed') {
        throw new Error('Cette mission est terminée');
      }

      if (mission.status === 'draft') {
        throw new Error('Cette mission n\'est pas encore publiée');
      }

      if (mission.volunteers.includes(userId)) {
        throw new Error('Vous êtes déjà inscrit à cette mission');
      }

      if (mission.volunteers.length >= mission.maxVolunteers) {
        throw new Error('Cette mission est complète');
      }

      // Ajouter le bénévole
      const newVolunteers = [...mission.volunteers, userId];
      const updates: any = {
        volunteers: newVolunteers,
        updatedAt: serverTimestamp(),
      };

      // Mettre à jour le statut si la mission est maintenant complète
      if (newVolunteers.length >= mission.maxVolunteers) {
        updates.status = 'full';
      }

      transaction.update(missionRef, updates);
    });
  } catch (error: any) {
    console.error('Error registering to mission:', error);
    throw error;
  }
}

/**
 * Désinscrire un bénévole d'une mission
 */
export async function unregisterFromMission(
  missionId: string,
  userId: string
): Promise<void> {
  try {
    const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId);

    await runTransaction(db, async (transaction) => {
      const missionDoc = await transaction.get(missionRef);

      if (!missionDoc.exists()) {
        throw new Error('Mission introuvable');
      }

      const mission = missionDoc.data() as Mission;

      if (!mission.volunteers.includes(userId)) {
        throw new Error('Vous n\'êtes pas inscrit à cette mission');
      }

      // Vérifier si la mission n'est pas trop proche (24h avant)
      if (mission.startDate) {
        const startDate =
          mission.startDate instanceof Date
            ? mission.startDate
            : mission.startDate.toDate();
        const now = new Date();
        const hoursUntilStart =
          (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilStart < 24 && hoursUntilStart > 0) {
          throw new Error(
            'Impossible de se désinscrire moins de 24h avant le début de la mission'
          );
        }
      }

      // Retirer le bénévole
      const newVolunteers = mission.volunteers.filter((id) => id !== userId);
      const updates: any = {
        volunteers: newVolunteers,
        updatedAt: serverTimestamp(),
      };

      // Mettre à jour le statut si la mission n'est plus complète
      if (mission.status === 'full' && newVolunteers.length < mission.maxVolunteers) {
        updates.status = 'published';
      }

      transaction.update(missionRef, updates);
    });
    
    // Après la désinscription, vérifier s'il y a des personnes en liste d'attente
    // Note: On pourrait automatiquement inscrire le premier, mais c'est mieux de le notifier
    // et le laisser s'inscrire lui-même pour confirmer sa disponibilité
  } catch (error: any) {
    console.error('Error unregistering from mission:', error);
    throw error;
  }
}

/**
 * Vérifier si un utilisateur est inscrit à une mission
 */
export async function isUserRegistered(
  missionId: string,
  userId: string
): Promise<boolean> {
  try {
    const missionDoc = await getDoc(doc(db, COLLECTIONS.MISSIONS, missionId));

    if (!missionDoc.exists()) {
      return false;
    }

    const mission = missionDoc.data() as Mission;
    return mission.volunteers.includes(userId);
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
}

/**
 * Obtenir le nombre de places disponibles
 */
export async function getAvailableSpots(missionId: string): Promise<number> {
  try {
    const missionDoc = await getDoc(doc(db, COLLECTIONS.MISSIONS, missionId));

    if (!missionDoc.exists()) {
      return 0;
    }

    const mission = missionDoc.data() as Mission;
    return Math.max(0, mission.maxVolunteers - mission.volunteers.length);
  } catch (error) {
    console.error('Error getting available spots:', error);
    return 0;
  }
}

/**
 * Ajouter un bénévole à la liste d'attente d'une mission complète
 */
export async function joinWaitlist(
  missionId: string,
  userId: string
): Promise<void> {
  try {
    const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId);

    await runTransaction(db, async (transaction) => {
      const missionDoc = await transaction.get(missionRef);

      if (!missionDoc.exists()) {
        throw new Error('Mission introuvable');
      }

      const mission = missionDoc.data() as Mission;

      // Vérifications
      if (mission.volunteers.includes(userId)) {
        throw new Error('Vous êtes déjà inscrit à cette mission');
      }

      if (mission.volunteers.length < mission.maxVolunteers) {
        throw new Error('Cette mission a encore des places disponibles, vous pouvez vous inscrire directement');
      }

      const waitlist = mission.waitlist || [];
      if (waitlist.includes(userId)) {
        throw new Error('Vous êtes déjà sur la liste d\'attente');
      }

      // Ajouter à la liste d'attente
      transaction.update(missionRef, {
        waitlist: [...waitlist, userId],
        updatedAt: serverTimestamp(),
      });
    });
  } catch (error: any) {
    console.error('Error joining waitlist:', error);
    throw error;
  }
}

/**
 * Retirer un bénévole de la liste d'attente
 */
export async function leaveWaitlist(
  missionId: string,
  userId: string
): Promise<void> {
  try {
    const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId);

    await updateDoc(missionRef, {
      waitlist: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Error leaving waitlist:', error);
    throw error;
  }
}

/**
 * Vérifier si un utilisateur est sur la liste d'attente
 */
export async function isUserOnWaitlist(
  missionId: string,
  userId: string
): Promise<boolean> {
  try {
    const missionDoc = await getDoc(doc(db, COLLECTIONS.MISSIONS, missionId));

    if (!missionDoc.exists()) {
      return false;
    }

    const mission = missionDoc.data() as Mission;
    return mission.waitlist?.includes(userId) || false;
  } catch (error) {
    console.error('Error checking waitlist:', error);
    return false;
  }
}

