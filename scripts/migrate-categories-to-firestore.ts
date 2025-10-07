/**
 * Script de migration pour déplacer les catégories hardcodées vers Firestore
 * À exécuter une seule fois
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Configuration Firebase (à adapter selon ton .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ADMIN_UID = 'gZU8ccHVwjVBnnDa5rKnLAISoBh2';

const categories = [
  // Accueil public et professionnels
  {
    value: 'accueil_public_pro',
    label: 'Accueil public et professionnels',
    group: 'Accueil public et professionnels',
    order: 1,
  },
  {
    value: 'accreditations',
    label: 'Accréditations (outil)',
    group: 'Accueil public et professionnels',
    order: 2,
  },
  {
    value: 'accueil_vip',
    label: 'Accueil VIP',
    group: 'Accueil public et professionnels',
    order: 3,
  },
  
  // Gestion & logistique
  {
    value: 'billetterie_vente',
    label: 'Billetterie / vente',
    group: 'Gestion & logistique',
    order: 1,
  },
  {
    value: 'controle_acces',
    label: "Contrôle d'accès",
    group: 'Gestion & logistique',
    order: 2,
  },
  {
    value: 'transports_accompagnement',
    label: 'Transports & accompagnement',
    group: 'Gestion & logistique',
    order: 3,
  },
  {
    value: 'logistique_technique',
    label: 'Logistique & technique',
    group: 'Gestion & logistique',
    order: 4,
  },
  
  // Communication
  {
    value: 'communication_reseaux',
    label: 'Communication & réseaux sociaux',
    group: 'Communication',
    order: 1,
  },
  {
    value: 'developpement_publics',
    label: 'Développement des publics',
    group: 'Communication',
    order: 2,
  },
  {
    value: 'volet_professionnel',
    label: 'Volet professionnel',
    group: 'Communication',
    order: 3,
  },
  {
    value: 'affichage_flyers',
    label: 'Affichage / flyers',
    group: 'Communication',
    order: 4,
  },
  
  // Bar & restauration
  {
    value: 'bar_restauration_generale',
    label: 'Bar / Restauration générale',
    group: 'Bar & restauration',
    order: 1,
  },
  {
    value: 'samedi_soir_restauration',
    label: 'Samedi soir : coordination restauration',
    group: 'Bar & restauration',
    order: 2,
  },
];

async function migrateCategories() {
  console.log('🚀 Début de la migration des catégories...');
  
  try {
    for (const category of categories) {
      const docRef = await addDoc(collection(db, 'missionCategories'), {
        value: category.value,
        label: category.label,
        group: category.group,
        order: category.order,
        active: true,
        createdBy: ADMIN_UID,
      });
      
      console.log(`✅ Catégorie "${category.label}" migrée (ID: ${docRef.id})`);
    }
    
    console.log('\n🎉 Migration terminée avec succès !');
    console.log(`📊 ${categories.length} catégories migrées`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    console.error('Détails:', error);
    process.exit(1);
  }
}

migrateCategories();

