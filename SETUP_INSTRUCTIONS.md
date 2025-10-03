# 📋 Instructions de Configuration - Étape par Étape

## 🔥 Configuration Firebase (À FAIRE MAINTENANT)

### 1. Créer le Projet Firebase

1. Allez sur [console.firebase.google.com](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nom du projet : `festival-films-courts-dinan` (ou votre choix)
4. Désactivez Google Analytics (optionnel pour ce projet)
5. Cliquez sur "Créer le projet"

### 2. Configurer l'Authentication

1. Dans le menu latéral, cliquez sur **Authentication**
2. Cliquez sur "Get started"
3. Activez les méthodes de connexion :
   - **Email/Password** : activez-le
   - **Google** : activez-le (configurez le nom public et l'email de support)

### 3. Configurer Firestore Database

1. Dans le menu latéral, cliquez sur **Firestore Database**
2. Cliquez sur "Créer une base de données"
3. Choisissez **"Démarrer en mode production"**
4. Sélectionnez une région proche (ex: `europe-west1` pour la France)
5. Cliquez sur "Activer"

### 4. Configurer Storage

1. Dans le menu latéral, cliquez sur **Storage**
2. Cliquez sur "Get started"
3. Utilisez les règles de sécurité par défaut
4. Choisissez la même région que Firestore
5. Cliquez sur "Terminé"

### 5. Obtenir les Clés de Configuration Web

1. Dans le menu latéral, cliquez sur l'**icône engrenage** ⚙️ > "Paramètres du projet"
2. Descendez jusqu'à "Vos applications"
3. Cliquez sur l'icône **Web** `</>`
4. Nom de l'app : `festival-benevoles-web`
5. **NE cochez PAS** Firebase Hosting
6. Cliquez sur "Enregistrer l'application"
7. **COPIEZ** le bloc de configuration qui apparaît :

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

8. **Collez ces valeurs** dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-projet
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 6. Obtenir les Clés Admin SDK (pour le serveur)

1. Toujours dans "Paramètres du projet"
2. Allez dans l'onglet **"Comptes de service"**
3. Cliquez sur **"Générer une nouvelle clé privée"**
4. Cliquez sur "Générer la clé"
5. Un fichier JSON sera téléchargé

6. **Ouvrez ce fichier JSON** et trouvez ces valeurs :
   - `project_id`
   - `client_email`
   - `private_key`

7. **Ajoutez-les dans `.env.local`** :

```env
FIREBASE_ADMIN_PROJECT_ID=votre-projet
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@votre-projet.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVOTRE_CLE\n-----END PRIVATE KEY-----\n"
```

⚠️ **IMPORTANT** : La clé privée doit être entourée de guillemets doubles et les `\n` doivent être conservés.

### 7. Configurer les Règles de Sécurité Firestore

1. Dans Firestore Database, allez dans l'onglet **"Règles"**
2. Remplacez le contenu par les règles fournies dans le README.md
3. Cliquez sur **"Publier"**

### 8. Configurer les Règles de Sécurité Storage

1. Dans Storage, allez dans l'onglet **"Règles"**
2. Remplacez par ces règles :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{fileName} {
      // Allow authenticated users to upload their own avatar
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 2 * 1024 * 1024 // 2MB max
                   && request.resource.contentType.matches('image/.*');
      
      // Allow anyone to read avatars
      allow read: if true;
    }
  }
}
```

3. Cliquez sur **"Publier"**

## 🚀 Configuration GitHub (Optionnel mais recommandé)

### Créer un nouveau repository

```bash
# Dans le dossier du projet
git init
git add .
git commit -m "feat: initial project setup - Phase 0 complete"

# Créez un repo sur GitHub, puis :
git remote add origin https://github.com/votre-username/festival-benevoles.git
git branch -M main
git push -u origin main
```

## ☁️ Configuration Vercel (Pour le déploiement)

### 1. Connecter le Repository

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Add New Project"
3. Importez votre repository GitHub
4. Configurez le projet :
   - **Framework Preset** : Next.js
   - **Root Directory** : `./`
   - **Build Command** : `npm run build`

### 2. Ajouter les Variables d'Environnement

Dans les paramètres du projet Vercel, ajoutez TOUTES les variables de votre `.env.local` :

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `NEXT_PUBLIC_APP_URL` (mettez votre URL Vercel, ex: `https://festival-benevoles.vercel.app`)

### 3. Déployer

Cliquez sur "Deploy" !

### 4. Mettre à Jour Firebase

1. Retournez dans Firebase Console > Authentication > Settings
2. Dans "Authorized domains", ajoutez votre domaine Vercel
3. Dans Firebase Console > Project Settings, ajoutez aussi votre domaine Vercel

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. **Localement** :
```bash
npm run dev
```

2. Ouvrez [http://localhost:3000](http://localhost:3000)

3. **Vérifiez la console** : il ne doit pas y avoir d'erreurs Firebase

4. **Prochaine étape** : Phase 1 - Créer les pages d'authentification

## 🆘 Problèmes Courants

### "Firebase: Error (auth/invalid-api-key)"
➡️ Vérifiez que `NEXT_PUBLIC_FIREBASE_API_KEY` est correct dans `.env.local`

### "Firebase: Error (auth/project-not-found)"
➡️ Vérifiez `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

### "PrismaClient is not configured"
➡️ Ce projet n'utilise PAS Prisma, ignorez cette erreur si elle apparaît

### Les variables d'environnement ne sont pas chargées
➡️ Redémarrez le serveur de développement (`npm run dev`)

### Erreur avec FIREBASE_ADMIN_PRIVATE_KEY
➡️ Assurez-vous que la clé est entre guillemets et que les `\n` sont conservés

---

🎉 **Une fois cette configuration terminée, vous êtes prêt pour la Phase 1 !**

