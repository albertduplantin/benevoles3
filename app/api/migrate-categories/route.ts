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

// GET - Affiche une page avec un bouton pour lancer la migration
export async function GET(request: NextRequest) {
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Migration des Catégories</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { color: #333; margin-top: 0; }
        button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 6px;
          cursor: pointer;
          width: 100%;
          margin-top: 20px;
        }
        button:hover { background: #0051cc; }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .result {
          margin-top: 20px;
          padding: 15px;
          border-radius: 6px;
          display: none;
        }
        .success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        pre {
          background: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Migration des Catégories</h1>
        <p>Cette page permet de migrer les 12 catégories de missions vers Firestore.</p>
        <p><strong>⚠️ Attention :</strong> Cette opération ne doit être effectuée qu'une seule fois !</p>
        
        <button id="migrateBtn" onclick="migrate()">
          Lancer la migration
        </button>
        
        <div id="result" class="result"></div>
      </div>

      <script>
        async function migrate() {
          const btn = document.getElementById('migrateBtn');
          const result = document.getElementById('result');
          
          btn.disabled = true;
          btn.textContent = '⏳ Migration en cours...';
          result.style.display = 'none';
          
          try {
            const response = await fetch('/api/migrate-categories', {
              method: 'POST',
            });
            
            const data = await response.json();
            
            result.style.display = 'block';
            
            if (data.success) {
              result.className = 'result success';
              result.innerHTML = \`
                <h3>✅ \${data.message}</h3>
                <pre>\${JSON.stringify(data.categories, null, 2)}</pre>
              \`;
              btn.textContent = '✅ Migration terminée';
            } else {
              result.className = 'result error';
              result.innerHTML = \`
                <h3>❌ Erreur</h3>
                <p>\${data.message || data.error}</p>
              \`;
              btn.disabled = false;
              btn.textContent = 'Réessayer';
            }
          } catch (error) {
            result.style.display = 'block';
            result.className = 'result error';
            result.innerHTML = \`
              <h3>❌ Erreur</h3>
              <p>Erreur réseau : \${error.message}</p>
            \`;
            btn.disabled = false;
            btn.textContent = 'Réessayer';
          }
        }
      </script>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

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

