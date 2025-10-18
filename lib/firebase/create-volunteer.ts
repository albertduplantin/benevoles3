/**
 * Création manuelle de bénévoles par l'administrateur
 * Utilise l'API route pour ne pas déconnecter l'admin
 */

import { auth } from './config';

export interface CreateVolunteerData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  emailOnly?: boolean;
}

/**
 * Créer un bénévole manuellement (admin)
 * Appelle l'API route qui utilise Firebase Admin SDK
 */
export async function createVolunteerManually(
  data: CreateVolunteerData
): Promise<{ userId: string; token?: string; temporaryPassword?: string }> {
  try {
    // Récupérer le token de l'admin connecté
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Vous devez être connecté');
    }

    const idToken = await currentUser.getIdToken();

    // Appeler l'API route
    const response = await fetch('/api/create-volunteer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erreur lors de la création du bénévole');
    }

    return {
      userId: result.userId,
      token: result.token,
      temporaryPassword: result.temporaryPassword,
    };
  } catch (error: any) {
    console.error('Error creating volunteer manually:', error);
    throw new Error(error.message || 'Erreur lors de la création du bénévole');
  }
}

