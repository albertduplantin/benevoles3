import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { MissionCategoryDB, MissionCategoryClient } from '@/types/category';

const COLLECTION_NAME = 'missionCategories';

/**
 * Convertir une catégorie Firestore en format client
 */
function convertToClient(category: MissionCategoryDB): MissionCategoryClient {
  return {
    ...category,
    createdAt: category.createdAt instanceof Date ? category.createdAt : (category.createdAt as any).toDate(),
    updatedAt: category.updatedAt instanceof Date ? category.updatedAt : category.updatedAt ? (category.updatedAt as any).toDate() : undefined,
  };
}

/**
 * Créer une nouvelle catégorie
 */
export async function createCategory(
  value: string,
  label: string,
  group: string,
  order: number,
  createdBy: string
): Promise<string> {
  try {
    const categoryData: Omit<MissionCategoryDB, 'id'> = {
      value,
      label,
      group,
      order,
      active: true,
      createdAt: serverTimestamp(),
      createdBy,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), categoryData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error('Erreur lors de la création de la catégorie');
  }
}

/**
 * Mettre à jour une catégorie
 */
export async function updateCategory(
  categoryId: string,
  updates: Partial<Pick<MissionCategoryDB, 'label' | 'group' | 'order' | 'active'>>
): Promise<void> {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, categoryId);
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Erreur lors de la mise à jour de la catégorie');
  }
}

/**
 * Supprimer une catégorie
 */
export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Erreur lors de la suppression de la catégorie');
  }
}

/**
 * Archiver une catégorie (désactiver au lieu de supprimer)
 */
export async function archiveCategory(categoryId: string): Promise<void> {
  try {
    await updateCategory(categoryId, { active: false });
  } catch (error) {
    console.error('Error archiving category:', error);
    throw new Error('Erreur lors de l\'archivage de la catégorie');
  }
}

/**
 * Obtenir toutes les catégories actives
 */
export async function getActiveCategories(): Promise<MissionCategoryClient[]> {
  try {
    // Récupérer seulement les catégories actives
    const q = query(
      collection(db, COLLECTION_NAME),
      where('active', '==', true)
    );
    const snapshot = await getDocs(q);

    const categories = snapshot.docs.map((doc) => {
      const data = doc.data() as MissionCategoryDB;
      return convertToClient({ ...data, id: doc.id });
    });

    // Tri côté client par groupe puis par ordre
    return categories.sort((a, b) => {
      if (a.group !== b.group) {
        return a.group.localeCompare(b.group);
      }
      return a.order - b.order;
    });
  } catch (error) {
    console.error('Error getting active categories:', error);
    throw new Error('Erreur lors de la récupération des catégories actives');
  }
}

/**
 * Obtenir toutes les catégories (actives et archivées)
 */
export async function getAllCategories(): Promise<MissionCategoryClient[]> {
  try {
    // Récupérer toutes les catégories sans orderBy composé (évite le besoin d'index)
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));

    const categories = snapshot.docs.map((doc) => {
      const data = doc.data() as MissionCategoryDB;
      return convertToClient({ ...data, id: doc.id });
    });

    // Tri côté client par groupe puis par ordre
    return categories.sort((a, b) => {
      if (a.group !== b.group) {
        return a.group.localeCompare(b.group);
      }
      return a.order - b.order;
    });
  } catch (error) {
    console.error('Error getting all categories:', error);
    throw new Error('Erreur lors de la récupération des catégories');
  }
}

/**
 * Obtenir une catégorie par son ID
 */
export async function getCategoryById(categoryId: string): Promise<MissionCategoryClient | null> {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, categoryId);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) {
      return null;
    }

    const data = categorySnap.data() as MissionCategoryDB;
    return convertToClient({ ...data, id: categorySnap.id });
  } catch (error) {
    console.error('Error getting category:', error);
    throw new Error('Erreur lors de la récupération de la catégorie');
  }
}

/**
 * Obtenir les catégories groupées
 */
export async function getGroupedCategories(): Promise<Array<{ group: string; categories: MissionCategoryClient[] }>> {
  try {
    const categories = await getActiveCategories();
    
    const grouped = categories.reduce((acc, category) => {
      const existing = acc.find(g => g.group === category.group);
      if (existing) {
        existing.categories.push(category);
      } else {
        acc.push({ group: category.group, categories: [category] });
      }
      return acc;
    }, [] as Array<{ group: string; categories: MissionCategoryClient[] }>);

    return grouped;
  } catch (error) {
    console.error('Error getting grouped categories:', error);
    throw new Error('Erreur lors de la récupération des catégories groupées');
  }
}

/**
 * Vérifier si une catégorie est utilisée dans des missions
 */
export async function isCategoryUsed(categoryValue: string): Promise<boolean> {
  try {
    const missionsQuery = query(
      collection(db, 'missions'),
      where('category', '==', categoryValue)
    );
    const snapshot = await getDocs(missionsQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking if category is used:', error);
    return false;
  }
}

