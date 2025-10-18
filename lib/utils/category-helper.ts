/**
 * Helper functions pour la gestion des catégories
 * Gère la conversion entre IDs Firestore et values textuelles
 */

import { getGroupedCategories } from '@/lib/firebase/mission-categories-db';
import { User, UserClient } from '@/types';

// Cache pour éviter de charger les catégories à chaque fois
let categoriesCache: Array<{ id: string; value: string }> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Récupérer le mapping ID -> value des catégories (avec cache)
 */
async function getCategoryMapping(): Promise<Array<{ id: string; value: string }>> {
  const now = Date.now();
  
  // Utiliser le cache si valide
  if (categoriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return categoriesCache;
  }
  
  // Charger depuis Firestore
  const grouped = await getGroupedCategories();
  categoriesCache = grouped.flatMap(g => 
    g.categories.map(cat => ({ id: cat.id, value: cat.value }))
  );
  cacheTimestamp = now;
  
  return categoriesCache;
}

/**
 * Vérifier si un utilisateur est responsable d'une catégorie
 * Gère la conversion entre IDs Firestore et values textuelles
 */
export async function isUserResponsibleForCategoryValue(
  user: User | UserClient | null,
  categoryValue: string
): Promise<boolean> {
  if (!user) return false;
  if (user.role === 'admin') return true;
  
  console.log('[CATEGORY HELPER] Checking permissions:', {
    userRole: user.role,
    userEmail: user.email,
    categoryValue,
    responsibleForCategories: user.responsibleForCategories
  });
  
  if (user.role === 'category_responsible' && user.responsibleForCategories) {
    // Charger le mapping ID -> value
    const mapping = await getCategoryMapping();
    console.log('[CATEGORY HELPER] Mapping loaded:', mapping.length, 'categories');
    
    // Convertir les IDs de l'utilisateur en values
    const userCategoryValues = user.responsibleForCategories
      .map(id => {
        const found = mapping.find(m => m.id === id);
        console.log(`[CATEGORY HELPER] ID ${id} -> value ${found?.value}`);
        return found?.value;
      })
      .filter(Boolean) as string[];
    
    console.log('[CATEGORY HELPER] User category values:', userCategoryValues);
    console.log('[CATEGORY HELPER] Looking for:', categoryValue);
    console.log('[CATEGORY HELPER] Result:', userCategoryValues.includes(categoryValue));
    
    // Vérifier si la catégorie recherchée est dans les catégories de l'utilisateur
    return userCategoryValues.includes(categoryValue);
  }
  
  console.log('[CATEGORY HELPER] User is not category_responsible or has no categories');
  return false;
}

/**
 * Invalider le cache (à appeler après création/modification de catégories)
 */
export function invalidateCategoryCache(): void {
  categoriesCache = null;
  cacheTimestamp = 0;
}

