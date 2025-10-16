import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getUserById } from '@/lib/firebase/users';
import { UserClient } from '@/types';

/**
 * Récupère le responsable d'une catégorie par le nom de la catégorie (value)
 */
export async function getCategoryResponsibleByValue(categoryValue: string): Promise<UserClient | null> {
  try {
    // Étape 1 : Récupérer la catégorie complète en cherchant par value
    let categoriesQuery = query(
      collection(db, 'missionCategories'),
      where('value', '==', categoryValue)
    );
    let categoriesSnapshot = await getDocs(categoriesQuery);

    // Si pas trouvé par value, essayer par label (pour compatibilité avec anciennes données)
    if (categoriesSnapshot.empty) {
      categoriesQuery = query(
        collection(db, 'missionCategories'),
        where('label', '==', categoryValue)
      );
      categoriesSnapshot = await getDocs(categoriesQuery);
    }

    if (categoriesSnapshot.empty) {
      return null;
    }

    const categoryData = categoriesSnapshot.docs[0];
    const categoryId = categoryData.id;

    // Étape 2 : Récupérer le responsable en utilisant le categoryId
    const responsiblesQuery = query(
      collection(db, 'categoryResponsibles'),
      where('categoryId', '==', categoryId)
    );
    const responsiblesSnapshot = await getDocs(responsiblesQuery);

    if (responsiblesSnapshot.empty) {
      return null;
    }

    const responsibleData = responsiblesSnapshot.docs[0].data();
    
    // Étape 3 : Récupérer les informations de l'utilisateur responsable
    const responsibleUser = await getUserById(responsibleData.responsibleId);
    return responsibleUser;
  } catch (err) {
    console.error('Error getting category responsible:', err);
    return null;
  }
}

