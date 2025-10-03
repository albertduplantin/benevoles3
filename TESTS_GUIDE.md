# 🧪 Guide de Tests - Application Bénévoles

**URL de test** : http://localhost:3001

---

## 📋 Checklist Complète

### ✅ Phase 1 : Authentification

#### Test 1.1 : Inscription par Email
- [ ] Aller sur http://localhost:3001/auth/register
- [ ] Remplir tous les champs (prénom, nom, email, téléphone, mot de passe)
- [ ] Cocher la case RGPD (obligatoire)
- [ ] Cliquer "S'inscrire"
- [ ] **Vérifier** : Redirection vers `/dashboard`
- [ ] **Vérifier** : Profil complet visible (nom, email, téléphone)

#### Test 1.2 : Connexion par Email
- [ ] Se déconnecter
- [ ] Aller sur `/auth/login`
- [ ] Saisir email et mot de passe
- [ ] Cliquer "Se connecter"
- [ ] **Vérifier** : Redirection vers `/dashboard`

#### Test 1.3 : Inscription par Google (nouveau compte)
- [ ] Se déconnecter
- [ ] Aller sur `/auth/register`
- [ ] Cliquer "Continuer avec Google"
- [ ] Sélectionner un compte Google non utilisé
- [ ] **Vérifier** : Redirection vers `/auth/complete-profile`
- [ ] Remplir le téléphone (format: 06 12 34 56 78)
- [ ] Cliquer "Valider mon profil"
- [ ] **Vérifier** : Redirection vers `/dashboard`

#### Test 1.4 : Connexion par Google (compte existant)
- [ ] Se déconnecter
- [ ] Aller sur `/auth/login`
- [ ] Cliquer "Continuer avec Google"
- [ ] Sélectionner le compte Google précédent
- [ ] **Vérifier** : Redirection directe vers `/dashboard` (pas de complétion)

#### Test 1.5 : Protection Profil Incomplet
- [ ] Se connecter avec Google (nouveau compte)
- [ ] Être redirigé vers `/auth/complete-profile`
- [ ] **Sans remplir**, taper manuellement `/dashboard` dans l'URL
- [ ] **Vérifier** : Redirection automatique vers `/auth/complete-profile`

---

### ✅ Phase 2 : Gestion Missions (Admin)

#### Test 2.1 : Changer son rôle en Admin
1. Aller sur https://console.firebase.google.com
2. Projet → Firestore Database
3. Collection `users` → Trouver votre document
4. Modifier `role` : `volunteer` → `admin`
5. Rafraîchir la page dashboard
6. **Vérifier** : "Rôle: Administrateur" affiché

#### Test 2.2 : Créer une Mission Planifiée
- [ ] Dashboard → "Voir les missions"
- [ ] Cliquer "Nouvelle mission"
- [ ] **Vérifier** : Bouton visible uniquement pour admin
- [ ] Remplir le formulaire :
  - Titre : "Accueil Festival - Jour 1"
  - Description : "Accueillir les festivaliers..."
  - Type : "Planifiée"
  - Date début : Demain à 14h00
  - Date fin : Demain à 18h00
  - Lieu : "Salle des fêtes, Dinan"
  - Nombre de bénévoles : 3
  - Mission urgente : Oui
  - Statut : Publiée
- [ ] Cliquer "Créer la mission"
- [ ] **Vérifier** : Redirection vers liste missions
- [ ] **Vérifier** : Mission visible avec badge "URGENT"

#### Test 2.3 : Créer une Mission Continue
- [ ] Nouvelle mission
- [ ] Type : "Au long cours"
- [ ] Titre : "Gestion réseaux sociaux"
- [ ] Ne pas remplir les dates
- [ ] Lieu : "En ligne"
- [ ] Bénévoles : 2
- [ ] Statut : Publiée
- [ ] **Vérifier** : Mission créée avec "⏱️ Mission au long cours"

#### Test 2.4 : Mission en Brouillon
- [ ] Créer une mission avec Statut : "Brouillon"
- [ ] **Vérifier** : Badge gris "Brouillon"
- [ ] **Vérifier** : Mission visible dans la liste (admin)

---

### ✅ Phase 3 : Inscription aux Missions

#### Test 3.1 : Inscription Simple
- [ ] Se connecter en tant que bénévole (pas admin)
- [ ] Aller sur `/dashboard/missions`
- [ ] **Vérifier** : Bouton "Nouvelle mission" NON visible
- [ ] **Vérifier** : Missions publiées visibles
- [ ] **Vérifier** : Missions brouillon NON visibles
- [ ] Cliquer "Voir détails" sur une mission publiée
- [ ] **Vérifier** : Page détail s'affiche
- [ ] **Vérifier** : Bouton "Je m'inscris" visible
- [ ] **Vérifier** : Places disponibles affichées (ex: 3 / 3)
- [ ] Cliquer "Je m'inscris"
- [ ] **Vérifier** : Message vert "✅ Inscription réussie !"
- [ ] **Vérifier** : Bouton change en "Me désinscrire"
- [ ] **Vérifier** : Places diminuent (ex: 2 / 3)

#### Test 3.2 : Double Inscription (Erreur)
- [ ] Être inscrit à une mission
- [ ] Rafraîchir la page
- [ ] Essayer de s'inscrire à nouveau (via console ou manipulation)
- [ ] **Vérifier** : Erreur "Vous êtes déjà inscrit"

#### Test 3.3 : Mission Complète
- [ ] Se connecter avec 3 comptes différents
- [ ] Inscrire les 3 à la même mission (max 3 places)
- [ ] **Vérifier** : Badge change en "Complète" (orange)
- [ ] Avec un 4e compte, aller sur la mission
- [ ] **Vérifier** : Badge orange "Cette mission est complète"
- [ ] **Vérifier** : Pas de bouton "Je m'inscris"

#### Test 3.4 : Désinscription Simple
- [ ] Être inscrit à une mission (dans > 24h)
- [ ] Cliquer "Me désinscrire"
- [ ] **Vérifier** : Popup de confirmation
- [ ] Confirmer
- [ ] **Vérifier** : Message vert "✅ Désinscription réussie"
- [ ] **Vérifier** : Bouton revient à "Je m'inscris"
- [ ] **Vérifier** : Places augmentent

#### Test 3.5 : Règle 24h (Désinscription Bloquée)
- [ ] En admin, créer une mission dans 12h
- [ ] S'inscrire avec un compte bénévole
- [ ] Essayer de se désinscrire
- [ ] **Vérifier** : Erreur rouge "Impossible de se désinscrire moins de 24h avant"

#### Test 3.6 : Mission Complète → Disponible
- [ ] Mission complète (3/3)
- [ ] Un bénévole se désinscrit (2/3)
- [ ] **Vérifier** : Statut revient à "Publiée" (vert)
- [ ] **Vérifier** : Autres peuvent s'inscrire

---

### ✅ Phase 4 : Liste Participants

#### Test 4.1 : Liste Visible (Admin)
- [ ] Se connecter en tant qu'admin
- [ ] Aller sur une mission avec participants
- [ ] **Vérifier** : Carte "Participants (X/Y)" visible
- [ ] **Vérifier** : Liste des bénévoles affichée
- [ ] **Vérifier** : Chaque bénévole montre :
  - Photo/Avatar
  - Prénom + Nom
  - Email
  - Téléphone

#### Test 4.2 : Liste Masquée (Bénévole)
- [ ] Se connecter en tant que bénévole simple
- [ ] Aller sur une mission avec participants
- [ ] **Vérifier** : Carte "Participants" NON visible
- [ ] **Vérifier** : Coordonnées des autres masquées (RGPD)

---

### ✅ Phase 5 : Permissions et Sécurité

#### Test 5.1 : Accès Direct Protégé
- [ ] Se déconnecter
- [ ] Taper `/dashboard` dans l'URL
- [ ] **Vérifier** : Redirection vers `/auth/login`

#### Test 5.2 : Bénévole → Création Mission
- [ ] Se connecter en bénévole
- [ ] Taper `/dashboard/missions/new` dans l'URL
- [ ] **Vérifier** : Accès bloqué OU erreur

#### Test 5.3 : Rôles Affichés
- [ ] Se connecter en admin
- [ ] Dashboard → **Vérifier** : "Rôle: Administrateur"
- [ ] Se connecter en bénévole
- [ ] Dashboard → **Vérifier** : "Rôle: Bénévole"

---

### ✅ Phase 6 : UI/UX

#### Test 6.1 : Responsive Mobile
- [ ] Ouvrir Chrome DevTools (F12)
- [ ] Mode responsive (Ctrl+Shift+M)
- [ ] Tester iPhone 12 Pro
- [ ] **Vérifier** : Formulaires lisibles
- [ ] **Vérifier** : Boutons cliquables
- [ ] **Vérifier** : Cartes missions s'empilent

#### Test 6.2 : Avatars et Initiales
- [ ] Créer un compte "Jean Dupont" (sans Google)
- [ ] **Vérifier** : Avatar avec "JD" généré
- [ ] **Vérifier** : Couleur aléatoire basée sur email
- [ ] Se connecter avec Google (avec photo)
- [ ] **Vérifier** : Photo Google affichée

#### Test 6.3 : Messages d'Erreur
- [ ] Essayer de s'inscrire avec email invalide
- [ ] **Vérifier** : "Email invalide" en rouge
- [ ] Téléphone invalide : "12345"
- [ ] **Vérifier** : "Numéro de téléphone invalide"
- [ ] Mot de passe < 6 caractères
- [ ] **Vérifier** : "Au moins 6 caractères"

#### Test 6.4 : Badges Colorés
- [ ] Mission publiée → Badge vert
- [ ] Mission brouillon → Badge gris
- [ ] Mission complète → Badge orange
- [ ] Mission annulée → Badge rouge
- [ ] Mission terminée → Badge bleu
- [ ] Mission urgente → Badge rouge "URGENT"

---

### ✅ Phase 7 : Données et Firebase

#### Test 7.1 : Persistence Firestore
- [ ] S'inscrire à une mission
- [ ] Fermer l'onglet
- [ ] Rouvrir http://localhost:3001
- [ ] Se reconnecter
- [ ] **Vérifier** : Toujours inscrit

#### Test 7.2 : Timestamps
- [ ] Créer une mission
- [ ] Firebase Console → Firestore → missions
- [ ] **Vérifier** : `createdAt` = timestamp
- [ ] **Vérifier** : `startDate` = timestamp (si planifiée)

#### Test 7.3 : Transactions (Concurrence)
- [ ] Ouvrir 2 onglets côte à côte
- [ ] Mission avec 1 place restante
- [ ] Dans les 2 onglets, cliquer "Je m'inscris" en même temps
- [ ] **Vérifier** : 1 réussit, 1 échoue avec "Mission complète"

---

### ✅ Phase 8 : Edge Cases

#### Test 8.1 : Mission Sans Dates (Continue)
- [ ] Créer mission "Au long cours"
- [ ] S'inscrire
- [ ] Essayer de se désinscrire
- [ ] **Vérifier** : Pas de règle 24h (car pas de date)

#### Test 8.2 : Caractères Spéciaux
- [ ] Créer mission avec titre : "Café & Gâteaux 🎂"
- [ ] Description avec retours à la ligne
- [ ] **Vérifier** : Affichage correct
- [ ] **Vérifier** : Emoji affiché

#### Test 8.3 : Téléphone Formats Valides
- [ ] 06 12 34 56 78 → ✅
- [ ] 0612345678 → ✅
- [ ] +33 6 12 34 56 78 → ✅
- [ ] 06-12-34-56-78 → ✅
- [ ] 12345 → ❌ (erreur)

---

## 🐛 Bugs Connus à Vérifier

### Bug Potentiel 1 : Redirection après connexion
**Symptôme** : Reste sur page login après Google Sign-In
**Workaround** : Aller manuellement sur `/dashboard`
**Statut** : À tester

### Bug Potentiel 2 : Port 3000 occupé
**Symptôme** : Serveur démarre sur port 3001
**Solution** : Utiliser http://localhost:3001
**Statut** : Normal (autre process sur 3000)

---

## 📊 Résultats Attendus

**Tous les tests doivent passer** ✅

Si un test échoue :
1. Noter le numéro du test
2. Décrire le comportement attendu vs observé
3. Copier le message d'erreur (console ou UI)
4. Me le signaler pour correction

---

## 🎯 Tests Prioritaires (MVP)

Si vous manquez de temps, testez au minimum :

**Critiques** :
- [ ] 1.1 : Inscription Email
- [ ] 1.3 : Inscription Google + Complétion téléphone
- [ ] 2.2 : Créer mission
- [ ] 3.1 : Inscription à mission
- [ ] 3.3 : Mission complète
- [ ] 3.4 : Désinscription
- [ ] 4.1 : Liste participants (admin)
- [ ] 4.2 : Liste masquée (bénévole)

---

## 📝 Template Rapport de Bug

```
❌ Test X.Y : [Nom du test]

Comportement attendu :
[Ce qui devrait se passer]

Comportement observé :
[Ce qui se passe réellement]

Étapes pour reproduire :
1. ...
2. ...
3. ...

Message d'erreur (si applicable) :
[Copier-coller]

Capture d'écran :
[Si pertinent]
```

---

## ✅ Validation Finale

Quand tous les tests passent :
- [ ] Application stable ✅
- [ ] Pas de bugs bloquants ✅
- [ ] UX fluide ✅
- [ ] Sécurité respectée ✅
- [ ] RGPD respecté ✅

**→ MVP validé ! Prêt pour la suite** 🚀

