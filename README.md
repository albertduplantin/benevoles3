# 🎬 Festival Films Courts de Dinan - Gestion des Bénévoles

Application web progressive (PWA) pour gérer les bénévoles du Festival Films Courts de Dinan (19-23 novembre 2025).

## 🚀 Stack Technique

- **Frontend**: Next.js 14+ (App Router) avec TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Hosting**: Vercel
- **State Management**: TanStack Query + Context API
- **Validation**: Zod + React Hook Form
- **PWA**: next-pwa avec mode hors-ligne

## 📋 Fonctionnalités Principales

### Rôles Utilisateurs
- **Bénévole**: Inscription, consultation et inscription aux missions
- **Responsable de Mission**: Gestion de missions spécifiques + droits bénévole
- **Administrateur**: Gestion complète de l'application

### Fonctionnalités Clés
- ✅ Authentification (Email/Password + Google)
- ✅ Gestion des missions avec créneaux horaires
- ✅ Inscription/désinscription aux missions
- ✅ Vérification automatique des chevauchements horaires
- ✅ Dashboards personnalisés par rôle
- ✅ Export PDF (bénévole) et Excel (admin)
- ✅ "Appel à bénévoles" automatique
- ✅ Mode hors-ligne (PWA)
- ✅ Conformité RGPD

## 🛠 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Firebase
- Compte Vercel (pour déploiement)

### Configuration Locale

1. **Cloner le repository**
```bash
git clone <votre-repo-url>
cd benevoles3
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Firebase**

Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com/)

**a) Configuration Web (Client)**
- Dans Project Settings > General > Your apps
- Cliquez sur "Add app" > Web
- Copiez les valeurs de configuration

**b) Configuration Admin SDK (Serveur)**
- Dans Project Settings > Service Accounts
- Cliquez sur "Generate new private key"
- Téléchargez le fichier JSON

**c) Activer les services Firebase**
- Authentication > Sign-in method : activez Email/Password et Google
- Firestore Database : créez une base de données (mode production)
- Storage : activez le stockage

4. **Configurer les variables d'environnement**

Copiez `.env.local.example` vers `.env.local` et remplissez avec vos valeurs Firebase :

```bash
cp .env.local.example .env.local
```

Éditez `.env.local` avec vos vraies valeurs.

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 🗂 Structure du Projet

```
benevoles3/
├── app/                    # Routes Next.js (App Router)
│   ├── (auth)/            # Routes d'authentification
│   ├── (dashboard)/       # Routes protégées (dashboards)
│   ├── api/               # API Routes
│   └── layout.tsx         # Layout principal
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   ├── features/         # Composants par fonctionnalité
│   ├── layouts/          # Layouts réutilisables
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utilitaires et config
│   ├── firebase/         # Configuration Firebase
│   ├── utils/            # Fonctions utilitaires
│   └── validations/      # Schémas Zod
├── types/                # Types TypeScript
└── public/               # Assets statiques
```

## 🔐 Configuration Firebase Security Rules

Créez les règles Firestore suivantes dans la console Firebase :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
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
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() && 
                      (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Missions collection
    match /missions/{missionId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update: if isAdmin() || 
                      (isResponsible() && 
                       request.auth.uid in resource.data.responsibles);
      allow delete: if isAdmin();
    }
    
    // Volunteer Requests collection
    match /volunteerRequests/{requestId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && 
                      request.auth.uid == request.resource.data.userId;
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
  }
}
```

## 📦 Déploiement sur Vercel

1. **Connecter votre repository GitHub**
```bash
# Initialiser git si ce n'est pas fait
git init
git add .
git commit -m "feat: initial setup"
git remote add origin <votre-repo-github>
git push -u origin main
```

2. **Déployer sur Vercel**
- Connectez-vous sur [vercel.com](https://vercel.com)
- Cliquez sur "New Project"
- Importez votre repository GitHub
- Ajoutez vos variables d'environnement (depuis `.env.local`)
- Déployez !

3. **Configurer le domaine Firebase**

Une fois déployé, mettez à jour votre configuration Firebase :
- Firebase Console > Authentication > Settings > Authorized domains
- Ajoutez votre domaine Vercel (ex: `votre-app.vercel.app`)

## 🧪 Tests

```bash
# Tests unitaires (à venir)
npm run test

# Tests E2E (à venir)
npm run test:e2e

# Linting
npm run lint

# Format code
npm run format
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build production
npm run start        # Serveur production
npm run lint         # Linter
npm run format       # Formater le code avec Prettier
```

## 🔧 Configuration Husky (Pre-commit Hooks)

Pour activer les pre-commit hooks :

```bash
npm run prepare
```

Cela configurera automatiquement Husky pour exécuter le linting et le formatage avant chaque commit.

## 🗺 Roadmap

### Phase 0 ✅ (Actuelle)
- [x] Setup projet
- [x] Configuration Firebase
- [x] Structure de dossiers
- [x] Types TypeScript
- [x] Validations Zod

### Phase 1 (Prochaine)
- [ ] Authentification complète
- [ ] Pages inscription/connexion
- [ ] Gestion profil utilisateur
- [ ] Upload avatar
- [ ] Suppression compte (RGPD)

### Phase 2
- [ ] CRUD Missions
- [ ] Statuts missions
- [ ] Missions récurrentes

### Phase 3
- [ ] Inscription aux missions
- [ ] Vérification chevauchements
- [ ] Affichage temps réel

### Phase 4+
- Voir le cahier des charges complet

## 👥 Contribution

Ce projet est développé pour le Festival Films Courts de Dinan. Pour toute question ou contribution, contactez l'équipe organisatrice.

## 📄 Licence

Propriétaire - Festival Films Courts de Dinan © 2025

## 🆘 Support

En cas de problème :
1. Vérifiez que toutes les variables d'environnement sont correctes
2. Vérifiez que les services Firebase sont activés
3. Consultez les logs Firebase et Vercel
4. Contactez l'équipe de développement

---

Développé avec ❤️ pour le Festival Films Courts de Dinan 🎬
