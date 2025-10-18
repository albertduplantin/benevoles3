/**
 * Script de migration : Ajouter une catégorie par défaut aux missions existantes
 * 
 * Usage: npx tsx scripts/migrate-add-categories.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

// Charger les credentials
const serviceAccountPath = path.join(process.cwd(), 'benevoles3-a85b4-firebase-adminsdk-fbsvc-675562f571.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Fichier de credentials Firebase Admin introuvable!');
  console.error('   Chemin attendu:', serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialiser Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  });
}

const db = getFirestore();

async function migrateMissions() {
  console.log('🚀 Démarrage de la migration...\n');

  try {
    // Récupérer toutes les missions
    const missionsSnapshot = await db.collection('missions').get();
    
    if (missionsSnapshot.empty) {
      console.log('ℹ️  Aucune mission trouvée dans la base de données.');
      return;
    }

    console.log(`📊 ${missionsSnapshot.size} mission(s) trouvée(s)\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Traiter chaque mission
    for (const doc of missionsSnapshot.docs) {
      const data = doc.data();
      
      // Si la mission a déjà une catégorie, la sauter
      if (data.category && data.category !== '') {
        console.log(`⏭️  Mission "${data.title}" - Déjà catégorisée: ${data.category}`);
        skippedCount++;
        continue;
      }

      // Attribuer une catégorie par défaut basée sur le titre ou description
      let category = 'Gestion & logistique'; // Catégorie par défaut

      const titleLower = (data.title || '').toLowerCase();
      const descLower = (data.description || '').toLowerCase();

      // Détection intelligente de la catégorie
      if (titleLower.includes('accueil') || titleLower.includes('vip') || titleLower.includes('accréditation')) {
        if (titleLower.includes('accréditation') || titleLower.includes('outil')) {
          category = 'Accréditations (outil)';
        } else if (titleLower.includes('vip')) {
          category = 'Accueil VIP';
        } else {
          category = 'Accréditations (outil)';
        }
      } else if (titleLower.includes('billetterie') || titleLower.includes('vente')) {
        category = 'Billetterie / vente';
      } else if (titleLower.includes('contrôle') || titleLower.includes('accès')) {
        category = "Contrôle d'accès";
      } else if (titleLower.includes('transport')) {
        category = 'Transports & accompagnement';
      } else if (titleLower.includes('logistique') || titleLower.includes('technique') || titleLower.includes('matériel') || titleLower.includes('installation')) {
        category = 'Logistique & technique';
      } else if (titleLower.includes('communication') || titleLower.includes('réseaux') || titleLower.includes('social')) {
        category = 'Communication & réseaux sociaux';
      } else if (titleLower.includes('public') || titleLower.includes('développement')) {
        category = 'Développement des publics';
      } else if (titleLower.includes('professionnel')) {
        category = 'Volet professionnel';
      } else if (titleLower.includes('affichage') || titleLower.includes('flyer')) {
        category = 'Affichage / flyers';
      } else if (titleLower.includes('bar') || titleLower.includes('restauration')) {
        if (titleLower.includes('samedi') || titleLower.includes('coordination')) {
          category = 'Samedi soir : coordination restauration';
        } else {
          category = 'Bar / Restauration générale';
        }
      } else if (titleLower.includes('projection') || titleLower.includes('gestion')) {
        category = "Contrôle d'accès";
      }

      // Mettre à jour la mission
      await doc.ref.update({
        category: category,
        updatedAt: new Date(),
      });

      console.log(`✅ Mission "${data.title}" → Catégorie: "${category}"`);
      updatedCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 Résumé de la migration :');
    console.log(`   ✅ ${updatedCount} mission(s) mise(s) à jour`);
    console.log(`   ⏭️  ${skippedCount} mission(s) déjà catégorisée(s)`);
    console.log(`   📊 Total : ${missionsSnapshot.size} mission(s)`);
    console.log('='.repeat(60));
    console.log('\n✨ Migration terminée avec succès !');

  } catch (error) {
    console.error('\n❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration
migrateMissions()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });






