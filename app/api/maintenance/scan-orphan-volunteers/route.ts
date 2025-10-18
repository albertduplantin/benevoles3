import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Scanner les bénévoles avec des inscriptions orphelines
export async function GET(request: NextRequest) {
  try {
    // Import dynamique pour Firebase Admin
    const { adminDb } = await import('@/lib/firebase/admin');
    
    console.log('🔍 [MAINTENANCE] Début du scan des bénévoles orphelins...');
    
    // Récupérer toutes les missions
    const missionsSnapshot = await adminDb.collection('missions').get();
    
    const orphans: Array<{
      userId: string;
      userName: string;
      userEmail: string;
      missions: Array<{
        missionId: string;
        missionTitle: string;
        missionCategory: string;
      }>;
    }> = [];

    // Map pour regrouper par utilisateur
    const userMissionsMap = new Map<string, Array<{
      missionId: string;
      missionTitle: string;
      missionCategory: string;
    }>>();

    // Parcourir toutes les missions et leurs bénévoles
    for (const missionDoc of missionsSnapshot.docs) {
      const missionData = missionDoc.data();
      const volunteers = missionData.volunteers || [];

      for (const volunteerId of volunteers) {
        if (!userMissionsMap.has(volunteerId)) {
          userMissionsMap.set(volunteerId, []);
        }
        
        userMissionsMap.get(volunteerId)!.push({
          missionId: missionDoc.id,
          missionTitle: missionData.title || 'Sans titre',
          missionCategory: missionData.category || 'Sans catégorie',
        });
      }
    }

    console.log(`🔍 [MAINTENANCE] ${userMissionsMap.size} utilisateurs trouvés dans les missions`);

    // Pour chaque utilisateur, récupérer ses infos
    for (const [userId, missions] of userMissionsMap.entries()) {
      try {
        const userDoc = await adminDb.collection('users').doc(userId).get();
        
        if (userDoc.exists) {
          const userData = userDoc.data();
          orphans.push({
            userId,
            userName: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'Utilisateur inconnu',
            userEmail: userData?.email || 'Email inconnu',
            missions,
          });
        } else {
          // Utilisateur supprimé mais toujours dans les missions
          orphans.push({
            userId,
            userName: '⚠️ Utilisateur supprimé',
            userEmail: 'Compte supprimé',
            missions,
          });
        }
      } catch (error) {
        console.error(`Erreur pour l'utilisateur ${userId}:`, error);
      }
    }

    console.log(`🔍 [MAINTENANCE] ${orphans.length} bénévoles avec inscriptions détectés`);

    return NextResponse.json({
      success: true,
      orphans,
      scannedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ [MAINTENANCE] Erreur lors du scan:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors du scan' },
      { status: 500 }
    );
  }
}


