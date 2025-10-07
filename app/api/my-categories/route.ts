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

    // Import dynamique pour éviter le bundle côté client
    const { getUserResponsibleCategories } = await import('@/lib/firebase/category-responsibles');
    
    const categories = await getUserResponsibleCategories(userId);

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Error fetching user categories:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching categories' },
      { status: 500 }
    );
  }
}

