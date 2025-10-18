/**
 * Création manuelle de bénévoles par l'administrateur
 */

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './config';
import { COLLECTIONS } from './collections';
import { generatePersonalToken } from '@/lib/utils/token';

export interface CreateVolunteerData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  emailOnly?: boolean;
}

/**
 * Créer un bénévole manuellement (admin)
 * Si emailOnly = true, génère un token et envoie un mot de passe aléatoire
 * Si emailOnly = false, le bénévole devra réinitialiser son mot de passe
 */
export async function createVolunteerManually(
  data: CreateVolunteerData
): Promise<{ userId: string; token?: string; temporaryPassword?: string }> {
  try {
    // Vérifier si l'email existe déjà
    const usersRef = collection(db, COLLECTIONS.USERS);
    const q = query(usersRef, where('email', '==', data.email));
    const existingUsers = await getDocs(q);
    
    if (!existingUsers.empty) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Générer un mot de passe temporaire aléatoire
    const temporaryPassword = generateTemporaryPassword();
    
    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      temporaryPassword
    );
    
    const userId = userCredential.user.uid;
    
    // Préparer les données utilisateur
    const userData: any = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: 'volunteer',
      createdAt: new Date(),
      updatedAt: new Date(),
      consents: {
        dataProcessing: true, // Consentement implicite par l'admin
        communications: true,
        consentDate: new Date(),
      },
      notificationPreferences: {
        email: true,
        sms: false,
      },
    };

    // Si mode email-only, générer un token
    let personalToken: string | undefined;
    if (data.emailOnly) {
      personalToken = generatePersonalToken();
      userData.emailOnly = true;
      userData.personalToken = personalToken;
    }

    // Créer le document utilisateur dans Firestore
    await setDoc(doc(db, COLLECTIONS.USERS, userId), userData);

    return {
      userId,
      token: personalToken,
      temporaryPassword: data.emailOnly ? undefined : temporaryPassword,
    };
  } catch (error: any) {
    console.error('Error creating volunteer manually:', error);
    
    // Messages d'erreur personnalisés
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Un compte avec cet email existe déjà');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Adresse email invalide');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('Le mot de passe est trop faible');
    }
    
    throw new Error(error.message || 'Erreur lors de la création du bénévole');
  }
}

/**
 * Générer un mot de passe temporaire aléatoire
 * Format: 12 caractères avec majuscules, minuscules, chiffres et symboles
 */
function generateTemporaryPassword(): string {
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%&*';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  
  // Assurer au moins un caractère de chaque type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Remplir le reste
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Mélanger les caractères
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

