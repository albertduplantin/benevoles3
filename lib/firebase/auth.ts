import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { COLLECTIONS } from './collections';
import { UserRole } from '@/types';

/**
 * Inscription avec email et mot de passe
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string,
  consentDataProcessing: boolean,
  consentCommunications: boolean
): Promise<FirebaseUser> {
  try {
    // Créer l'utilisateur Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Mettre à jour le displayName
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Créer le document utilisateur dans Firestore
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
      uid: user.uid,
      email: user.email,
      firstName,
      lastName,
      phone,
      photoURL: null,
      role: 'volunteer' as UserRole,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      consents: {
        dataProcessing: consentDataProcessing,
        communications: consentCommunications,
        consentDate: serverTimestamp(),
      },
      notificationPreferences: {
        email: true,
        sms: consentCommunications,
      },
    });

    return user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Connexion avec email et mot de passe
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<FirebaseUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Connexion avec Google
 */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Vérifier si l'utilisateur existe déjà dans Firestore
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));

    if (!userDoc.exists()) {
      // Créer le document utilisateur pour les nouveaux utilisateurs Google
      const displayNameParts = user.displayName?.split(' ') || ['', ''];
      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: displayNameParts[0] || '',
        lastName: displayNameParts.slice(1).join(' ') || '',
        // Laisser une chaîne vide si pas de téléphone
        // isProfileComplete() détectera maintenant les chaînes vides et retournera false
        phone: user.phoneNumber || '',
        photoURL: user.photoURL,
        role: 'volunteer' as UserRole,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        consents: {
          dataProcessing: true,
          communications: false,
          consentDate: serverTimestamp(),
        },
        notificationPreferences: {
          email: true,
          sms: false,
        },
      });
    }

    return user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Déconnexion
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error('Erreur lors de la déconnexion');
  }
}

/**
 * Réinitialisation du mot de passe
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error resetting password:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Traduire les codes d'erreur Firebase en messages français
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Cette adresse email est déjà utilisée.';
    case 'auth/invalid-email':
      return 'Adresse email invalide.';
    case 'auth/operation-not-allowed':
      return 'Opération non autorisée.';
    case 'auth/weak-password':
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé.';
    case 'auth/user-not-found':
      return 'Aucun compte ne correspond à cette adresse email.';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect.';
    case 'auth/invalid-credential':
      return 'Identifiants invalides.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Veuillez réessayer plus tard.';
    case 'auth/network-request-failed':
      return 'Erreur réseau. Vérifiez votre connexion internet.';
    case 'auth/popup-closed-by-user':
      return 'La fenêtre de connexion a été fermée.';
    default:
      return 'Une erreur est survenue lors de l\'authentification.';
  }
}

