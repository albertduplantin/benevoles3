import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering (pas de pré-rendering au build)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Obtenir tous les responsables de catégories + liste des bénévoles
export async function GET(request: NextRequest) {
  try {
    // Import dynamique pour éviter l'exécution pendant le build
    const { getAllCategoryResponsibles } = await import('@/lib/firebase/category-responsibles');
    const { getAllVolunteersAdmin } = await import('@/lib/firebase/users-admin');
    
    const [assignments, users] = await Promise.all([
      getAllCategoryResponsibles(),
      getAllVolunteersAdmin(),
    ]);

    console.log('📊 API - Total users:', users?.length || 0);
    
    // Filtrer les utilisateurs (seulement bénévoles et responsables)
    const volunteers = users.filter(
      u => u.role === 'volunteer' || u.role === 'category_responsible'
    );

    console.log('👥 API - Volunteers filtered:', volunteers?.length || 0);
    console.log('📋 API - Assignments:', assignments?.length || 0);

    return NextResponse.json({
      assignments: assignments || [],
      volunteers: volunteers || [],
    });
  } catch (error: any) {
    console.error('Error fetching category responsibles:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching data' },
      { status: 500 }
    );
  }
}

// POST - Assigner un responsable
export async function POST(request: NextRequest) {
  try {
    const { assignCategoryResponsible } = await import('@/lib/firebase/category-responsibles');
    
    const body = await request.json();
    const { categoryId, categoryLabel, responsibleId, adminId } = body;

    if (!categoryId || !categoryLabel || !responsibleId || !adminId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const id = await assignCategoryResponsible(
      categoryId,
      categoryLabel,
      responsibleId,
      adminId
    );

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Error assigning responsible:', error);
    return NextResponse.json(
      { error: error.message || 'Error assigning responsible' },
      { status: 500 }
    );
  }
}

// DELETE - Retirer un responsable
export async function DELETE(request: NextRequest) {
  try {
    const { removeCategoryResponsible } = await import('@/lib/firebase/category-responsibles');
    
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Missing categoryId' },
        { status: 400 }
      );
    }

    await removeCategoryResponsible(categoryId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error removing responsible:', error);
    return NextResponse.json(
      { error: error.message || 'Error removing responsible' },
      { status: 500 }
    );
  }
}

