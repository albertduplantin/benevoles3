/**
 * Category Responsibles Management
 * 
 * Gestion des responsables de catégories de missions
 */

import { db } from './config';
import { adminDb } from './admin';
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
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { CategoryResponsible, CategoryResponsibleClient } from '@/types';

const COLLECTION_NAME = 'categoryResponsibles';

/**
 * Converter pour Firestore
 */
const categoryResponsibleConverter = {
  toFirestore: (data: Partial<CategoryResponsible>) => data,
  fromFirestore: (snapshot: any): CategoryResponsibleClient => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      categoryId: data.categoryId,
      categoryLabel: data.categoryLabel,
      responsibleId: data.responsibleId,
      assignedBy: data.assignedBy,
      assignedAt: data.assignedAt?.toDate() || new Date(),
    };
  },
};

/**
 * Assigner un responsable à une catégorie
 */
export async function assignCategoryResponsible(
  categoryId: string,
  categoryLabel: string,
  responsibleId: string,
  adminId: string
): Promise<string> {
  try {
    // Vérifier s'il y a déjà un responsable pour cette catégorie
    const existing = await getCategoryResponsible(categoryId);
    if (existing) {
      throw new Error('Cette catégorie a déjà un responsable. Retirez-le d\'abord.');
    }

    // Créer l'assignation
    const assignmentRef = await addDoc(collection(db, COLLECTION_NAME), {
      categoryId,
      categoryLabel,
      responsibleId,
      assignedBy: adminId,
      assignedAt: Timestamp.now(),
    });

    // Mettre à jour le rôle et les catégories de l'utilisateur
    const userRef = doc(db, 'users', responsibleId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentCategories = userData.responsibleForCategories || [];
      
      await updateDoc(userRef, {
        role: 'category_responsible',
        responsibleForCategories: [...currentCategories, categoryId],
        updatedAt: Timestamp.now(),
      });
    }

    return assignmentRef.id;
  } catch (error) {
    console.error('Error assigning category responsible:', error);
    throw error;
  }
}

/**
 * Retirer un responsable d'une catégorie
 */
export async function removeCategoryResponsible(
  categoryId: string
): Promise<void> {
  try {
    // Trouver l'assignation
    const q = query(
      collection(db, COLLECTION_NAME),
      where('categoryId', '==', categoryId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('Aucun responsable trouvé pour cette catégorie');
    }

    const assignment = snapshot.docs[0];
    const responsibleId = assignment.data().responsibleId;

    // Supprimer l'assignation
    await deleteDoc(assignment.ref);

    // Mettre à jour l'utilisateur
    const userRef = doc(db, 'users', responsibleId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentCategories = userData.responsibleForCategories || [];
      const updatedCategories = currentCategories.filter((c: string) => c !== categoryId);
      
      // Si plus aucune catégorie, repasser en volunteer
      const newRole = updatedCategories.length > 0 ? 'category_responsible' : 'volunteer';
      
      await updateDoc(userRef, {
        role: newRole,
        responsibleForCategories: updatedCategories,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error removing category responsible:', error);
    throw error;
  }
}

/**
 * Obtenir le responsable d'une catégorie
 */
export async function getCategoryResponsible(
  categoryId: string
): Promise<CategoryResponsibleClient | null> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME).withConverter(categoryResponsibleConverter),
      where('categoryId', '==', categoryId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data() as CategoryResponsibleClient;
  } catch (error) {
    console.error('Error getting category responsible:', error);
    throw error;
  }
}

/**
 * Obtenir toutes les assignations de responsables
 */
export async function getAllCategoryResponsibles(): Promise<CategoryResponsibleClient[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME).withConverter(categoryResponsibleConverter),
      orderBy('categoryLabel', 'asc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => doc.data() as CategoryResponsibleClient);
  } catch (error) {
    console.error('Error getting all category responsibles:', error);
    throw error;
  }
}

/**
 * Obtenir les catégories dont un utilisateur est responsable
 */
export async function getUserResponsibleCategories(
  userId: string
): Promise<CategoryResponsibleClient[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME).withConverter(categoryResponsibleConverter),
      where('responsibleId', '==', userId),
      orderBy('categoryLabel', 'asc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => doc.data() as CategoryResponsibleClient);
  } catch (error) {
    console.error('Error getting user responsible categories:', error);
    throw error;
  }
}

/**
 * Vérifier si un utilisateur est responsable d'une catégorie spécifique
 */
export async function isUserResponsibleForCategory(
  userId: string,
  categoryId: string
): Promise<boolean> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('categoryId', '==', categoryId),
      where('responsibleId', '==', userId)
    );
    const snapshot = await getDocs(q);

    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking if user is responsible for category:', error);
    return false;
  }
}

/**
 * Admin: Obtenir le responsable d'une catégorie (avec Firebase Admin)
 */
export async function getCategoryResponsibleAdmin(
  categoryId: string
): Promise<CategoryResponsibleClient | null> {
  try {
    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where('categoryId', '==', categoryId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      categoryId: data.categoryId,
      categoryLabel: data.categoryLabel,
      responsibleId: data.responsibleId,
      assignedBy: data.assignedBy,
      assignedAt: data.assignedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Error getting category responsible (admin):', error);
    throw error;
  }
}

/**
 * Admin: Obtenir toutes les assignations de responsables (avec Firebase Admin)
 */
export async function getAllCategoryResponsiblesAdmin(): Promise<CategoryResponsibleClient[]> {
  try {
    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .orderBy('categoryLabel', 'asc')
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        categoryId: data.categoryId,
        categoryLabel: data.categoryLabel,
        responsibleId: data.responsibleId,
        assignedBy: data.assignedBy,
        assignedAt: data.assignedAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error getting all category responsibles (admin):', error);
    throw error;
  }
}

/**
 * Admin: Assigner un responsable à une catégorie (avec Firebase Admin)
 */
export async function assignCategoryResponsibleAdmin(
  categoryId: string,
  categoryLabel: string,
  responsibleId: string,
  adminId: string
): Promise<string> {
  try {
    // Vérifier s'il y a déjà un responsable pour cette catégorie
    const existing = await getCategoryResponsibleAdmin(categoryId);
    if (existing) {
      throw new Error('Cette catégorie a déjà un responsable. Retirez-le d\'abord.');
    }

    // Créer l'assignation
    const assignmentRef = await adminDb.collection(COLLECTION_NAME).add({
      categoryId,
      categoryLabel,
      responsibleId,
      assignedBy: adminId,
      assignedAt: new Date(),
    });

    // Mettre à jour le rôle et les catégories de l'utilisateur
    const userRef = adminDb.collection('users').doc(responsibleId);
    const userSnap = await userRef.get();
    
    if (userSnap.exists) {
      const userData = userSnap.data();
      const currentCategories = userData?.responsibleForCategories || [];
      
      await userRef.update({
        role: 'category_responsible',
        responsibleForCategories: [...currentCategories, categoryId],
        updatedAt: new Date(),
      });
    }

    return assignmentRef.id;
  } catch (error) {
    console.error('Error assigning category responsible (admin):', error);
    throw error;
  }
}

/**
 * Admin: Retirer un responsable d'une catégorie (avec Firebase Admin)
 */
export async function removeCategoryResponsibleAdmin(
  categoryId: string
): Promise<void> {
  try {
    // Trouver l'assignation
    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where('categoryId', '==', categoryId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new Error('Aucun responsable trouvé pour cette catégorie');
    }

    const assignment = snapshot.docs[0];
    const responsibleId = assignment.data().responsibleId;

    // Supprimer l'assignation
    await assignment.ref.delete();

    // Mettre à jour l'utilisateur
    const userRef = adminDb.collection('users').doc(responsibleId);
    const userSnap = await userRef.get();
    
    if (userSnap.exists) {
      const userData = userSnap.data();
      const currentCategories = userData?.responsibleForCategories || [];
      const updatedCategories = currentCategories.filter((c: string) => c !== categoryId);
      
      // Si plus aucune catégorie, repasser en volunteer
      const newRole = updatedCategories.length > 0 ? 'category_responsible' : 'volunteer';
      
      await userRef.update({
        role: newRole,
        responsibleForCategories: updatedCategories,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Error removing category responsible (admin):', error);
    throw error;
  }
}

