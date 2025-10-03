# 🎯 Phase 3 : Inscription aux Missions - TERMINÉE !

## ✅ Fonctionnalités Implémentées

### 📄 Page Détail Mission (`/dashboard/missions/[id]`)

**Route dynamique** : `/dashboard/missions/[missionId]`

**Accessible à** : Tous les bénévoles authentifiés

**Contenu** :
- ✅ Titre de la mission
- ✅ Badge de statut (Brouillon, Publiée, Complète, Annulée, Terminée)
- ✅ Badge "URGENT" si applicable
- ✅ Description complète
- ✅ Dates et horaires (missions planifiées)
- ✅ Lieu
- ✅ Places disponibles / Total
- ✅ Bouton d'inscription
- ✅ Bouton de désinscription
- ✅ Liste des participants (admin/responsable uniquement)

---

## 🔐 Logique d'Inscription

### Fonction `registerToMission(missionId, userId)`

**Chemin** : `lib/firebase/registrations.ts`

**Vérifications** :
1. ✅ Mission existe
2. ✅ Mission non annulée
3. ✅ Mission non terminée
4. ✅ Mission publiée (pas brouillon)
5. ✅ Utilisateur pas déjà inscrit
6. ✅ Places disponibles

**Actions** :
- Ajoute l'utilisateur à `mission.volunteers[]`
- Met à jour `mission.updatedAt`
- **Si mission complète** → Change statut à `full`

**Transaction Firestore** : Utilise `runTransaction()` pour éviter les problèmes de concurrence (race conditions)

---

## 🔓 Logique de Désinscription

### Fonction `unregisterFromMission(missionId, userId)`

**Vérifications** :
1. ✅ Mission existe
2. ✅ Utilisateur est bien inscrit
3. ✅ **Règle 24h** : Impossible de se désinscrire moins de 24h avant le début

**Actions** :
- Retire l'utilisateur de `mission.volunteers[]`
- Met à jour `mission.updatedAt`
- **Si mission était complète** → Change statut à `published`

**Sécurité** : Confirmation obligatoire avant désinscription

---

## 👥 Liste des Participants

**Visible par** :
- ✅ Administrateurs
- ✅ Responsables de la mission

**Affiche** :
- Photo de profil / Avatar avec initiales
- Prénom et nom
- Email
- Téléphone

**Masqué pour** : Bénévoles simples (respect RGPD)

---

## 🎨 UI/UX

### Boutons Dynamiques

**Statut** : `published` + Places disponibles + Pas inscrit
→ Bouton vert : **"Je m'inscris"**

**Statut** : Inscrit + Mission non terminée
→ Bouton outline : **"Me désinscrire"**

**Statut** : `full` + Pas inscrit
→ Badge orange : **"Cette mission est complète"**

**Statut** : `completed` + Inscrit
→ Badge bleu : **"✅ Vous avez participé à cette mission"**

**Statut** : `cancelled`
→ Badge rouge : **"Cette mission a été annulée"**

### Badges de Statut

| Statut | Couleur | Label |
|--------|---------|-------|
| `draft` | Gris | Brouillon |
| `published` | Vert | Publiée |
| `full` | Orange | Complète |
| `cancelled` | Rouge | Annulée |
| `completed` | Bleu | Terminée |

### Messages de Feedback

**Inscription réussie** :
```
✅ Inscription réussie !
```

**Désinscription réussie** :
```
✅ Désinscription réussie
```

**Erreurs** :
```
❌ Cette mission est complète
❌ Impossible de se désinscrire moins de 24h avant le début
❌ Vous êtes déjà inscrit à cette mission
```

---

## 🔒 Sécurité Firestore

### Règles à ajouter dans `firestore.rules`

```javascript
// Inscription aux missions
match /missions/{missionId} {
  // Permettre l'inscription
  allow update: if request.auth != null 
    && request.resource.data.volunteers.hasAll(resource.data.volunteers) // Pas de suppression
    && request.resource.data.volunteers.size() == resource.data.volunteers.size() + 1 // +1 seul
    && request.resource.data.volunteers.hasAny([request.auth.uid]) // Ajoute son propre UID
    && resource.data.status == 'published' // Mission publiée
    && resource.data.volunteers.size() < resource.data.maxVolunteers; // Places dispo
}
```

⚠️ **À implémenter** : Règles de sécurité complètes

---

## 📂 Fichiers Créés/Modifiés

### Nouveaux fichiers

✅ `lib/firebase/registrations.ts`
- `registerToMission()`
- `unregisterFromMission()`
- `isUserRegistered()`
- `getAvailableSpots()`

✅ `app/dashboard/missions/[id]/page.tsx`
- Page détail mission
- Boutons inscription/désinscription
- Liste participants

✅ `PHASE3_INSCRIPTIONS.md`
- Documentation (ce fichier)

### Fichiers modifiés

✅ `app/dashboard/missions/page.tsx`
- Lien "Voir détails" déjà présent

---

## 🧪 Tests à Effectuer

### Test 1 : Inscription Simple
```
1. Aller sur /dashboard/missions
2. Cliquer sur "Voir détails" d'une mission publiée
3. Cliquer sur "Je m'inscris"
4. ✅ Voir "Inscription réussie"
5. ✅ Bouton change en "Me désinscrire"
6. ✅ Places disponibles diminuent
```

### Test 2 : Mission Complète
```
1. Créer une mission avec 2 places
2. S'inscrire avec 2 comptes différents
3. ✅ Statut passe à "Complète"
4. ✅ Avec un 3e compte, voir "Cette mission est complète"
```

### Test 3 : Désinscription
```
1. S'inscrire à une mission
2. Cliquer "Me désinscrire"
3. Confirmer dans la popup
4. ✅ Voir "Désinscription réussie"
5. ✅ Bouton revient à "Je m'inscris"
6. ✅ Places disponibles augmentent
```

### Test 4 : Règle 24h
```
1. Créer une mission dans moins de 24h
2. S'inscrire
3. Essayer de se désinscrire
4. ✅ Voir erreur "Impossible de se désinscrire moins de 24h avant"
```

### Test 5 : Liste Participants (Admin)
```
1. Se connecter en tant qu'admin
2. Créer une mission et la publier
3. S'inscrire avec d'autres comptes
4. Revenir sur la page en admin
5. ✅ Voir la liste des participants avec emails et téléphones
```

### Test 6 : Liste Participants (Bénévole)
```
1. Se connecter en tant que bénévole simple
2. Aller sur une mission
3. ✅ Ne PAS voir la liste des participants
```

---

## 🚀 Prochaines Étapes

### Phase 3 (Suite) - Optionnel

- [ ] API Route vérification chevauchements horaires
- [ ] Affectation manuelle par admin
- [ ] Gestion des conflits d'horaires

### Phase 4 - Responsables de Mission

- [ ] Bouton "Devenir responsable"
- [ ] Validation admin
- [ ] Permissions responsable

### Phase 5 - Dashboards Avancés

- [ ] Dashboard bénévole avec calendrier
- [ ] Dashboard responsable
- [ ] Dashboard admin avec jauges

---

## 📊 MVP Fonctionnel Atteint ! 🎉

**Vous avez maintenant un MVP fonctionnel** :

✅ Inscription/Connexion (Email + Google)
✅ Téléphone obligatoire
✅ Création de missions (Admin)
✅ Liste des missions
✅ Détail d'une mission
✅ Inscription/Désinscription
✅ Gestion des places
✅ Règle 24h
✅ Permissions (admin/responsable/bénévole)
✅ Liste participants (admin/responsable)

**L'application est prête pour être testée en conditions réelles !** 🚀

