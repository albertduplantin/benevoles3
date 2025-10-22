# 🧪 Guide de Test Sécurisé - Missions Complètes

**Date** : 22 octobre 2025  
**Feature** : Visibilité et édition des missions complètes

---

## ⚠️ IMPORTANT : Ne JAMAIS tester en production directement

### Risques :
- 🔴 Utilisateurs réels impactés
- 🔴 Données corrompues possibles
- 🔴 Perte de confiance
- 🔴 Pas de rollback facile

---

## ✅ Option 1 : Preview Vercel (RECOMMANDÉ) ⭐

### Pourquoi c'est la meilleure option :
- ✅ Environnement identique à production
- ✅ URL séparée (pas d'impact sur les utilisateurs)
- ✅ Utilise Firebase production (données réelles)
- ✅ Facile à partager avec des testeurs
- ✅ Merge facile si tout fonctionne

### Étapes :

#### 1. Pousser la branche feature
```bash
git push origin feature/missions-completes-visibility
```

#### 2. Vercel crée automatiquement le preview
- Vercel détecte le push
- Crée un déploiement preview automatique
- URL : `benevoles3-git-feature-missions-xyz.vercel.app`
- Disponible en 2-3 minutes

#### 3. Trouver l'URL du preview

**Option A : Via le Dashboard Vercel**
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Onglet "Deployments"
4. Trouvez le déploiement de la branche `feature/missions-completes-visibility`
5. Copiez l'URL

**Option B : Via GitHub (si intégré)**
1. Allez sur votre repository GitHub
2. Pull Requests (ou dans les Commits)
3. Vercel commente automatiquement avec l'URL

#### 4. Tester sur le preview
- Partagez l'URL avec 2-3 testeurs de confiance
- Utilisateurs réels continuent sur l'URL production
- Testez tous les scénarios du fichier `FEATURE_MISSIONS_COMPLETES_VISIBILITE.md`

#### 5. Si tout est OK : Merger en production
```bash
git checkout main
git merge feature/missions-completes-visibility
git push origin main
```

Vercel redéploiera automatiquement la production.

---

## ✅ Option 2 : Firebase Emulator (ISOLATION TOTALE)

### Pourquoi cette option :
- ✅ Base de données complètement isolée
- ✅ Aucun risque pour les données réelles
- ❌ Plus complexe à configurer
- ❌ Données de test à créer manuellement

### Configuration :

#### 1. Installer Firebase Emulator Suite
```bash
npm install -g firebase-tools
```

#### 2. Initialiser les emulators
```bash
cd benevoles3
firebase init emulators
```

Sélectionnez :
- [x] Firestore
- [x] Authentication
- [x] Functions (si vous en avez)

#### 3. Modifier la configuration Firebase locale

Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

Modifier `lib/firebase/config.ts` pour utiliser les emulators en dev :
```typescript
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}
```

#### 4. Lancer les emulators
```bash
firebase emulators:start
```

#### 5. Créer des données de test
- Interface : http://localhost:4000
- Créez manuellement quelques missions avec différents statuts

#### 6. Tester localement
```bash
npm run dev
```

---

## ✅ Option 3 : Test Local + Firebase Production (PRUDENT)

### Configuration :
- Environnement : localhost:3000
- Base de données : Firebase production
- **ATTENTION** : Vous touchez aux vraies données !

### Précautions :

#### 1. Créer un compte de test dédié
Créez un compte avec email : `test-responsable@example.com`
- Rôle : `category_responsible`
- Catégorie : Créez une catégorie de test "🧪 TEST"

#### 2. Créer des missions de test
Créez 2-3 missions dans la catégorie "🧪 TEST" :
- Mission 1 : Statut `published`, 2/5 bénévoles
- Mission 2 : Statut `full`, 3/3 bénévoles
- Mission 3 : Statut `draft`

#### 3. Tester UNIQUEMENT sur ces missions de test
- ✅ Ne touchez PAS aux vraies missions
- ✅ Testez toutes les fonctionnalités sur les missions TEST
- ✅ Vérifiez le recalcul du statut

#### 4. Nettoyer après les tests
Supprimez :
- Les missions de test
- La catégorie "🧪 TEST"
- Le compte de test

---

## 🎯 Quelle Option Choisir ?

### Pour ce cas (Feature importante + App en production) :

**🥇 OPTION 1 : Preview Vercel**
- Meilleur compromis sécurité/réalisme
- Données réelles, environnement isolé
- Facile à partager avec testeurs

**🥈 OPTION 2 : Firebase Emulator**
- Si vous voulez une isolation totale
- Plus de setup initial
- Parfait pour tester des migrations complexes

**🥉 OPTION 3 : Local + Production**
- Uniquement pour des tests rapides
- Avec compte et données de test dédiés
- Risque modéré mais gérable

---

## 📋 Checklist Avant de Déployer en Production

- [ ] Tous les tests passent en preview/local
- [ ] Au moins 2 testeurs ont validé
- [ ] Aucune erreur dans les logs
- [ ] Performance OK (pas de ralentissement)
- [ ] Index Firestore vérifié
- [ ] Documentation à jour
- [ ] Plan de rollback préparé
- [ ] Déploiement pendant période creuse (ex: 23h-2h)

---

## 🚨 Plan de Rollback (en cas de problème)

### Si problème détecté en production :

#### Méthode 1 : Rollback Vercel (2 minutes)
1. Dashboard Vercel → Deployments
2. Trouver le dernier déploiement qui fonctionnait
3. Cliquer sur "..." → "Promote to Production"
4. ✅ Retour instantané à l'ancienne version

#### Méthode 2 : Revert Git (5 minutes)
```bash
git revert HEAD
git push origin main
```
Vercel redéploie automatiquement.

#### Méthode 3 : Rollback partiel (Code uniquement)
Modifier `app/dashboard/missions/page.tsx` ligne 227 :
```typescript
// Retour temporaire à l'ancien comportement
const data = user.role === 'admin'
  ? await getAllMissions()
  : await getPublishedMissions(); // Ancien code
```

Commit et push → Déploiement en 2 minutes.

---

## 📞 Support

En cas de problème pendant les tests :
1. Checker les logs : Console navigateur (F12)
2. Checker Vercel logs : Dashboard → Logs
3. Checker Firebase logs : Console Firebase → Logging

---

**Bonne chance ! 🚀**

N'oubliez pas : **Preview Vercel = Option la plus sûre**

