# Phase 4 : Système Responsable Mission ✅

**Date** : 3 octobre 2025  
**Statut** : 🎯 EN COURS (6/8 tâches complétées)

---

## 🎯 Objectif

Mettre en place un système complet permettant aux bénévoles de devenir "Responsables de Mission", avec validation par les administrateurs et permissions pour éditer les missions dont ils sont responsables.

---

## ✨ Fonctionnalités Implémentées

### 1. **Page Profil Bénévole** 👤 ✅
- Page `/dashboard/profile` avec toutes les infos utilisateur
- Avatar, email, téléphone, date d'inscription
- Badge de rôle avec couleurs dynamiques
- Consentements RGPD affichés

### 2. **Bouton "Devenir Responsable"** 🎖️ ✅
- Visible uniquement pour les bénévoles (`role: volunteer`)
- Carte dédiée avec explication des permissions
- Liste des avantages du rôle Responsable
- Désactivé si une demande est déjà en attente

### 3. **Collection `volunteerRequests`** 📋 ✅
- Structure Firestore avec statuts `pending`, `approved`, `rejected`
- Tracking de `requestedAt`, `processedAt`, `processedBy`
- Firestore Rules sécurisées :
  - Tout le monde peut lire (authentifié)
  - Créer uniquement sa propre demande avec statut `pending`
  - Update/Delete réservés aux admins

### 4. **Page Admin - Gestion des Demandes** 🛡️ ✅
- Page `/dashboard/admin/requests` (admins uniquement)
- Liste toutes les demandes en attente
- Affichage des infos complètes du demandeur (nom, email, téléphone)
- Date et heure de la demande
- Boutons "Approuver" et "Rejeter" avec confirmations

### 5. **Validation/Refus des Demandes** ✅
- **Approuver** :
  - Met à jour le rôle utilisateur : `volunteer` → `mission_responsible`
  - Marque la demande comme `approved`
  - Enregistre qui a approuvé et quand
- **Rejeter** :
  - Marque la demande comme `rejected`
  - Enregistre qui a rejeté et quand
  - Option de message (pour implémentation future)
- Retrait automatique de la liste après traitement
- Messages de succès/erreur

### 6. **Badge Notification Admin** 🔔 ✅
- Badge rouge sur le bouton "Gérer les demandes" dans le dashboard admin
- Affiche le nombre de demandes en attente
- Mise à jour automatique après traitement
- Visible uniquement si `count > 0`

### 7. **Permissions Responsables** 🔐 ✅
- Fonction `canEditMission(userRole, userId, missionResponsibles)`
- Responsables peuvent éditer **uniquement leurs missions** (où leur UID est dans `responsibles[]`)
- Admins peuvent éditer toutes les missions
- Bouton "Modifier" visible selon permissions
- Redirection si tentative d'édition non autorisée
- Suppression réservée aux admins uniquement

---

## 🧪 Tests à Effectuer

### Test 1 : Demande de Responsabilité ✅
1. Se connecter en tant que bénévole
2. Aller sur `/dashboard/profile`
3. Cliquer sur "Devenir Responsable de Mission"
4. ✅ Vérifier message de succès
5. ✅ Vérifier badge "Demande en attente"

### Test 2 : Validation Admin ✅
1. Se connecter en tant qu'admin
2. ✅ Voir le badge de notification sur le dashboard
3. Aller sur `/dashboard/admin/requests`
4. ✅ Voir la demande avec toutes les infos
5. Cliquer "Approuver" et confirmer
6. ✅ Vérifier que la demande disparaît
7. Se reconnecter avec le bénévole
8. ✅ Vérifier rôle changé en "Responsable de Mission"

### Test 3 : Permissions Responsable (À TESTER) ⏳
1. Admin crée une mission
2. Admin ajoute le responsable dans `responsibles[]` (MANUEL pour l'instant)
3. Se connecter en tant que responsable
4. Voir la mission
5. ✅ Bouton "Modifier" visible
6. Cliquer "Modifier"
7. ✅ Accès accordé à la page d'édition
8. Éditer et sauvegarder
9. ✅ Modifications appliquées

### Test 4 : Responsable sans Permission (À TESTER) ⏳
1. Responsable voit une mission dont il n'est PAS responsable
2. ❌ Bouton "Modifier" NON visible
3. Essayer d'accéder directement via URL `/missions/[id]/edit`
4. ❌ Message d'erreur + redirection

### Test 5 : Suppression (À TESTER) ⏳
1. Se connecter en tant que responsable
2. Éditer une de ses missions
3. ❌ Bouton "Supprimer" NON visible
4. Se connecter en tant qu'admin
5. ✅ Bouton "Supprimer" visible
6. Supprimer avec confirmation

---

## 🚧 Fonctionnalités Restantes

### 8. **Attribution Co-Responsables à Mission** ⏳
**À implémenter** :
- UI pour ajouter/retirer des responsables d'une mission
- Autocomplete pour rechercher des responsables
- Liste des responsables actuels avec bouton "Retirer"
- Permissions : Admin + Responsables existants peuvent ajouter d'autres responsables

---

## 📁 Fichiers Créés/Modifiés

### Nouveaux Fichiers
- `app/dashboard/profile/page.tsx` - Page profil utilisateur
- `app/dashboard/admin/requests/page.tsx` - Page admin gestion demandes
- `lib/firebase/volunteer-requests.ts` - Fonctions Firebase demandes

### Fichiers Modifiés
- `app/dashboard/page.tsx` - Badge notification admin
- `app/dashboard/missions/[id]/page.tsx` - Permissions bouton "Modifier"
- `app/dashboard/missions/[id]/edit/page.tsx` - Vérification permissions édition
- `firestore.rules` - Règles pour `volunteerRequests`
- `lib/utils/permissions.ts` - Fonction `canEditMission`

---

## 🔐 Firestore Rules

```firestore
match /volunteerRequests/{requestId} {
  allow read: if isAuthenticated();
  allow create: if isAuthenticated() 
                && request.auth.uid == request.resource.data.userId
                && request.resource.data.status == 'pending';
  allow update: if isAdmin();
  allow delete: if isAdmin();
}
```

---

## 🎨 UI/UX

### Page Profil
- **Card principale** : Infos personnelles avec avatar
- **Card Responsable** (bénévoles) : Fond bleu, icône badge
- **Card Consentements** : RGPD transparent

### Page Admin Requests
- **Cards individuelles** pour chaque demande
- **Boutons côte à côte** : Approuver (vert) / Rejeter (gris)
- **AlertDialogs** pour confirmations
- **Badges** : Statut "En attente" (jaune)

### Dashboard Admin
- **Badge rouge** avec compteur sur le bouton
- **Notification visuelle** claire

---

## 🎯 Prochaines Étapes

### Pour Terminer la Phase 4
1. **Tester les permissions responsables** :
   - Créer une mission (admin)
   - Ajouter manuellement un UID dans `responsibles[]` (Firebase Console)
   - Tester édition avec ce responsable

2. **Implémenter Attribution Co-Responsables** :
   - UI dans la page édition de mission
   - Recherche/autocomplete de responsables
   - Ajout/retrait de responsables
   - Mise à jour du tableau `responsibles[]`

---

## 📊 Progression

| Tâche | Status |
|-------|--------|
| ✅ Page profil bénévole | TERMINÉ |
| ✅ Bouton "Devenir responsable" | TERMINÉ |
| ✅ Collection volunteerRequests | TERMINÉ |
| ✅ Page admin demandes | TERMINÉ |
| ✅ Validation/refus | TERMINÉ |
| ✅ Badge notification admin | TERMINÉ |
| ✅ Permissions édition | TERMINÉ |
| ⏳ Attribution co-responsables | EN ATTENTE |

**Progression** : 7/8 (87.5%)

---

**🎯 Phase 4 : Presque terminée !** 🎉

Testez les fonctionnalités existantes, puis nous implémenterons l'attribution de co-responsables ! 🚀

