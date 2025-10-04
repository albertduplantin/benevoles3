/**
 * Script pour créer des missions de test pour le beta test
 * Usage: npx tsx scripts/create-test-missions.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Configuration Firebase (à adapter avec vos credentials)
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

// Missions de test
const testMissions = [
  {
    title: "Accueil du public - Soirée d'ouverture",
    description: "Accueillir les festivaliers à l'entrée du théâtre, distribuer les programmes et orienter le public vers les différentes salles. Un sourire et une bonne connaissance du lieu sont vos meilleurs atouts !",
    type: 'scheduled' as const,
    startDate: new Date('2025-11-19T18:00:00'),
    endDate: new Date('2025-11-19T22:00:00'),
    location: 'Théâtre des Jacobins',
    maxVolunteers: 5,
    volunteers: [],
    responsibles: [],
    pendingResponsibles: [],
    status: 'published' as const,
    isUrgent: true,
    isRecurrent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Gestion projection - Compétition internationale",
    description: "Assurer le bon déroulement de la projection : accueil en salle, présentation du court-métrage, gestion des questions-réponses avec le réalisateur. Idéal pour les cinéphiles !",
    type: 'scheduled' as const,
    startDate: new Date('2025-11-20T14:00:00'),
    endDate: new Date('2025-11-20T17:00:00'),
    location: 'Cinéma Le Club',
    maxVolunteers: 3,
    volunteers: [],
    responsibles: [],
    pendingResponsibles: [],
    status: 'published' as const,
    isUrgent: false,
    isRecurrent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Service bar - Soirée de clôture",
    description: "Servir les boissons au bar du festival pendant la soirée de clôture. Ambiance festive garantie ! Expérience en service bienvenue mais pas obligatoire.",
    type: 'scheduled' as const,
    startDate: new Date('2025-11-23T20:00:00'),
    endDate: new Date('2025-11-24T00:00:00'),
    location: 'Bar du Festival - Salle des fêtes',
    maxVolunteers: 8,
    volunteers: [],
    responsibles: [],
    pendingResponsibles: [],
    status: 'published' as const,
    isUrgent: false,
    isRecurrent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Installation matériel - Préparation festival",
    description: "Aider à l'installation du matériel (scène, son, lumières, signalétique) avant le début du festival. Bras musclés bienvenus ! Travail en équipe dans une bonne ambiance.",
    type: 'scheduled' as const,
    startDate: new Date('2025-11-18T09:00:00'),
    endDate: new Date('2025-11-18T13:00:00'),
    location: 'Entrepôt municipal - Zone technique',
    maxVolunteers: 10,
    volunteers: [],
    responsibles: [],
    pendingResponsibles: [],
    status: 'published' as const,
    isUrgent: true,
    isRecurrent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Réseaux sociaux - Couverture live du festival",
    description: "Assurer la couverture du festival sur les réseaux sociaux : photos, vidéos, stories Instagram/Facebook, interactions avec la communauté. Smartphone et créativité requis !",
    type: 'scheduled' as const,
    startDate: new Date('2025-11-21T10:00:00'),
    endDate: new Date('2025-11-21T18:00:00'),
    location: 'Bureau du festival - Maison des associations',
    maxVolunteers: 2,
    volunteers: [],
    responsibles: [],
    pendingResponsibles: [],
    status: 'published' as const,
    isUrgent: false,
    isRecurrent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Billetterie et contrôle d'accès",
    description: "Gérer la billetterie, scanner les QR codes, contrôler les accès et renseigner les festivaliers. Rigueur et sens du contact indispensables.",
    type: 'scheduled' as const,
    startDate: new Date('2025-11-20T17:30:00'),
    endDate: new Date('2025-11-20T22:00:00'),
    location: 'Hall d\'entrée - Théâtre des Jacobins',
    maxVolunteers: 4,
    volunteers: [],
    responsibles: [],
    pendingResponsibles: [],
    status: 'published' as const,
    isUrgent: false,
    isRecurrent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function createTestMissions() {
  console.log('🎬 Création des missions de test...\n');

  try {
    for (const mission of testMissions) {
      // Convertir les dates en Timestamp Firestore
      const missionData = {
        ...mission,
        startDate: Timestamp.fromDate(mission.startDate),
        endDate: Timestamp.fromDate(mission.endDate),
        createdAt: Timestamp.fromDate(mission.createdAt),
        updatedAt: Timestamp.fromDate(mission.updatedAt),
      };

      const docRef = await addDoc(collection(db, 'missions'), missionData);
      
      console.log(`✅ Mission créée : ${mission.title}`);
      console.log(`   ID: ${docRef.id}`);
      console.log(`   Date: ${mission.startDate.toLocaleDateString('fr-FR')}`);
      console.log(`   Lieu: ${mission.location}`);
      console.log(`   Places: ${mission.maxVolunteers}`);
      console.log(`   Urgent: ${mission.isUrgent ? 'OUI' : 'Non'}`);
      console.log('');
    }

    console.log('🎉 Toutes les missions de test ont été créées avec succès !');
    console.log(`\n📊 Statistiques :`);
    console.log(`   Total missions : ${testMissions.length}`);
    console.log(`   Missions urgentes : ${testMissions.filter(m => m.isUrgent).length}`);
    console.log(`   Total places : ${testMissions.reduce((sum, m) => sum + m.maxVolunteers, 0)}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des missions :', error);
    process.exit(1);
  }
}

createTestMissions();

