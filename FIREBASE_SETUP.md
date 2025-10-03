# 🔥 Configuration Firebase - Guide Rapide

## Étapes à Suivre MAINTENANT

### 1. Créer le Projet Firebase (5 minutes)

1. Allez sur https://console.firebase.google.com/
2. Cliquez sur "Ajouter un projet"
3. Nom: `festival-films-courts-dinan`
4. Désactivez Google Analytics (optionnel)
5. Créez le projet

### 2. Activer Authentication (2 minutes)

1. Menu latéral > **Authentication**
2. Cliquez "Get started"
3. **Sign-in method** :
   - Activez **Email/Password**
   - Activez **Google** (configurez nom et email)

### 3. Créer Firestore Database (2 minutes)

1. Menu latéral > **Firestore Database**
2. "Créer une base de données"
3. **Mode production** (on ajoutera les règles après)
4. Région : **europe-west1** (Belgique) ou **europe-west9** (Paris)

### 4. Activer Storage (1 minute)

1. Menu latéral > **Storage**
2. "Get started"
3. Mode production
4. Même région que Firestore

### 5. Obtenir les Clés Web (3 minutes)

1. **Paramètres du projet** (icône ⚙️) > "Paramètres du projet"
2. Descendez à "Vos applications"
3. Cliquez sur l'icône **Web** `</>`
4. Nom : `festival-benevoles-web`
5. **NE cochez PAS** Hosting
6. Cliquez "Enregistrer l'application"

**COPIEZ** ces valeurs dans `.env.local` :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-projet
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 6. Obtenir les Clés Admin (3 minutes)

1. Toujours dans "Paramètres du projet"
2. Onglet **"Comptes de service"**
3. Cliquez **"Générer une nouvelle clé privée"**
4. Un fichier JSON sera téléchargé

Ouvrez le JSON et trouvez :
- `project_id`
- `client_email`
- `private_key`

Ajoutez dans `.env.local` :

```env
FIREBASE_ADMIN_PROJECT_ID=votre-projet
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@votre-projet.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVOTRE_CLE\n-----END PRIVATE KEY-----\n"
```

⚠️ **La clé privée doit être entre guillemets et conserver les `\n`**

### 7. Configurer les Règles de Sécurité (5 minutes)

#### Firestore Rules

1. Firestore Database > onglet **Règles**
2. Copiez-collez :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isResponsible() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['mission_responsible', 'admin'];
    }
    
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    match /missions/{missionId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update: if isAdmin() || (isResponsible() && request.auth.uid in resource.data.responsibles);
      allow delete: if isAdmin();
    }
    
    match /volunteerRequests/{requestId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
  }
}
```

3. Cliquez **Publier**

#### Storage Rules

1. Storage > onglet **Règles**
2. Copiez-collez :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{fileName} {
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 2 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow read: if true;
    }
  }
}
```

3. Cliquez **Publier**

### 8. Créer le Premier Utilisateur Admin (Phase 1)

Une fois l'authentification développée (Phase 1), vous devrez :

1. Créer un compte via l'interface
2. Aller dans Firestore Database
3. Collection `users` > votre document utilisateur
4. Modifier le champ `role` : mettre `admin`

## ✅ Vérification

Pour vérifier que tout fonctionne :

```bash
npm run dev
```

Ouvrez http://localhost:3000

- Pas d'erreurs Firebase dans la console = ✅
- Si erreurs, vérifiez les clés dans `.env.local`

## 🚨 Sécurité

**NE JAMAIS COMMIT** :
- `.env.local`
- Le fichier JSON des clés admin
- Les clés API dans le code

Le `.gitignore` est configuré pour éviter ça.

## 📊 Indexes Firestore (À créer plus tard)

Vous recevrez des erreurs demandant de créer des indexes quand vous ferez des queries complexes. Firebase vous donnera le lien direct pour les créer automatiquement.

Indexes anticipés nécessaires :
- `missions` : `status` (ASC) + `isUrgent` (DESC) + `createdAt` (DESC)
- `missions` : `status` (ASC) + `startDate` (ASC)
- `volunteerRequests` : `status` (ASC) + `requestedAt` (DESC)

## 📝 Notes

- **Budget** : Firestore gratuit jusqu'à 50k reads/day, 20k writes/day
- **Région** : Choisissez toujours la même pour tous les services
- **Backups** : Configurez des exports automatiques en production (Project Settings > Backups)

---

Une fois cette configuration terminée, vous êtes prêt pour la **Phase 1** ! 🚀

