import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';
import { Mission } from '@/types';

/**
 * Inscrire un bénévole à une mission
 */
export async function registerToMission(
  missionId: string,
  userId: string
): Promise<void> {
  try {
    const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId);

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

    // Envoyer l'email de confirmation (sans attendre)
    // On fait ça après la transaction pour ne pas la bloquer
    if (typeof window !== 'undefined') {
      console.log('📧 Déclenchement email inscription...');
      console.log('👤 User ID:', userId);
      console.log('🎯 Mission ID:', missionId);
      
      fetch('/api/notifications/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerId: userId, missionId }),
      })
        .then(response => {
          console.log('📬 Réponse API notifications:', response.status);
          return response.json();
        })
        .then(data => {
          console.log('📬 Données réponse:', data);
          if (data.success) {
            console.log('✅ Email envoyé avec succès !');
          } else {
            console.error('❌ Erreur email:', data.error);
          }
        })
        .catch(error => {
          console.error('❌ Failed to send registration email:', error);
          // On ne fait pas échouer l'inscription si l'email échoue
        });
    }
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

