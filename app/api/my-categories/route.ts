import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Obtenir les catégories dont l'utilisateur est responsable
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Import dynamique pour Firebase Admin
    const { adminDb } = await import('@/lib/firebase/admin');
    
    console.log('🔍 Fetching categories for user:', userId);
    
    // Récupérer les catégories dont l'utilisateur est responsable (sans orderBy pour éviter l'index composé)
    const snapshot = await adminDb
      .collection('categoryResponsibles')
      .where('responsibleId', '==', userId)
      .get();

    console.log('📦 Snapshot size:', snapshot.size);

    const categories = snapshot.docs.map((doc) => {
      const data = doc.data();
      console.log('📋 Category data:', data);
      return {
        id: doc.id,
        categoryId: data.categoryId,
        categoryLabel: data.categoryLabel,
        responsibleId: data.responsibleId,
        assignedBy: data.assignedBy,
        assignedAt: data.assignedAt?.toDate() || new Date(),
      };
    });

    // Tri côté serveur par label
    categories.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel));

    console.log('📋 Categories found for user:', userId, categories.length);

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Error fetching user categories:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching categories' },
      { status: 500 }
    );
  }
}

