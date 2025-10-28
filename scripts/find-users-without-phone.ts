/**
 * Script pour identifier les utilisateurs sans numéro de téléphone
 * 
 * Ce script liste tous les utilisateurs qui ont :
 * - Un champ phone vide (chaîne vide)
 * - Un champ phone manquant
 * 
 * Usage:
 * npx tsx scripts/find-users-without-phone.ts
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

// Initialiser Firebase Admin
const serviceAccountPath = path.join(process.cwd(), 'benevoles3-a85b4-firebase-adminsdk-fbsvc-675562f571.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Fichier de configuration Firebase introuvable:', serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

interface UserData {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  createdAt: any;
}

async function findUsersWithoutPhone() {
  console.log('🔍 Recherche des utilisateurs sans numéro de téléphone...\n');

  try {
    const usersSnapshot = await db.collection('users').get();
    
    const usersWithoutPhone: UserData[] = [];
    const usersWithEmptyPhone: UserData[] = [];
    const totalUsers = usersSnapshot.size;

    usersSnapshot.forEach((doc) => {
      const userData = doc.data() as UserData;
      
      // Vérifier si le téléphone est manquant ou vide
      if (!userData.phone) {
        usersWithoutPhone.push(userData);
      } else if (userData.phone.trim() === '') {
        usersWithEmptyPhone.push(userData);
      }
    });

    // Afficher les résultats
    console.log('📊 RÉSULTATS\n');
    console.log(`Total d'utilisateurs : ${totalUsers}`);
    console.log(`Utilisateurs sans téléphone : ${usersWithoutPhone.length + usersWithEmptyPhone.length}\n`);

    if (usersWithoutPhone.length > 0) {
      console.log('❌ Utilisateurs avec champ "phone" manquant :');
      console.log('─'.repeat(80));
      usersWithoutPhone.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   UID: ${user.uid}`);
        console.log(`   Rôle: ${user.role}`);
        console.log(`   Téléphone: [MANQUANT]`);
        console.log('');
      });
    }

    if (usersWithEmptyPhone.length > 0) {
      console.log('⚠️  Utilisateurs avec champ "phone" vide (chaîne vide) :');
      console.log('─'.repeat(80));
      usersWithEmptyPhone.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   UID: ${user.uid}`);
        console.log(`   Rôle: ${user.role}`);
        console.log(`   Téléphone: [VIDE]`);
        console.log('');
      });
    }

    if (usersWithoutPhone.length === 0 && usersWithEmptyPhone.length === 0) {
      console.log('✅ Tous les utilisateurs ont un numéro de téléphone valide !');
    } else {
      console.log('\n💡 RECOMMANDATIONS\n');
      console.log('Ces utilisateurs devront compléter leur profil à leur prochaine connexion.');
      console.log('Le système les redirigera automatiquement vers /auth/complete-profile.');
      console.log('\nVous pouvez également les contacter par email pour leur demander de :');
      console.log('1. Se connecter à l\'application');
      console.log('2. Compléter leur numéro de téléphone');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error);
    process.exit(1);
  }
}

// Exécuter le script
findUsersWithoutPhone()
  .then(() => {
    console.log('\n✅ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });







