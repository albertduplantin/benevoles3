import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ADMIN_UID = 'gZU8ccHVwjVBnnDa5rKnLAISoBh2';

const categories = [
  // Accueil public et professionnels
  { value: 'accueil_public_pro', label: 'Accueil public et professionnels', group: 'Accueil public et professionnels', order: 1 },
  { value: 'accreditations', label: 'Accréditations (outil)', group: 'Accueil public et professionnels', order: 2 },
  { value: 'accueil_vip', label: 'Accueil VIP', group: 'Accueil public et professionnels', order: 3 },
  
  // Gestion & logistique
  { value: 'billetterie_vente', label: 'Billetterie / vente', group: 'Gestion & logistique', order: 1 },
  { value: 'controle_acces', label: "Contrôle d'accès", group: 'Gestion & logistique', order: 2 },
  { value: 'transports_accompagnement', label: 'Transports & accompagnement', group: 'Gestion & logistique', order: 3 },
  { value: 'logistique_technique', label: 'Logistique & technique', group: 'Gestion & logistique', order: 4 },
  
  // Communication
  { value: 'communication_reseaux', label: 'Communication & réseaux sociaux', group: 'Communication', order: 1 },
  { value: 'developpement_publics', label: 'Développement des publics', group: 'Communication', order: 2 },
  { value: 'volet_professionnel', label: 'Volet professionnel', group: 'Communication', order: 3 },
  { value: 'affichage_flyers', label: 'Affichage / flyers', group: 'Communication', order: 4 },
  
  // Bar & restauration
  { value: 'bar_restauration_generale', label: 'Bar / Restauration générale', group: 'Bar & restauration', order: 1 },
  { value: 'samedi_soir_restauration', label: 'Samedi soir : coordination restauration', group: 'Bar & restauration', order: 2 },
];

export async function POST(request: NextRequest) {
  try {
    // Import dynamique pour éviter l'exécution pendant le build
    const { adminDb } = await import('@/lib/firebase/admin');
    
    const categoriesRef = adminDb.collection('missionCategories');
    
    // Vérifier si des catégories existent déjà
    const existingSnapshot = await categoriesRef.limit(1).get();
    if (!existingSnapshot.empty) {
      return NextResponse.json({
        success: false,
        message: 'Des catégories existent déjà. Migration annulée pour éviter les doublons.',
      }, { status: 400 });
    }
    
    const results = [];
    
    for (const category of categories) {
      const docRef = await categoriesRef.add({
        value: category.value,
        label: category.label,
        group: category.group,
        order: category.order,
        active: true,
        createdAt: new Date(),
        createdBy: ADMIN_UID,
      });
      
      results.push({
        id: docRef.id,
        label: category.label,
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `${results.length} catégories migrées avec succès`,
      categories: results,
    });
  } catch (error: any) {
    console.error('Error migrating categories:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erreur lors de la migration',
    }, { status: 500 });
  }
}

