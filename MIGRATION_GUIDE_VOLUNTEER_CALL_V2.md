# 🔄 Guide de Migration - Appel Bénévoles V1 → V2

## 📋 Vue d'ensemble

Ce guide explique comment passer de l'ancien générateur d'appel (V1) au nouveau (V2).

---

## ⚡ Migration Rapide (5 minutes)

### Étape 1 : Remplacer l'import

**Fichier** : `app/dashboard/overview/page.tsx` (ligne ~40)

**Avant** :
```tsx
import { VolunteerCallModal } from '@/components/features/admin/volunteer-call-modal';
```

**Après** :
```tsx
import { VolunteerCallModalV2 } from '@/components/features/admin/volunteer-call-modal-v2';
```

### Étape 2 : Remplacer le composant

**Avant** (ligne ~643) :
```tsx
<VolunteerCallModal missions={allMissions} />
```

**Après** :
```tsx
<VolunteerCallModalV2 missions={allMissions} />
```

### Étape 3 : Tester

1. Ouvrir le dashboard admin
2. Cliquer sur "Générer un appel aux bénévoles"
3. Vérifier que le nouveau modal s'ouvre
4. Tester la sélection de missions
5. Tester la personnalisation
6. Tester la copie de message

**C'est tout ! ✅**

---

## 🔧 Modification Complète (Exemple)

### Fichier : `app/dashboard/overview/page.tsx`

**Localisation** : Autour de la ligne 643 dans la section "Communication"

**Code complet à remplacer** :

```tsx
// Imports (en haut du fichier)
import { VolunteerCallModalV2 } from '@/components/features/admin/volunteer-call-modal-v2';

// Dans le render (section Communication)
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <span className="text-2xl">📢</span>
      Communication
    </CardTitle>
    <CardDescription>
      Générez des appels aux bénévoles (Version Améliorée)
    </CardDescription>
  </CardHeader>
  <CardContent>
    <VolunteerCallModalV2 missions={allMissions} />
  </CardContent>
</Card>
```

---

## 🎯 Pour les Responsables de Catégorie

Le composant V2 gère automatiquement le filtrage par catégorie pour les responsables.

**Aucune modification nécessaire** si vous utilisez déjà le système de responsables de catégorie.

Le filtrage se fait automatiquement selon :
- `user.role === 'category_responsible'`
- `user.responsibleForCategories`

---

## 🧪 Tests à Effectuer Après Migration

### Test 1 : Modal s'ouvre
- [ ] Cliquer sur le bouton "Générer un appel aux bénévoles"
- [ ] Le nouveau modal (plus large) s'ouvre
- [ ] Les missions sont listées à gauche avec checkboxes

### Test 2 : Sélection
- [ ] Cocher/décocher une mission → stats se mettent à jour
- [ ] Cliquer "Tout" → toutes cochées
- [ ] Cliquer "Aucun" → toutes décochées

### Test 3 : Filtres
- [ ] Changer catégorie → liste filtrée
- [ ] Changer urgence → liste filtrée
- [ ] Changer date → liste filtrée

### Test 4 : Personnalisation
- [ ] Modifier nom festival → aperçu mis à jour
- [ ] Modifier dates → aperçu mis à jour
- [ ] Ajouter message intro → aperçu mis à jour

### Test 5 : Copie (backward compatible)
- [ ] Copier texte WhatsApp → toast succès
- [ ] Copier HTML → toast succès
- [ ] Coller dans un éditeur → formatage correct

### Test 6 : Destinataires
- [ ] Sélectionner "Tous" → compteur correct
- [ ] Sélectionner "Par catégories" → compteur correct
- [ ] Sélectionner catégories → liste visible

### Test 7 : Envoi (simulation pour l'instant)
- [ ] Cliquer "Envoyer" → loader s'affiche
- [ ] API retourne succès → toast de confirmation
- [ ] Modal se ferme

---

## ⚠️ Points d'Attention

### 1. L'ancien modal n'est PAS supprimé
Le fichier `volunteer-call-modal.tsx` (V1) reste présent pour :
- Permettre un rollback facile si besoin
- Servir de référence

**Vous pouvez le supprimer plus tard** une fois la V2 validée en production.

### 2. Envoi d'email simulé
Pour l'instant, l'envoi d'email est **simulé** (console.log).

**Pour activer l'envoi réel**, voir :
- `FEATURE_VOLUNTEER_CALL_V2.md` → Section "Limitation Actuelle"
- Intégrer SendGrid ou Resend

### 3. Base de données
La V2 crée une nouvelle collection Firestore :

```
Collection: volunteer-calls
```

**Aucune migration de données nécessaire** car :
- La V1 ne stockait rien
- La V2 commence avec une collection vide

---

## 🔄 Rollback (si problème)

Si vous rencontrez un problème avec la V2 :

### Étape 1 : Re-importer V1
```tsx
import { VolunteerCallModal } from '@/components/features/admin/volunteer-call-modal';
```

### Étape 2 : Re-utiliser V1
```tsx
<VolunteerCallModal missions={allMissions} />
```

### Étape 3 : Signaler le bug
Ouvrir un ticket avec :
- Description du problème
- Étapes pour reproduire
- Captures d'écran

---

## 📚 Ressources

- **Documentation V2** : `FEATURE_VOLUNTEER_CALL_V2.md`
- **Documentation V1** : `FEATURE_VOLUNTEER_CALL.md`
- **API Email** : `app/api/volunteer-calls/send-email/route.ts`

---

## 💬 Questions Fréquentes

### Q1 : Puis-je utiliser V1 et V2 en même temps ?
**Oui**, mais pas recommandé. Choisissez l'une ou l'autre.

### Q2 : La V2 est-elle compatible avec les responsables de catégorie ?
**Oui**, elle filtre automatiquement les missions selon les catégories.

### Q3 : Dois-je configurer quelque chose pour l'envoi d'email ?
**Pas tout de suite**. L'envoi est simulé en mode preview. Pour l'activer :
1. Choisir un service (SendGrid/Resend)
2. Ajouter la clé API aux variables d'environnement
3. Décommenter le code dans `route.ts`

### Q4 : Les anciennes URLs de missions fonctionnent toujours ?
**Oui**, rien ne change côté URLs ou structure de données.

### Q5 : Puis-je personnaliser plus le design ?
**Oui**, tout le CSS est dans le composant. Modifiez les classes Tailwind.

---

**Date** : 1er Novembre 2025  
**Version** : 2.0.0  
**Auteur** : Assistant IA


