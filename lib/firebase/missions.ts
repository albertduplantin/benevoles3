import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';
import { Mission, MissionClient, MissionStatus, MissionType } from '@/types';
import { convertMissionToClient } from './converters';

/**
 * Créer une nouvelle mission (Admin uniquement)
 */
export async function createMission(
  missionData: {
    title: string;
    description: string;
    category: string;
    type: MissionType;
    startDate?: Date;
    endDate?: Date;
    location: string;
    maxVolunteers: number;
    isUrgent?: boolean;
    isRecurrent?: boolean;
    status?: MissionStatus;
  },
  createdBy: string
): Promise<string> {
  try {
    // DEBUG: Log des dates avant conversion
    console.log('📅 [CREATE MISSION] startDate reçue:', missionData.startDate);
    console.log('📅 [CREATE MISSION] startDate toString:', missionData.startDate?.toString());
    console.log('📅 [CREATE MISSION] startDate getHours:', missionData.startDate?.getHours());
    console.log('📅 [CREATE MISSION] startDate getTimezoneOffset:', missionData.startDate?.getTimezoneOffset());
    
    const startTimestamp = missionData.startDate ? Timestamp.fromDate(missionData.startDate) : null;
    const endTimestamp = missionData.endDate ? Timestamp.fromDate(missionData.endDate) : null;
    
    console.log('🔥 [CREATE MISSION] Timestamp startDate seconds:', startTimestamp?.seconds);
    console.log('🔥 [CREATE MISSION] Timestamp toDate:', startTimestamp?.toDate().toString());
    
    const docRef = await addDoc(collection(db, COLLECTIONS.MISSIONS), {
      ...missionData,
      startDate: startTimestamp,
      endDate: endTimestamp,
      status: missionData.status || 'draft',
      isUrgent: missionData.isUrgent || false,
      isRecurrent: missionData.isRecurrent || false,
      createdBy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      volunteers: [],
      responsibles: [],
      pendingResponsibles: [],
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating mission:', error);
    throw new Error('Erreur lors de la création de la mission');
  }
}

/**
 * Récupérer une mission par ID
 */
export async function getMissionById(
  missionId: string
): Promise<MissionClient | null> {
  try {
    const docRef = doc(db, COLLECTIONS.MISSIONS, missionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const mission = { id: docSnap.id, ...docSnap.data() } as Mission;
      return convertMissionToClient(mission);
    }

    return null;
  } catch (error) {
    console.error('Error getting mission:', error);
    throw new Error('Erreur lors de la récupération de la mission');
  }
}

/**
 * Récupérer toutes les missions publiées
 */
export async function getPublishedMissions(): Promise<MissionClient[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.MISSIONS),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    const missions: MissionClient[] = [];

    querySnapshot.forEach((doc) => {
      const mission = { id: doc.id, ...doc.data() } as Mission;
      missions.push(convertMissionToClient(mission));
    });

    // Trier par urgence côté client pour éviter l'index composite
    return missions.sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return 0;
    });
  } catch (error) {
    console.error('Error getting published missions:', error);
    throw new Error('Erreur lors de la récupération des missions');
  }
}

/**
 * Récupérer toutes les missions (Admin uniquement)
 */
export async function getAllMissions(): Promise<MissionClient[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.MISSIONS),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const querySnapshot = await getDocs(q);
    const missions: MissionClient[] = [];

    querySnapshot.forEach((doc) => {
      const mission = { id: doc.id, ...doc.data() } as Mission;
      missions.push(convertMissionToClient(mission));
    });

    return missions;
  } catch (error) {
    console.error('Error getting all missions:', error);
    throw new Error('Erreur lors de la récupération des missions');
  }
}

/**
 * Supprimer une mission (Admin uniquement)
 */
export async function deleteMission(missionId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.MISSIONS, missionId));
  } catch (error) {
    console.error('Error deleting mission:', error);
    throw new Error('Erreur lors de la suppression de la mission');
  }
}

/**
 * Mettre à jour une mission
 */
export async function updateMission(
  missionId: string,
  updates: any
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.MISSIONS, missionId);

    // Convertir les dates si présentes
    const updateData: any = { ...updates };
    
    // Si startDate est une string (datetime-local), la convertir en Date puis Timestamp
    if (updates.startDate) {
      let date: Date;
      if (typeof updates.startDate === 'string') {
        // Parser la string datetime-local en tant que date locale
        const [datePart, timePart] = updates.startDate.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        date = new Date(year, month - 1, day, hours, minutes);
      } else {
        date = updates.startDate;
      }
      updateData.startDate = Timestamp.fromDate(date);
    } else if (updates.startDate === undefined || updates.startDate === '') {
      // Si undefined ou vide, supprimer le champ
      delete updateData.startDate;
    }
    
    // Si endDate est une string (datetime-local), la convertir en Date puis Timestamp
    if (updates.endDate) {
      let date: Date;
      if (typeof updates.endDate === 'string') {
        // Parser la string datetime-local en tant que date locale
        const [datePart, timePart] = updates.endDate.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        date = new Date(year, month - 1, day, hours, minutes);
      } else {
        date = updates.endDate;
      }
      updateData.endDate = Timestamp.fromDate(date);
    } else if (updates.endDate === undefined || updates.endDate === '') {
      // Si undefined ou vide, supprimer le champ
      delete updateData.endDate;
    }
    
    updateData.updatedAt = serverTimestamp();

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating mission:', error);
    throw new Error('Erreur lors de la mise à jour de la mission');
  }
}

/**
 * Récupérer les missions d'un bénévole
 */
export async function getUserMissions(userId: string): Promise<MissionClient[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.MISSIONS),
      where('volunteers', 'array-contains', userId),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    const missions: MissionClient[] = [];

    querySnapshot.forEach((doc) => {
      const mission = { id: doc.id, ...doc.data() } as Mission;
      missions.push(convertMissionToClient(mission));
    });

    // Trier côté client par startDate
    return missions.sort((a, b) => {
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  } catch (error) {
    console.error('Error getting user missions:', error);
    throw new Error('Erreur lors de la récupération des missions');
  }
}

/**
 * Inscrire un bénévole à une mission
 */
export async function registerVolunteerToMission(
  missionId: string,
  userId: string
): Promise<void> {
  try {
    const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId);
    const missionSnap = await getDoc(missionRef);

    if (!missionSnap.exists()) {
      throw new Error('Mission introuvable');
    }

    const mission = missionSnap.data() as Mission;

    // Vérifier si la mission est pleine
    if (mission.volunteers.length >= mission.maxVolunteers) {
      throw new Error('Cette mission est complète');
    }

    // Vérifier si l'utilisateur est déjà inscrit
    if (mission.volunteers.includes(userId)) {
      throw new Error('Vous êtes déjà inscrit à cette mission');
    }

    // Ajouter le bénévole
    const updatedVolunteers = [...mission.volunteers, userId];

    await updateDoc(missionRef, {
      volunteers: updatedVolunteers,
      updatedAt: serverTimestamp(),
      // Mettre le statut à "full" si la mission est maintenant complète
      ...(updatedVolunteers.length >= mission.maxVolunteers && {
        status: 'full' as MissionStatus,
      }),
    });
  } catch (error: any) {
    console.error('Error registering volunteer:', error);
    throw error;
  }
}

/**
 * Désinscrire un bénévole d'une mission
 */
export async function unregisterVolunteerFromMission(
  missionId: string,
  userId: string
): Promise<void> {
  try {
    const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId);
    const missionSnap = await getDoc(missionRef);

    if (!missionSnap.exists()) {
      throw new Error('Mission introuvable');
    }

    const mission = missionSnap.data() as Mission;

    // Vérifier si l'utilisateur est inscrit
    if (!mission.volunteers.includes(userId)) {
      throw new Error('Vous n\'êtes pas inscrit à cette mission');
    }

    // Retirer le bénévole
    const updatedVolunteers = mission.volunteers.filter((id) => id !== userId);

    await updateDoc(missionRef, {
      volunteers: updatedVolunteers,
      updatedAt: serverTimestamp(),
      // Remettre le statut à "published" si la mission n'est plus complète
      ...(mission.status === 'full' && { status: 'published' as MissionStatus }),
    });
  } catch (error: any) {
    console.error('Error unregistering volunteer:', error);
    throw error;
  }
}

/**
 * Dupliquer une mission (Admin et responsables de catégorie)
 */
export async function duplicateMission(
  missionId: string,
  duplicatedBy: string
): Promise<string> {
  try {
    // Récupérer la mission originale
    const originalMission = await getMissionById(missionId);
    
    if (!originalMission) {
      throw new Error('Mission introuvable');
    }

    // Créer une nouvelle mission avec les mêmes données
    const newMissionId = await createMission(
      {
        title: `${originalMission.title} (Copie)`,
        description: originalMission.description,
        category: originalMission.category,
        type: originalMission.type,
        startDate: originalMission.startDate,
        endDate: originalMission.endDate,
        location: originalMission.location,
        maxVolunteers: originalMission.maxVolunteers,
        isUrgent: originalMission.isUrgent,
        isRecurrent: originalMission.isRecurrent,
        status: 'draft', // Toujours créer en brouillon
      },
      duplicatedBy
    );

    return newMissionId;
  } catch (error) {
    console.error('Error duplicating mission:', error);
    throw new Error('Erreur lors de la duplication de la mission');
  }
}

