import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getUserById } from '@/lib/firebase/users';
import { UserClient } from '@/types';

/**
 * Récupère le premier responsable d'une catégorie par le nom de la catégorie (value)
 * @deprecated Utilisez getCategoryResponsiblesByValue pour obtenir tous les responsables
 */
export async function getCategoryResponsibleByValue(categoryValue: string): Promise<UserClient | null> {
  try {
    const responsibles = await getCategoryResponsiblesByValue(categoryValue);
    return responsibles.length > 0 ? responsibles[0] : null;
  } catch (err) {
    console.error('Error getting category responsible:', err);
    return null;
  }
}

/**
 * Récupère TOUS les responsables d'une catégorie par le nom de la catégorie (value)
 */
export async function getCategoryResponsiblesByValue(categoryValue: string): Promise<UserClient[]> {
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
      console.log(`🔍 [CATEGORY RESPONSIBLE] Aucune catégorie trouvée pour: ${categoryValue}`);
      return [];
    }

    const categoryData = categoriesSnapshot.docs[0];
    const categoryId = categoryData.id;
    console.log(`🔍 [CATEGORY RESPONSIBLE] Catégorie trouvée: ${categoryValue} (ID: ${categoryId})`);

    // Étape 2 : Récupérer TOUS les responsables en utilisant le categoryId
    const responsiblesQuery = query(
      collection(db, 'categoryResponsibles'),
      where('categoryId', '==', categoryId)
    );
    const responsiblesSnapshot = await getDocs(responsiblesQuery);

    console.log(`🔍 [CATEGORY RESPONSIBLE] ${responsiblesSnapshot.size} responsable(s) trouvé(s) pour ${categoryValue}`);

    if (responsiblesSnapshot.empty) {
      return [];
    }

    // Étape 3 : Récupérer les informations de tous les utilisateurs responsables
    const responsibleUsers: UserClient[] = [];
    for (const doc of responsiblesSnapshot.docs) {
      const responsibleData = doc.data();
      console.log(`🔍 [CATEGORY RESPONSIBLE] Responsable trouvé: responsibleId=${responsibleData.responsibleId}, assignedAt=${responsibleData.assignedAt}`);
      const responsibleUser = await getUserById(responsibleData.responsibleId);
      if (responsibleUser) {
        console.log(`🔍 [CATEGORY RESPONSIBLE] Utilisateur récupéré: ${responsibleUser.email} (${responsibleUser.firstName} ${responsibleUser.lastName})`);
        responsibleUsers.push(responsibleUser);
      } else {
        console.warn(`⚠️ [CATEGORY RESPONSIBLE] Utilisateur introuvable pour responsibleId: ${responsibleData.responsibleId}`);
      }
    }
    
    return responsibleUsers;
  } catch (err) {
    console.error('Error getting category responsibles:', err);
    return [];
  }
}

