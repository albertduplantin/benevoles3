import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';
import { User, UserClient } from '@/types';
import { convertUserToClient } from './converters';

/**
 * Récupérer un utilisateur par ID
 */
export async function getUserById(userId: string): Promise<UserClient | null> {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    
    if (userDoc.exists()) {
      const user = userDoc.data() as User;
      return convertUserToClient(user);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Erreur lors de la récupération de l\'utilisateur');
  }
}

/**
 * Mettre à jour le profil utilisateur
 */
export async function updateUserProfile(
  userId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    photoURL?: string;
  }
): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Erreur lors de la mise à jour du profil');
  }
}

/**
 * Vérifier si le profil utilisateur est complet
 */
export function isProfileComplete(user: User | UserClient | null): boolean {
  if (!user) return false;
  
  return !!(
    user.firstName &&
    user.lastName &&
    user.phone &&
    user.email
  );
}

