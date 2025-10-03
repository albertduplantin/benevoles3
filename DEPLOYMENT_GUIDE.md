# 🚀 Guide de Déploiement - Festival Bénévoles

**Date** : 3 octobre 2025  
**Objectif** : Déployer l'application sur Vercel avec Firebase

---

## 📋 Prérequis

- ✅ Compte GitHub avec le dépôt [benevoles3](https://github.com/albertduplantin/benevoles3)
- ✅ Compte [Vercel](https://vercel.com) (gratuit)
- ✅ Projet Firebase configuré
- ✅ Variables d'environnement Firebase disponibles

---

## 🔑 Variables d'Environnement Nécessaires

### Configuration Firebase Client (Public)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=benevoles3-a85b4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=benevoles3-a85b4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=benevoles3-a85b4.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Où les trouver ?**
1. Aller sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionner votre projet
3. Aller dans **Project Settings** (⚙️)
4. Descendre jusqu'à **Your apps**
5. Cliquer sur l'icône Web `</>`
6. Copier les valeurs de configuration

### Configuration Firebase Admin (Privé)

**⚠️ IMPORTANT : Ces valeurs sont SECRÈTES et ne doivent JAMAIS être commitées !**

Vous avez 2 options :

#### Option 1 : Variables individuelles (Recommandé pour Vercel)
```env
FIREBASE_ADMIN_PROJECT_ID=benevoles3-a85b4
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@benevoles3-a85b4.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
```

**Où les trouver ?**
1. Firebase Console > **Project Settings** > **Service Accounts**
2. Cliquer sur **Generate New Private Key**
3. Télécharger le fichier JSON
4. Extraire les valeurs :
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY` (avec les `\n` préservés)

#### Option 2 : Chemin vers le fichier JSON (Local uniquement)
```env
FIREBASE_ADMIN_SDK_PATH=./benevoles3-a85b4-firebase-adminsdk-xxxxx.json
```

**⚠️ Ne jamais utiliser cette option en production !**

---

## 🚀 Déploiement sur Vercel

### Étape 1 : Créer un Compte Vercel

1. Aller sur [https://vercel.com/signup](https://vercel.com/signup)
2. **Se connecter avec GitHub** (recommandé)
3. Autoriser Vercel à accéder à vos dépôts

### Étape 2 : Importer le Projet

1. Sur le dashboard Vercel, cliquer sur **Add New** > **Project**
2. Sélectionner votre compte GitHub
3. Trouver le dépôt **benevoles3**
4. Cliquer sur **Import**

### Étape 3 : Configurer le Projet

**Framework Preset** : Next.js (détecté automatiquement)

**Root Directory** : `.` (racine du projet)

**Build Settings** :
- Build Command : `npm run build` (par défaut)
- Output Directory : `.next` (par défaut)
- Install Command : `npm install` (par défaut)

### Étape 4 : Configurer les Variables d'Environnement

**⚠️ CRUCIAL : Ne pas oublier cette étape !**

Dans la section **Environment Variables**, ajouter **TOUTES** ces variables :

#### Variables Client (Public)
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = benevoles3-a85b4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = benevoles3-a85b4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = benevoles3-a85b4.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 123456789
NEXT_PUBLIC_FIREBASE_APP_ID = 1:123456789:web:abc123
```

#### Variables Admin (Privé)
```
FIREBASE_ADMIN_PROJECT_ID = benevoles3-a85b4
FIREBASE_ADMIN_CLIENT_EMAIL = firebase-adminsdk-xxxxx@benevoles3-a85b4.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
```

**💡 Astuce pour FIREBASE_ADMIN_PRIVATE_KEY** :
- Copier la valeur `private_key` depuis le fichier JSON Firebase Admin SDK
- Garder les guillemets doubles `""`
- Les `\n` doivent être préservés (ne pas les remplacer par de vrais retours à la ligne)

### Étape 5 : Déployer

1. Cliquer sur **Deploy**
2. Attendre la fin du build (2-5 minutes)
3. ✅ Votre app est déployée !

**URL** : `https://benevoles3-xxxxx.vercel.app`

---

## 🔧 Configuration Post-Déploiement

### 1. Configurer Firebase Authentication

Ajouter le domaine Vercel aux domaines autorisés :

1. Firebase Console > **Authentication** > **Settings** > **Authorized domains**
2. Cliquer sur **Add domain**
3. Ajouter : `benevoles3-xxxxx.vercel.app`
4. Ajouter aussi : `vercel.app` (pour les preview deployments)

### 2. Mettre à Jour les Redirections

Si vous utilisez Google Sign-In :

1. [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** > **Credentials**
3. Trouver votre **OAuth 2.0 Client ID**
4. Ajouter dans **Authorized redirect URIs** :
   - `https://benevoles3-a85b4.firebaseapp.com/__/auth/handler`
   - `https://benevoles3-xxxxx.vercel.app/__/auth/handler`

### 3. Tester l'Application

1. Ouvrir `https://benevoles3-xxxxx.vercel.app`
2. Tester l'inscription/connexion
3. Vérifier que Firebase fonctionne
4. Tester toutes les fonctionnalités critiques

---

## 🔄 Déploiements Automatiques

Vercel déploie automatiquement :

- **Production** : À chaque push sur `main`
- **Preview** : À chaque push sur une branche ou pull request

**Workflow** :
```
1. Faire des modifications locales
2. git add .
3. git commit -m "feat: nouvelle fonctionnalité"
4. git push origin main
5. ✅ Vercel déploie automatiquement
```

**Accéder aux déploiements** :
- Dashboard Vercel > Votre projet > **Deployments**

---

## 🐛 Dépannage

### Erreur : "Module not found"

**Cause** : Dépendances manquantes

**Solution** :
```bash
# Localement
npm install
npm run build

# Si ça fonctionne localement, forcer un rebuild sur Vercel
# Vercel Dashboard > Project > Settings > General > "Redeploy"
```

### Erreur : "Firebase Admin initialization failed"

**Cause** : Variables d'environnement manquantes ou incorrectes

**Solution** :
1. Vérifier toutes les variables dans Vercel Dashboard > Settings > Environment Variables
2. **Attention aux `\n`** dans `FIREBASE_ADMIN_PRIVATE_KEY` (doivent être préservés)
3. Redéployer après modification des variables

### Erreur : "Firebase Auth domain not authorized"

**Cause** : Domaine Vercel non autorisé dans Firebase

**Solution** :
1. Firebase Console > Authentication > Settings > Authorized domains
2. Ajouter le domaine Vercel
3. Attendre 5 minutes pour la propagation

### Erreur 500 sur certaines pages

**Cause** : Firestore Rules ou données manquantes

**Solution** :
1. Vérifier les Firestore Rules sont déployées
2. Vérifier les indexes Firestore sont créés
3. Consulter les logs Vercel : Dashboard > Project > Logs

---

## 📊 Monitoring et Logs

### Logs Vercel

**Accès** : Vercel Dashboard > Project > **Logs**

**Types de logs** :
- Build logs (erreurs de compilation)
- Function logs (erreurs runtime)
- Static logs (erreurs Next.js)

### Firebase Logs

**Accès** : Firebase Console > **Functions** > **Logs** (si vous utilisez Cloud Functions)

---

## 🔐 Sécurité Production

### Checklist de Sécurité

- [ ] Variables d'environnement configurées dans Vercel (pas dans le code)
- [ ] Fichier Firebase Admin SDK dans `.gitignore`
- [ ] Firestore Rules déployées et testées
- [ ] Domaines autorisés configurés dans Firebase Auth
- [ ] CORS configuré si nécessaire
- [ ] Rate limiting activé (Vercel Pro)
- [ ] SSL/HTTPS activé (automatique sur Vercel)

### Firestore Rules Production

Vérifier que les règles sont déployées :
```bash
firebase deploy --only firestore:rules
```

Tester les règles :
```bash
firebase emulators:start --only firestore
# Puis tester dans l'UI : http://localhost:4000
```

---

## 🎯 Domaine Personnalisé (Optionnel)

### Ajouter votre propre domaine

1. Vercel Dashboard > Project > **Settings** > **Domains**
2. Cliquer sur **Add**
3. Entrer votre domaine : `festival-benevoles.fr`
4. Suivre les instructions pour configurer les DNS

**Configuration DNS** :
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Temps de propagation** : 24-48h

---

## 📈 Performance

### Analytics Vercel

**Accès** : Vercel Dashboard > Project > **Analytics**

**Métriques disponibles** :
- Page views
- Top pages
- Real Experience Score
- Web Vitals (LCP, FID, CLS)

### Optimisations Recommandées

- [ ] Activer Vercel Speed Insights
- [ ] Configurer le caching
- [ ] Optimiser les images (next/image)
- [ ] Lazy loading des composants lourds
- [ ] Préchargement des routes critiques

---

## 🎊 Déploiement Réussi !

**Votre application est en ligne** :
```
🌐 URL Production : https://benevoles3-xxxxx.vercel.app
📊 Dashboard : https://vercel.com/dashboard
🔥 Firebase : https://console.firebase.google.com
📦 GitHub : https://github.com/albertduplantin/benevoles3
```

---

## 📝 Checklist Finale

Avant de partager l'application :

- [ ] Toutes les variables d'environnement configurées
- [ ] Firebase Auth domains autorisés
- [ ] Firestore Rules déployées
- [ ] Firestore Indexes créés
- [ ] Connexion/Inscription testée
- [ ] Navigation testée
- [ ] Responsive testé (mobile + desktop)
- [ ] Fonctionnalités critiques testées
- [ ] Pas d'erreurs console
- [ ] Performance acceptable

---

**🚀 Bon déploiement !**

Pour toute question, consulter :
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

