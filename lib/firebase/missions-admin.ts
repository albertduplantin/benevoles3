import { adminDb } from './admin';
import { MissionClient } from '@/types';

/**
 * Récupérer une mission par ID (côté serveur)
 * À utiliser dans les API Routes
 */
export async function getMissionByIdAdmin(missionId: string): Promise<MissionClient | null> {
  try {
    const missionDoc = await adminDb.collection('missions').doc(missionId).get();
    
    if (!missionDoc.exists) {
      return null;
    }
    
    const data = missionDoc.data()!;
    
    return {
      id: missionDoc.id,
      title: data.title,
      description: data.description,
      category: data.category || '', // Catégorie (vide pour les anciennes missions)
      location: data.location,
      startDate: data.startDate?.toDate() || null,
      endDate: data.endDate?.toDate() || null,
      maxVolunteers: data.maxVolunteers,
      volunteers: data.volunteers || [],
      responsibles: data.responsibles || [],
      pendingResponsibles: data.pendingResponsibles || [],
      status: data.status,
      type: data.type,
      isUrgent: data.isUrgent || false,
      isRecurrent: data.isRecurrent || false,
      createdBy: data.createdBy,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || null,
    };
  } catch (error) {
    console.error('Error getting mission (admin):', error);
    throw new Error('Erreur lors de la récupération de la mission');
  }
}

