# 📝 Guide : Statuts des Missions

## 🎯 Comprendre les Statuts

Une mission peut avoir 5 statuts différents :

| Statut | Description | Visible par |
|--------|-------------|-------------|
| **`draft`** (Brouillon) | Mission en cours de création | Admin uniquement |
| **`published`** (Publiée) | Mission visible et ouverte aux inscriptions | Tous les bénévoles |
| **`full`** (Complète) | Mission remplie (max bénévoles atteint) | Tous les bénévoles |
| **`cancelled`** (Annulée) | Mission annulée | Tous (si publiée avant) |
| **`completed`** (Terminée) | Mission passée et terminée | Tous (si publiée avant) |

---

## 🔄 Cycle de Vie d'une Mission

```
[draft] → [published] → [full] → [completed]
   ↓           ↓           ↓
[cancelled] [cancelled] [cancelled]
```

### Transitions Automatiques

✅ **`published` → `full`** : Automatique quand le dernier bénévole s'inscrit
✅ **`full` → `published`** : Automatique si un bénévole se désinscrit

### Transitions Manuelles (Admin)

🔧 **`draft` → `published`** : Publier la mission
🔧 **`published` → `cancelled`** : Annuler la mission
🔧 **`published` → `completed`** : Marquer comme terminée
🔧 **`draft` → `cancelled`** : Supprimer/Annuler avant publication

---

## 🐛 Problème Actuel : Missions en Brouillon

**Symptôme** : Les bénévoles ne voient aucune mission.

**Cause** : Les missions créées ont le statut `draft` par défaut si non spécifié lors de la création.

**Solution** : Changer le statut à `published` dans Firebase.

---

## 🔧 Changer le Statut dans Firebase Console

### Méthode 1 : Firebase Console (Manuel)

1. **Ouvrir Firebase Console**
   - https://console.firebase.google.com
   - Sélectionner votre projet

2. **Aller dans Firestore**
   - Menu gauche → "Firestore Database"
   - Collection `missions`

3. **Sélectionner la mission**
   - Cliquer sur le document de la mission

4. **Modifier le champ `status`**
   - Trouver le champ `status`
   - Cliquer sur la valeur (`draft`)
   - Taper : `published`
   - Sauvegarder (appuyer sur Entrée)

5. **Vérifier**
   - Rafraîchir l'app
   - La mission devrait maintenant être visible pour les bénévoles

---

### Méthode 2 : Via l'Application (Future Fonctionnalité)

**Page d'édition de mission** (à implémenter) :
- Bouton "Publier" : `draft` → `published`
- Bouton "Annuler" : `published` → `cancelled`
- Bouton "Marquer comme terminée" : `published` → `completed`

---

## 🎨 Couleurs des Badges

Dans l'interface :

| Statut | Badge | Couleur |
|--------|-------|---------|
| `draft` | Brouillon | Gris |
| `published` | Publiée | Vert |
| `full` | Complète | Orange |
| `cancelled` | Annulée | Rouge |
| `completed` | Terminée | Bleu |

---

## 📋 Checklist de Publication d'une Mission

Avant de publier une mission (`draft` → `published`), vérifier :

- [ ] Titre clair et descriptif
- [ ] Description complète
- [ ] Dates et horaires corrects (si planifiée)
- [ ] Lieu précis
- [ ] Nombre de bénévoles réaliste
- [ ] Type de mission correct (planifiée/continue)
- [ ] Statut changé à `published`

---

## 🚀 Prochaines Étapes

### Phase 2 : Page d'Édition de Mission

Fonctionnalités à ajouter :
- ✏️ Modifier les infos d'une mission
- 🔄 Changer le statut avec des boutons
- 🗑️ Supprimer une mission (soft delete)
- 📊 Voir l'historique des modifications

### Exemple UI

```
┌─────────────────────────────────┐
│ Mission: Accueil Festival       │
│                                 │
│ Statut: [Brouillon ▼]          │
│   ↳ Brouillon                   │
│   ↳ Publier ← Clic ici         │
│   ↳ Annuler                     │
│                                 │
│ [Enregistrer les modifications] │
└─────────────────────────────────┘
```

---

## 🔍 Debugging

### Vérifier le Statut d'une Mission

**Console Browser (F12)** :
```javascript
// Dans la console de la page missions
console.log(missions.map(m => ({ 
  title: m.title, 
  status: m.status 
})));
```

**Firebase Console** :
- Firestore → missions → Voir toutes les missions
- Colonne `status` affiche le statut de chaque mission

---

## 📝 Notes Importantes

⚠️ **Attention** : Changer `published` → `draft` ne notifie pas les bénévoles inscrits

⚠️ **Conseil** : Utiliser `cancelled` au lieu de supprimer pour garder l'historique

✅ **Bonne pratique** : Toujours tester une mission en `draft` avant de publier

---

## 🎯 Résolution du Bug Actuel

**Action immédiate** :

1. Firebase Console → Firestore → `missions`
2. Pour chaque mission créée :
   - Ouvrir le document
   - Champ `status` : `draft` → `published`
3. Rafraîchir l'app
4. Vérifier que Marie voit maintenant les missions

**Résultat attendu** :
- ✅ Missions visibles dans la liste
- ✅ Badge "Publiée" (vert)
- ✅ Bouton "Je m'inscris" disponible

