# ✅ Checklist de Déploiement - Missions Complètes

**Feature** : Visibilité et édition des missions complètes  
**Date** : 22 octobre 2025  
**Status** : ✅ Tests locaux réussis

---

## 📋 Tests Locaux (localhost:3000) - FAIT ✅

- [x] Mission complète visible pour responsable de catégorie
- [x] Modification de mission complète fonctionne
- [x] Recalcul automatique du statut (full → published)
- [x] Permissions respectées (uniquement sa catégorie)
- [x] Aucune erreur dans la console
- [x] Responsive : testé sur mobile/desktop

---

## 🔍 Tests Preview Vercel - À FAIRE

### 1. Trouver l'URL du preview
- [ ] Aller sur https://vercel.com/dashboard
- [ ] Projet `benevoles3` → Deployments
- [ ] Trouver `feature/missions-completes-visibility`
- [ ] Copier l'URL (ex: `benevoles3-git-feature-xyz.vercel.app`)

### 2. Tester avec 2-3 personnes
- [ ] Compte admin : Voir toutes les missions (draft, published, full, etc.)
- [ ] Compte responsable : Voir missions published + full
- [ ] Compte bénévole : Voir missions published + full, mais pas de bouton modifier

### 3. Scénarios critiques
- [ ] Modifier une mission complète (2/2) → Passer à 5 bénévoles
- [ ] Vérifier badge passe de "Complète" à "Publiée"
- [ ] Modifier une mission publiée (3/5) → Passer à 3 bénévoles
- [ ] Vérifier badge passe de "Publiée" à "Complète"
- [ ] Responsable ne peut PAS modifier missions d'autres catégories

### 4. Vérifications techniques
- [ ] Aucune erreur dans Console (F12)
- [ ] Logs de recalcul visibles : `Mission xxx: statut changé...`
- [ ] Performance OK (pas de ralentissement)
- [ ] Pas d'erreur Firestore (index OK)

---

## 🚀 Déploiement Production - Si Preview OK

### Commandes Git

```bash
# 1. Retour sur main
git checkout main

# 2. Merger la feature
git merge feature/missions-completes-visibility

# 3. Pousser en production
git push origin main
```

### Vérifications Post-Déploiement (5 minutes après)

- [ ] Site accessible : https://benevoles3.vercel.app
- [ ] Se connecter avec compte responsable
- [ ] Vérifier qu'on voit les missions complètes
- [ ] Tester une modification rapide (titre d'une mission test)
- [ ] Vérifier logs Vercel : https://vercel.com/dashboard → Logs
- [ ] Vérifier logs Firebase : Console Firebase → Firestore

---

## 🔄 Plan de Rollback (en cas de problème)

### Méthode A : Rollback Vercel (2 minutes)
1. Dashboard Vercel → Deployments
2. Trouver le dernier déploiement qui fonctionnait
3. Cliquer "..." → "Promote to Production"

### Méthode B : Revert Git (5 minutes)
```bash
git revert HEAD
git push origin main
```

### Méthode C : Rollback partiel (code uniquement)
Modifier `app/dashboard/missions/page.tsx` ligne 227 :
```typescript
const data = user.role === 'admin'
  ? await getAllMissions()
  : await getPublishedMissions(); // Retour ancien code
```

---

## 📊 Monitoring Post-Déploiement

### Première heure
- [ ] Surveiller les erreurs Vercel
- [ ] Vérifier que les utilisateurs se connectent normalement
- [ ] Checker les logs Firebase pour erreurs inhabituelles

### Premier jour
- [ ] Recueillir les retours des responsables de catégories
- [ ] Vérifier qu'aucune mission n'a un statut incohérent
- [ ] S'assurer que les inscriptions fonctionnent toujours

---

## 💬 Communication aux Utilisateurs

### Message aux responsables de catégories

**Titre** : Nouvelle fonctionnalité - Gestion des missions complètes

**Message** :
```
Bonjour,

Nous avons ajouté une nouvelle fonctionnalité pour améliorer la gestion de vos missions :

✨ Nouveautés :
- Vous pouvez maintenant voir toutes vos missions, même celles qui sont complètes
- Vous pouvez modifier une mission complète et ajuster le nombre de bénévoles
- Le statut se met à jour automatiquement (si vous passez de 2 à 5 places, la mission redevient "Publiée")

🔒 Sécurité :
- Vous ne pouvez toujours modifier que les missions de vos catégories
- Les autres catégories restent protégées

N'hésitez pas à nous faire vos retours !

L'équipe technique
```

---

## 📝 Notes Techniques

### Fichiers modifiés
- `lib/firebase/missions.ts` : Nouvelle fonction `getVisibleMissions()`
- `lib/firebase/missions.ts` : Recalcul auto du statut dans `updateMission()`
- `app/dashboard/missions/page.tsx` : Utilisation de `getVisibleMissions()`
- `lib/queries/missions.ts` : Nouveau hook `useVisibleMissions()`

### Index Firestore requis
- Collection : `missions`
- Champs : `status` (Asc) + `createdAt` (Desc)
- Status : ✅ Probablement déjà créé

### Performance
- Aucun impact négatif attendu
- Même nombre de requêtes qu'avant
- Requête `where('status', 'in', [...])` optimisée par Firestore

---

## ✅ Validation Finale

### Avant de merger en production :
- [x] Tests locaux passés
- [ ] Tests preview passés
- [ ] Au moins 2 testeurs ont validé
- [ ] Documentation à jour
- [ ] Plan de rollback préparé
- [ ] Communication prête

### Déploiement recommandé :
- **Quand** : Période creuse (23h-2h ou week-end matin)
- **Qui** : Personne disponible pour monitoring
- **Durée** : 5 min déploiement + 1h monitoring

---

**Status actuel** : ✅ Prêt pour preview Vercel  
**Prochaine étape** : Tester sur preview puis merger en production

