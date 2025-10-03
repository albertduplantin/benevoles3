# 📋 Parcours Utilisateur - Festival Bénévoles

## 🔐 1. Inscription / Connexion

### Option A : Inscription par Email/Password

**Page : `/auth/register`**

1. L'utilisateur remplit le formulaire :
   - Prénom ✅
   - Nom ✅
   - Email ✅
   - Téléphone ✅ (obligatoire)
   - Mot de passe ✅
   - Accepte RGPD ✅ (obligatoire)
   - Communications (optionnel)

2. Clic sur "S'inscrire"
   - Création compte Firebase Auth
   - Création document Firestore `users/{uid}`
   - **Profil complet** ✅

3. **Redirection automatique** → `/dashboard`

---

### Option B : Inscription par Google

**Page : `/auth/register`**

1. Clic sur "Continuer avec Google"
   - Popup Google Sign-In
   - Sélection compte Google

2. **Si premier compte** :
   - Création document Firestore `users/{uid}`
   - Prénom/Nom extraits du nom Google
   - **Téléphone vide** ❌
   - **Profil incomplet**

3. **Redirection automatique** → `/auth/complete-profile`

4. Formulaire de complétion :
   - Prénom (pré-rempli)
   - Nom (pré-rempli)
   - **Téléphone** ✅ (obligatoire)

5. Clic sur "Valider mon profil"
   - Mise à jour Firestore
   - **Profil complet** ✅

6. **Redirection automatique** → `/dashboard`

---

### Option C : Connexion Email/Password

**Page : `/auth/login`**

1. L'utilisateur saisit :
   - Email
   - Mot de passe

2. Clic sur "Se connecter"
   - Vérification Firebase Auth
   - Récupération document Firestore

3. **Redirection automatique** → `/dashboard`

---

### Option D : Connexion Google (compte existant)

**Page : `/auth/login`**

1. Clic sur "Continuer avec Google"
   - Popup Google Sign-In
   - Sélection compte Google

2. **Si profil complet** (téléphone existant) :
   - **Redirection automatique** → `/dashboard`

3. **Si profil incomplet** (téléphone manquant) :
   - **Redirection automatique** → `/auth/complete-profile`
   - Complétion profil
   - **Redirection automatique** → `/dashboard`

---

## 🔒 2. Protections en Place

### Vérification Profil Complet

**Fonction : `isProfileComplete(user)`**

Vérifie que :
- ✅ `firstName` existe
- ✅ `lastName` existe
- ✅ `phone` existe et non vide
- ✅ `email` existe

### Pages Protégées

| Page | Protection |
|------|-----------|
| `/dashboard` | ✅ Authentification + Profil complet |
| `/dashboard/missions` | ✅ Authentification + Profil complet |
| `/dashboard/missions/new` | ✅ Authentification + Profil complet |
| `/auth/complete-profile` | ✅ Authentification uniquement |

**Comportement** :
- Si non authentifié → Redirection vers `/auth/login`
- Si authentifié mais profil incomplet → Redirection vers `/auth/complete-profile`

---

## 📊 3. Scénarios de Test

### ✅ Test 1 : Inscription Email complète

```
1. Aller sur /auth/register
2. Remplir tous les champs (dont téléphone)
3. Cocher RGPD
4. Cliquer "S'inscrire"
5. ✅ Devrait arriver sur /dashboard
```

---

### ✅ Test 2 : Inscription Google sans téléphone

```
1. Aller sur /auth/register
2. Cliquer "Continuer avec Google"
3. Sélectionner compte Google (nouveau)
4. ✅ Devrait arriver sur /auth/complete-profile
5. Remplir le téléphone
6. Cliquer "Valider mon profil"
7. ✅ Devrait arriver sur /dashboard
```

---

### ✅ Test 3 : Connexion Google avec profil complet

```
1. Aller sur /auth/login
2. Cliquer "Continuer avec Google"
3. Sélectionner compte Google (existant avec téléphone)
4. ✅ Devrait arriver directement sur /dashboard
```

---

### ✅ Test 4 : Accès direct dashboard sans profil complet

```
1. Se connecter avec Google (sans téléphone)
2. Aller directement sur /dashboard (URL)
3. ✅ Devrait être redirigé vers /auth/complete-profile
4. Compléter le téléphone
5. ✅ Devrait arriver sur /dashboard
```

---

## 🔧 4. Fichiers Modifiés/Créés

### Nouveaux fichiers
- `lib/firebase/users.ts` - Fonctions de gestion utilisateur
- `app/auth/complete-profile/page.tsx` - Page complétion profil
- `PARCOURS_UTILISATEUR.md` - Ce document

### Fichiers modifiés
- `components/features/auth/register-form.tsx` - Ajout bouton Google
- `components/features/auth/google-sign-in-button.tsx` - Vérification profil
- `app/dashboard/page.tsx` - Protection profil
- `app/dashboard/missions/page.tsx` - Protection profil

---

## 🚀 5. Prochaines Étapes

- [ ] Tester tous les scénarios ci-dessus
- [ ] Vérifier l'UX du flux Google
- [ ] Éventuellement ajouter un message d'accueil après Google Sign-In
- [ ] Continuer Phase 2 (Gestion Missions)

