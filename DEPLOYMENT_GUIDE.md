# 🚀 Guide de Déploiement - Améliorations Appel Bénévoles

## ⚠️ IMPORTANT : Système en Production

Ce guide explique comment déployer les nouvelles fonctionnalités de manière sécurisée en mode preview Vercel.

---

## 📋 Résumé des Modifications

### ✅ Fonctionnalité 1 : Message Pré-rempli Obligatoire
- Message d'introduction avec calcul automatique des places restantes
- Format : "Bonjour à tous, il reste encore X places restantes..."
- Obligatoire : impossible d'envoyer sans message

### ✅ Fonctionnalité 2 : Notifications d'Inscription
- Les admins et responsables sont notifiés quand un bénévole s'inscrit
- Notifications Firestore + Emails (Resend)
- Composant NotificationBell avec badge de compteur

---

## 📦 Fichiers Modifiés/Créés

### Modifiés
- ✅ `lib/utils/volunteer-call-generator.ts` - Générateur de message
- ✅ `app/dashboard/volunteer-call/page.tsx` - Page d'appel aux bénévoles
- ✅ `lib/firebase/registrations.ts` - Système d'inscription
- ✅ `firestore.rules` - Règles de sécurité
- ✅ `firestore.indexes.json` - Index Firestore

### Créés
- ✅ `app/api/notifications/registration/route.ts` - API notifications
- ✅ `hooks/useNotifications.ts` - Hook React
- ✅ `components/features/notifications/notification-bell.tsx` - Composant UI
- ✅ Documentation (3 fichiers MD)

---

## 🔧 Étape 1 : Préparation Locale

### 1.1 Vérifier les Modifications

```bash
# Voir tous les fichiers modifiés
git status

# Vérifier les différences
git diff
```

### 1.2 Tester Localement (Optionnel)

```bash
# Installer les dépendances si nécessaire
npm install date-fns

# Lancer le serveur de développement
npm run dev

# Tester sur http://localhost:3000
```

**Tests à faire** :
- ✅ Page `/dashboard/volunteer-call` : message pré-rempli
- ✅ Impossible d'envoyer sans message
- ✅ S'inscrire à une mission (vérifier les logs)

---

## 🌿 Étape 2 : Créer une Branche Git

### 2.1 Créer et Passer sur la Nouvelle Branche

```bash
git checkout -b feature/amelioration-appel-benevoles
```

### 2.2 Ajouter Tous les Fichiers

```bash
git add .
```

### 2.3 Vérifier les Fichiers Ajoutés

```bash
git status
```

**Fichiers attendus** :
- `lib/utils/volunteer-call-generator.ts`
- `app/dashboard/volunteer-call/page.tsx`
- `lib/firebase/registrations.ts`
- `firestore.rules`
- `firestore.indexes.json`
- `app/api/notifications/registration/route.ts`
- `hooks/useNotifications.ts`
- `components/features/notifications/notification-bell.tsx`
- `FEATURE_AMELIORATION_APPEL_BENEVOLES.md`
- `NOTIFICATION_BELL_INTEGRATION.md`
- `DEPLOYMENT_GUIDE.md`

### 2.4 Commit

```bash
git commit -m "feat: amélioration système appel bénévoles + notifications

- Message pré-rempli obligatoire avec calcul automatique places restantes
- Système de notifications pour admins/responsables lors inscriptions
- API notifications avec emails Resend
- Composant NotificationBell avec badge temps réel
- Règles Firestore et index pour notifications
- Documentation complète"
```

### 2.5 Push vers GitHub

```bash
git push origin feature/amelioration-appel-benevoles
```

---

## 🔗 Étape 3 : Créer une Pull Request

### 3.1 Sur GitHub

1. Aller sur **https://github.com/[votre-repo]/benevoles3**
2. Cliquer sur **"Pull Requests"**
3. Cliquer sur **"New Pull Request"**
4. Sélectionner :
   - Base : `main`
   - Compare : `feature/amelioration-appel-benevoles`
5. Cliquer sur **"Create Pull Request"**

### 3.2 Remplir la PR

**Titre** :
```
🚀 Amélioration système d'appel aux bénévoles + notifications
```

**Description** :
```markdown
## Changements

### ✅ Message pré-rempli obligatoire
- Calcul automatique des places restantes
- Message par défaut généré selon missions sélectionnées
- Validation : impossible d'envoyer sans message

### ✅ Système de notifications
- Notifications Firestore temps réel
- Emails automatiques via Resend
- Composant NotificationBell avec badge
- Admins + responsables de catégorie notifiés

## Tests à effectuer sur le preview

- [ ] Message pré-rempli sur /dashboard/volunteer-call
- [ ] Validation du message obligatoire
- [ ] Inscription à une mission → notification créée
- [ ] Badge de notification s'affiche
- [ ] Email reçu (si Resend configuré)

## Documentation

- [x] FEATURE_AMELIORATION_APPEL_BENEVOLES.md
- [x] NOTIFICATION_BELL_INTEGRATION.md
- [x] DEPLOYMENT_GUIDE.md
```

### 3.3 Créer la PR

Cliquer sur **"Create Pull Request"**

---

## 🔍 Étape 4 : Preview Vercel Automatique

### 4.1 Vercel Détecte la PR

**Automatiquement dans les 1-2 minutes** :
- ✅ Vercel démarre un build
- ✅ Crée un environnement de preview
- ✅ Génère une URL unique

### 4.2 Trouver l'URL de Preview

**Sur GitHub** :
- Dans la PR, section "Checks"
- Chercher "Vercel"
- Cliquer sur "Visit Preview"

**URL Format** :
```
https://benevoles3-git-feature-amelioration-xxx.vercel.app
```

**OU sur Vercel Dashboard** :
- Aller sur https://vercel.com/dashboard
- Sélectionner le projet `benevoles3`
- Onglet "Deployments"
- Chercher le déploiement de la branche

---

## 🧪 Étape 5 : Tests sur Preview

### 5.1 Configuration Vercel (Variables d'Environnement)

**Avant les tests, vérifier que les variables sont configurées** :

Sur Vercel Dashboard :
1. Projet `benevoles3`
2. Settings → Environment Variables
3. Vérifier :
   ```
   RESEND_API_KEY=re_xxxxx (pour les emails)
   ```

**Si manquante** :
- Ajouter la variable
- Re-déployer le preview : Settings → Redeploy

### 5.2 Tests Fonctionnels

#### Test 1 : Message Pré-rempli

1. Se connecter sur le preview : `https://[preview-url].vercel.app`
2. Aller sur `/dashboard/volunteer-call`
3. **Vérifier** :
   - ✅ Le champ "Message d'introduction" est rempli
   - ✅ Le texte contient le nombre de places
   - ✅ Le label affiche `*` (obligatoire)
   - ✅ Le texte d'aide mentionne le calcul automatique

#### Test 2 : Validation Obligatoire

1. Sur `/dashboard/volunteer-call`
2. Vider le champ de message
3. Cliquer sur "Envoyer par Email"
4. **Vérifier** :
   - ✅ Toast d'erreur : "Le message d'introduction est obligatoire"
   - ✅ L'envoi est bloqué

#### Test 3 : Notifications d'Inscription

**Préparation** :
- Compte A : Admin ou responsable
- Compte B : Bénévole simple

**Steps** :
1. Se connecter avec Compte B
2. Aller sur `/dashboard/missions`
3. Choisir une mission et s'inscrire
4. **Vérifier inscription réussie** : ✅ Toast "Inscription réussie"

5. Se déconnecter et se connecter avec Compte A
6. **Vérifier Firestore** (Firebase Console) :
   - Collection `notifications`
   - Document avec :
     ```json
     {
       "userId": "[id_compte_A]",
       "type": "volunteer_registration",
       "title": "🆕 Nouvelle inscription",
       "message": "[Nom] s'est inscrit(e) à la mission [Titre]",
       "read": false
     }
     ```

7. **Vérifier Email** (si Resend configuré) :
   - Email reçu sur l'adresse du Compte A
   - Sujet : "🆕 Nouvelle inscription - [Titre Mission]"

#### Test 4 : Composant NotificationBell

**Pré-requis** : Intégrer le composant dans le header (voir NOTIFICATION_BELL_INTEGRATION.md)

1. Se connecter avec Compte A (admin)
2. **Vérifier** :
   - ✅ Icône de cloche visible dans le header
   - ✅ Badge rouge avec chiffre "1"
3. Cliquer sur la cloche
4. **Vérifier** :
   - ✅ Popover s'ouvre
   - ✅ Notification affichée avec fond bleu
   - ✅ Texte : "[Nom] s'est inscrit(e)..."
5. Cliquer sur la notification
6. **Vérifier** :
   - ✅ Redirection vers `/dashboard/missions/[id]`
   - ✅ Fond bleu disparaît (notification marquée comme lue)
   - ✅ Badge diminue ou disparaît

---

## 📊 Étape 6 : Monitoring & Logs

### 6.1 Logs Vercel

**Sur Vercel Dashboard** :
1. Projet `benevoles3`
2. Onglet "Deployments"
3. Cliquer sur le déploiement preview
4. Onglet "Functions"
5. Chercher `/api/notifications/registration`

**Logs à vérifier** :
```
✅ [count] notification(s) créée(s)
✅ [count] email(s) envoyé(s)
```

**Erreurs possibles** :
```
⚠️ RESEND_API_KEY non configurée
❌ Erreur lors de l'envoi des notifications
```

### 6.2 Firebase Console

**Firestore** :
1. Aller sur https://console.firebase.google.com
2. Sélectionner le projet
3. Firestore Database
4. Collection `notifications`
5. Vérifier les documents créés

**Règles Firestore** :
1. Aller sur "Rules"
2. Vérifier que les règles pour `notifications` sont présentes :
   ```javascript
   match /notifications/{notificationId} {
     allow read: if isAuthenticated() && request.auth.uid == resource.data.userId;
     ...
   }
   ```

**Index Firestore** :
1. Aller sur "Indexes"
2. Vérifier l'index : `notifications` → `userId` (Asc) + `createdAt` (Desc)
3. Si manquant :
   ```bash
   firebase deploy --only firestore:indexes
   ```

### 6.3 Resend Dashboard (si configuré)

**Sur Resend** : https://resend.com/emails
1. Vérifier les emails envoyés
2. Statut : "Delivered" / "Opened" / "Clicked"

---

## ✅ Étape 7 : Validation & Merge

### 7.1 Checklist de Validation

- [ ] Message pré-rempli fonctionne
- [ ] Validation obligatoire fonctionne
- [ ] Inscription déclenche les notifications
- [ ] Notifications créées dans Firestore
- [ ] Emails envoyés (si Resend)
- [ ] Composant NotificationBell fonctionne (si intégré)
- [ ] Aucune erreur dans les logs Vercel
- [ ] Règles Firestore déployées
- [ ] Index Firestore créé
- [ ] Pas de régression sur les autres fonctionnalités

### 7.2 Approuver la Pull Request

**Sur GitHub** :
1. Aller sur la PR
2. Ajouter un commentaire de validation :
   ```
   ✅ Tests effectués sur preview
   ✅ Message pré-rempli OK
   ✅ Notifications OK
   ✅ Prêt pour production
   ```
3. Cliquer sur **"Merge Pull Request"**
4. Choisir "Squash and Merge" ou "Create a merge commit"
5. Confirmer

### 7.3 Déploiement Automatique en Production

**Vercel détecte le merge sur `main`** :
- ✅ Build automatique
- ✅ Déploiement sur `benevoles3.vercel.app`
- ✅ En 1-2 minutes

---

## 🔄 Étape 8 : Post-Déploiement

### 8.1 Vérifier la Production

**URL** : https://benevoles3.vercel.app

**Tests rapides** :
1. ✅ Message pré-rempli sur `/dashboard/volunteer-call`
2. ✅ Inscription à une mission → notification créée
3. ✅ Aucune erreur dans les logs

### 8.2 Deployer les Règles Firestore (si pas déjà fait)

```bash
# Si vous avez Firebase CLI configuré
firebase deploy --only firestore:rules

# Pour les index aussi
firebase deploy --only firestore:indexes
```

**Ou via Firebase Console** :
1. Aller sur Firestore Database → Rules
2. Copier les règles de `firestore.rules`
3. Cliquer sur "Publish"

### 8.3 Nettoyer la Branche (Optionnel)

```bash
# Localement
git checkout main
git pull origin main
git branch -d feature/amelioration-appel-benevoles

# Sur GitHub (déjà supprimée automatiquement si option activée)
```

---

## 🆘 Rollback en Cas de Problème

### Option 1 : Rollback via Vercel

**Sur Vercel Dashboard** :
1. Aller sur le projet `benevoles3`
2. Onglet "Deployments"
3. Chercher le déploiement précédent (avant le merge)
4. Cliquer sur "⋯" → "Promote to Production"

### Option 2 : Revert Git

```bash
# Identifier le commit du merge
git log --oneline

# Revert le merge
git revert -m 1 [commit-hash]
git push origin main
```

**Vercel re-déploie automatiquement** l'ancienne version.

---

## 📞 Support & Dépannage

### Problème 1 : Preview ne se crée pas

**Vérifier** :
1. Connexion GitHub ↔ Vercel
2. Vercel est bien configuré pour le projet
3. Pas d'erreur de build dans Vercel

### Problème 2 : Notifications ne sont pas créées

**Vérifier** :
1. Règles Firestore déployées
2. Fonction `registerToMission` mise à jour
3. Logs Vercel : `/api/notifications/registration`

### Problème 3 : Emails ne sont pas envoyés

**Vérifier** :
1. `RESEND_API_KEY` configurée dans Vercel
2. Variable assignée au bon environnement (Production, Preview, Development)
3. Domaine vérifié dans Resend

### Problème 4 : Index Firestore manquant

**Erreur** : "The query requires an index"

**Solution** :
```bash
firebase deploy --only firestore:indexes
```

**Ou créer manuellement** dans Firebase Console :
- Collection : `notifications`
- Champs : `userId` (Asc), `createdAt` (Desc)

---

## 📋 Résumé des Commandes

```bash
# 1. Créer la branche
git checkout -b feature/amelioration-appel-benevoles

# 2. Ajouter et committer
git add .
git commit -m "feat: amélioration système appel bénévoles + notifications"

# 3. Push
git push origin feature/amelioration-appel-benevoles

# 4. Créer PR sur GitHub (interface web)

# 5. Tester le preview Vercel (URL fournie par Vercel)

# 6. Merger la PR sur GitHub (interface web)

# 7. Vérifier le déploiement automatique en production

# 8. Deployer les règles Firestore (si nécessaire)
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

---

## ✅ Checklist Complète

### Préparation
- [x] Tous les fichiers modifiés/créés
- [x] Documentation complète
- [x] Aucune erreur de linting

### Déploiement
- [ ] Branche Git créée
- [ ] Commit effectué
- [ ] Push vers GitHub
- [ ] Pull Request créée
- [ ] Preview Vercel généré
- [ ] Tests effectués sur preview
- [ ] PR mergée
- [ ] Déploiement en production réussi

### Configuration
- [ ] Variables d'environnement Vercel configurées
- [ ] Règles Firestore déployées
- [ ] Index Firestore créés
- [ ] Composant NotificationBell intégré (optionnel)

### Validation
- [ ] Message pré-rempli fonctionne
- [ ] Validation obligatoire fonctionne
- [ ] Notifications créées dans Firestore
- [ ] Emails envoyés (si Resend)
- [ ] Aucune régression

---

**Date** : 15 Novembre 2025  
**Version** : 1.0  
**Auteur** : AI Assistant
