import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST - Retirer un bénévole d'une mission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { missionId, userId } = body;

    if (!missionId || !userId) {
      return NextResponse.json(
        { error: 'missionId et userId requis' },
        { status: 400 }
      );
    }

    // Import dynamique pour Firebase Admin
    const { adminDb, FieldValue } = await import('@/lib/firebase/admin');
    
    console.log(`🔧 [MAINTENANCE] Retrait du bénévole ${userId} de la mission ${missionId}`);
    
    // Récupérer la mission
    const missionRef = adminDb.collection('missions').doc(missionId);
    const missionDoc = await missionRef.get();

    if (!missionDoc.exists) {
      return NextResponse.json(
        { error: 'Mission introuvable' },
        { status: 404 }
      );
    }

    // Retirer le bénévole du tableau volunteers
    await missionRef.update({
      volunteers: FieldValue.arrayRemove(userId),
      updatedAt: new Date(),
    });

    console.log(`✅ [MAINTENANCE] Bénévole ${userId} retiré avec succès`);

    return NextResponse.json({
      success: true,
      message: 'Bénévole retiré avec succès',
    });
  } catch (error: any) {
    console.error('❌ [MAINTENANCE] Erreur lors du retrait:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors du retrait' },
      { status: 500 }
    );
  }
}





