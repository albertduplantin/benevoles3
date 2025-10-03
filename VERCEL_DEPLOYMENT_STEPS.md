# 🚀 Guide de Déploiement Vercel - Étapes Simples

**Date** : 3 octobre 2025  
**Projet** : Festival Bénévoles - benevoles3

---

## ✅ Prérequis (Déjà fait)

- ✅ Code sur GitHub : [https://github.com/albertduplantin/benevoles3](https://github.com/albertduplantin/benevoles3)
- ✅ Fichier `.env.local` avec variables Firebase
- ✅ Firestore Rules déployées
- ✅ Firestore Indexes créés

---

## 📋 Étape 1 : Créer un Compte Vercel

### Option A : Se connecter avec GitHub (Recommandé)

1. **Allez sur** : [https://vercel.com/signup](https://vercel.com/signup)
2. **Cliquez sur** "Continue with GitHub"
3. **Autorisez** Vercel à accéder à vos dépôts GitHub
4. ✅ Vous êtes connecté !

### Option B : Créer un compte email

1. Allez sur [https://vercel.com/signup](https://vercel.com/signup)
2. Entrez votre email
3. Vérifiez votre email
4. Connectez ensuite votre compte GitHub

---

## 📦 Étape 2 : Importer le Projet

1. **Sur le dashboard Vercel**, cliquez sur **"Add New"** → **"Project"**

2. **Sélectionnez** votre dépôt GitHub :
   - Nom : `benevoles3`
   - Owner : `albertduplantin`

3. **Cliquez sur "Import"**

---

## 🔑 Étape 3 : Configurer les Variables d'Environnement

**⚠️ TRÈS IMPORTANT** : Ajoutez TOUTES ces variables avant de déployer !

### Variables à Ajouter

Copiez les valeurs depuis votre fichier `.env.local` :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=benevoles3-a85b4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=benevoles3-a85b4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=benevoles3-a85b4.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Comment Ajouter les Variables

1. **Dans la section "Environment Variables"** sur Vercel :
2. Pour chaque variable :
   - **Name** : `NEXT_PUBLIC_FIREBASE_API_KEY`
   - **Value** : (collez la valeur de votre `.env.local`)
   - **Environnements** : Cochez **Production**, **Preview**, **Development**
3. **Cliquez sur "Add"**
4. **Répétez** pour les 6 variables

### 💡 Astuce Rapide

Ouvrez votre `.env.local` dans un éditeur de texte et copiez-collez directement les valeurs !

---

## ⚙️ Étape 4 : Configuration du Build

Vercel détectera automatiquement Next.js. Vérifiez que :

- **Framework Preset** : Next.js ✅ (auto-détecté)
- **Root Directory** : `.` (racine)
- **Build Command** : `npm run build` (par défaut)
- **Output Directory** : `.next` (par défaut)
- **Install Command** : `npm install` (par défaut)

**Ne changez rien** si ces valeurs sont déjà remplies !

---

## 🚀 Étape 5 : Déployer !

1. **Cliquez sur le bouton "Deploy"** (gros bouton bleu)
2. **Attendez 2-3 minutes** ⏱️
   - Vercel va :
     - ✅ Cloner votre repo
     - ✅ Installer les dépendances
     - ✅ Builder l'application
     - ✅ Déployer sur leur CDN
3. ✅ **Succès !** Vous verrez un écran de félicitations 🎉

**URL de votre app** : `https://benevoles3-xxxxx.vercel.app`

---

## 🔧 Étape 6 : Configuration Post-Déploiement

### A. Autoriser le Domaine Vercel dans Firebase

**Important** : Firebase doit autoriser le domaine Vercel pour l'authentification.

1. **Copiez l'URL Vercel** : `benevoles3-xxxxx.vercel.app`
2. **Allez sur Firebase Console** : [https://console.firebase.google.com](https://console.firebase.google.com)
3. **Sélectionnez** votre projet `benevoles3-a85b4`
4. **Allez dans** : **Authentication** → **Settings** → **Authorized domains**
5. **Cliquez sur "Add domain"**
6. **Ajoutez** :
   - `benevoles3-xxxxx.vercel.app` (votre URL)
   - `vercel.app` (pour les preview deployments)
7. **Cliquez sur "Add"**

### B. Configurer Google Sign-In (si utilisé)

Si vous utilisez Google Sign-In :

1. **Allez sur** [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. **Trouvez** votre "OAuth 2.0 Client ID"
4. **Ajoutez dans "Authorized redirect URIs"** :
   - `https://benevoles3-a85b4.firebaseapp.com/__/auth/handler`
   - `https://benevoles3-xxxxx.vercel.app/__/auth/handler`
5. **Sauvegardez**

---

## 🧪 Étape 7 : Tester l'Application

1. **Ouvrez** votre app Vercel : `https://benevoles3-xxxxx.vercel.app`

2. **Testez la connexion** :
   - ✅ Page d'accueil charge
   - ✅ Redirection vers `/auth/login`
   - ✅ Connexion avec email/password fonctionne
   - ✅ Connexion avec Google fonctionne (si configuré)

3. **Testez le dashboard** :
   - ✅ Header s'affiche
   - ✅ Navigation fonctionne
   - ✅ Missions s'affichent
   - ✅ Calendrier se charge

4. **Vérifiez la console** (F12) :
   - ✅ Pas d'erreurs rouges
   - ✅ Firebase se connecte correctement

---

## ⚠️ Problèmes Courants

### Erreur : "Firebase Auth domain not authorized"

**Solution** :
1. Vérifiez que vous avez bien ajouté le domaine Vercel dans Firebase
2. Attendez 5 minutes pour la propagation
3. Videz le cache du navigateur (Ctrl+Shift+R)

### Erreur : "Missing environment variables"

**Solution** :
1. Vérifiez que TOUTES les variables sont dans Vercel
2. Allez dans : Dashboard → Project → Settings → Environment Variables
3. Ajoutez les variables manquantes
4. **Redéployez** : Deployments → ... → Redeploy

### Erreur 500 sur certaines pages

**Solution** :
1. Vérifiez les logs : Dashboard → Project → Logs
2. Vérifiez que les Firestore Rules sont déployées
3. Vérifiez que les Indexes Firestore sont créés

### L'application est lente

**Normal !** Le premier chargement peut être lent. Les suivants seront rapides grâce au cache CDN.

---

## 🔄 Déploiements Automatiques

Vercel déploie automatiquement :

- ✅ **Production** : À chaque push sur `main`
- ✅ **Preview** : À chaque push sur une autre branche
- ✅ **Preview** : À chaque Pull Request

**Workflow** :
```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
# ✅ Vercel déploie automatiquement en 2-3 minutes
```

---

## 📊 Dashboard Vercel

Après déploiement, vous avez accès à :

- 📈 **Analytics** : Visiteurs, pages vues
- 🚀 **Deployments** : Historique de tous les déploiements
- 📝 **Logs** : Logs en temps réel
- ⚙️ **Settings** : Configuration, variables, domaines
- 🌐 **Domains** : Ajouter un domaine personnalisé

---

## 🎨 Domaine Personnalisé (Optionnel)

Si vous avez votre propre domaine (ex: `festival-benevoles.fr`) :

1. **Allez dans** : Dashboard → Project → Settings → Domains
2. **Cliquez sur "Add"**
3. **Entrez** votre domaine : `festival-benevoles.fr`
4. **Suivez** les instructions pour configurer les DNS
5. **Attendez** 24-48h pour la propagation

---

## ✅ Checklist Finale

Avant de partager l'application :

- [ ] Application déployée sur Vercel
- [ ] URL Vercel fonctionne
- [ ] Domaine autorisé dans Firebase Auth
- [ ] Connexion/Inscription testée
- [ ] Dashboard testé
- [ ] Navigation testée
- [ ] Missions testées
- [ ] Responsive testé (mobile)
- [ ] Pas d'erreurs console
- [ ] Performance acceptable

---

## 📞 Support

Si vous avez des problèmes :

1. **Vérifiez les logs** : Vercel Dashboard → Logs
2. **Vérifiez la console** : F12 dans le navigateur
3. **Consultez** la documentation : [vercel.com/docs](https://vercel.com/docs)
4. **Firebase Console** : Vérifiez Authentication et Firestore

---

## 🎉 Félicitations !

Votre application est maintenant en ligne et accessible à tous ! 🚀

**URL de l'application** : `https://benevoles3-xxxxx.vercel.app`

**Prochaines étapes** :
- Partagez l'URL avec les utilisateurs
- Ajoutez un domaine personnalisé
- Activez les analytics
- Ajoutez des fonctionnalités

---

**Bon déploiement ! 🚀**

