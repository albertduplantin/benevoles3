import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  arrayRemove,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import { User, UserClient } from '@/types';
import { COLLECTIONS } from './collections';

const USERS = COLLECTIONS.USERS;
const MISSIONS = COLLECTIONS.MISSIONS;

/**
 * Récupère tous les bénévoles
 */
export async function getAllVolunteers(): Promise<UserClient[]> {
  try {
    const q = query(collection(db, USERS), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data() as User;
      return {
        uid: doc.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        photoURL: data.photoURL,
        createdAt: data.createdAt instanceof Date ? data.createdAt : (data.createdAt as any).toDate(),
        consents: {
          dataProcessing: data.consents.dataProcessing,
          communications: data.consents.communications,
          consentDate: data.consents.consentDate instanceof Date ? data.consents.consentDate : (data.consents.consentDate as any).toDate(),
        },
        notificationPreferences: data.notificationPreferences,
      };
    });
  } catch (error) {
    console.error('Error fetching all volunteers:', error);
    throw new Error('Erreur lors de la récupération des bénévoles');
  }
}

/**
 * Met à jour les informations d'un bénévole
 */
export async function updateVolunteerInfo(
  volunteerId: string,
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }
): Promise<void> {
  try {
    const volunteerRef = doc(db, USERS, volunteerId);
    await updateDoc(volunteerRef, data);
  } catch (error) {
    console.error('Error updating volunteer info:', error);
    throw new Error('Erreur lors de la mise à jour du bénévole');
  }
}

/**
 * Change le rôle d'un bénévole
 */
export async function changeVolunteerRole(
  volunteerId: string,
  newRole: 'volunteer' | 'category_responsible' | 'admin'
): Promise<void> {
  try {
    const volunteerRef = doc(db, USERS, volunteerId);
    await updateDoc(volunteerRef, { role: newRole });
  } catch (error) {
    console.error('Error changing volunteer role:', error);
    throw new Error('Erreur lors du changement de rôle');
  }
}

/**
 * Supprime un bénévole et le retire de toutes ses missions
 */
export async function deleteVolunteer(volunteerId: string): Promise<void> {
  try {
    const batch = writeBatch(db);

    // 1. Récupérer toutes les missions où le bénévole est inscrit
    const missionsQuery = query(
      collection(db, MISSIONS),
      where('volunteers', 'array-contains', volunteerId)
    );
    const missionsSnapshot = await getDocs(missionsQuery);

    // 2. Retirer le bénévole de toutes les missions
    missionsSnapshot.docs.forEach((missionDoc) => {
      const missionRef = doc(db, MISSIONS, missionDoc.id);
      batch.update(missionRef, {
        volunteers: arrayRemove(volunteerId),
        responsibles: arrayRemove(volunteerId),
        pendingResponsibles: arrayRemove(volunteerId),
      });
    });

    // 3. Supprimer le compte utilisateur
    const userRef = doc(db, USERS, volunteerId);
    batch.delete(userRef);

    // 4. Exécuter toutes les opérations
    await batch.commit();
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    throw new Error('Erreur lors de la suppression du bénévole');
  }
}

/**
 * Inscrit un bénévole à une mission (par un admin)
 */
export async function adminRegisterVolunteer(
  missionId: string,
  volunteerId: string
): Promise<void> {
  try {
    const missionRef = doc(db, MISSIONS, missionId);
    
    // Vérifier d'abord que la mission existe et n'est pas complète
    const missionDoc = await getDocs(query(collection(db, MISSIONS), where('__name__', '==', missionId)));
    if (missionDoc.empty) {
      throw new Error('Mission introuvable');
    }

    const missionData = missionDoc.docs[0].data();
    if (missionData.volunteers && missionData.volunteers.includes(volunteerId)) {
      throw new Error('Le bénévole est déjà inscrit à cette mission');
    }

    if (missionData.volunteers && missionData.volunteers.length >= missionData.maxVolunteers) {
      throw new Error('La mission est complète');
    }

    // Inscrire le bénévole
    await updateDoc(missionRef, {
      volunteers: [...(missionData.volunteers || []), volunteerId],
    });
  } catch (error) {
    console.error('Error admin registering volunteer:', error);
    throw error;
  }
}

/**
 * Désinscrit un bénévole d'une mission (par un admin)
 */
export async function adminUnregisterVolunteer(
  missionId: string,
  volunteerId: string
): Promise<void> {
  try {
    const missionRef = doc(db, MISSIONS, missionId);
    await updateDoc(missionRef, {
      volunteers: arrayRemove(volunteerId),
      responsibles: arrayRemove(volunteerId),
    });
  } catch (error) {
    console.error('Error admin unregistering volunteer:', error);
    throw new Error('Erreur lors de la désinscription du bénévole');
  }
}

