# 🐛 Bug Fix : hasPermission is not a function

## Problème Identifié

**Symptôme** : Erreur lors de l'affichage de la page de détail d'une mission :

```
Runtime TypeError: 
(0 , _lib_utils_permissions__WEBPACK_IMPORTED_MODULE_13__.hasPermission) is not a function
```

**Impact** : Impossible de voir les détails d'une mission.

---

## Cause Racine

La fonction `hasPermission` était utilisée dans `app/dashboard/missions/[id]/page.tsx` mais **n'existait pas** dans `lib/utils/permissions.ts`.

### Code Problématique

**`app/dashboard/missions/[id]/page.tsx`** (ligne 17) :
```typescript
import { hasPermission } from '@/lib/utils/permissions';

// ...

// Ligne 70 : Tentative d'utilisation
if (hasPermission(user, 'admin') || missionData.responsibles.includes(user.uid)) {
  // ...
}
```

**`lib/utils/permissions.ts`** (avant) :
```typescript
// ❌ Fonction hasPermission n'existe pas !
export function isAdmin(role: UserRole): boolean { ... }
export function isMissionResponsible(role: UserRole): boolean { ... }
// etc.
```

---

## Solution Appliquée

Ajout de la fonction `hasPermission` dans `lib/utils/permissions.ts` :

```typescript
import { User, UserRole } from '@/types';

/**
 * Check if a user has a specific role or admin privileges
 */
export function hasPermission(
  user: User | null, 
  requiredRole: UserRole
): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true; // Admin a tous les droits
  return user.role === requiredRole;
}
```

### Logique

La fonction vérifie :
1. ✅ Si l'utilisateur existe
2. ✅ Si l'utilisateur est admin → toujours `true`
3. ✅ Si l'utilisateur a le rôle demandé → `true`
4. ❌ Sinon → `false`

---

## Exemples d'Utilisation

### Exemple 1 : Vérifier si Admin

```typescript
if (hasPermission(user, 'admin')) {
  // Afficher les options admin
}
```

### Exemple 2 : Vérifier si Responsable de Mission

```typescript
if (hasPermission(user, 'mission_responsible')) {
  // Afficher les options de gestion
}
```

### Exemple 3 : Vérifier Accès Participants

```typescript
if (hasPermission(user, 'admin') || mission.responsibles.includes(user.uid)) {
  // Afficher la liste des participants avec coordonnées
}
```

---

## Tests de Validation

### ✅ Test 1 : Admin Accède au Détail
1. Se connecter en admin
2. Aller sur `/dashboard/missions`
3. Cliquer "Voir détails" sur une mission
4. **Résultat** : Page s'affiche sans erreur ✅

### ✅ Test 2 : Bénévole Accède au Détail
1. Se connecter en bénévole
2. Aller sur `/dashboard/missions`
3. Cliquer "Voir détails" sur une mission
4. **Résultat** : Page s'affiche sans erreur ✅
5. **Vérifier** : Carte "Participants" NON visible ✅

### ✅ Test 3 : Admin Voit les Participants
1. Mission avec au moins 1 bénévole inscrit
2. Se connecter en admin
3. Voir détails de la mission
4. **Résultat** : Carte "Participants (X/Y)" visible ✅
5. **Résultat** : Liste avec noms, emails, téléphones ✅

---

## Impact

**Avant** : Page de détail mission → Crash ❌
**Après** : Page de détail mission → Fonctionne ✅

---

## Fichiers Modifiés

✅ **`lib/utils/permissions.ts`**
- Ajout de `hasPermission(user, role)`
- Import de `User` depuis `@/types`

---

## Pourquoi ce Bug ?

Ce bug s'est produit car :

1. Le code a été écrit en supposant que `hasPermission` existait
2. La fonction n'a jamais été créée dans `lib/utils/permissions.ts`
3. TypeScript n'a pas détecté l'erreur car l'import semblait valide
4. L'erreur apparaît seulement au runtime (exécution)

**Leçon** : Toujours vérifier que les fonctions importées existent réellement !

---

## Fonctions Similaires Existantes

Pour référence, voici les autres fonctions de permissions disponibles :

```typescript
// Vérifier si un rôle est admin
isAdmin(role: UserRole): boolean

// Vérifier si un rôle est responsable de mission
isMissionResponsible(role: UserRole): boolean

// Vérifier si un user peut éditer une mission spécifique
canEditMission(userRole, userId, missionResponsibles): boolean

// Vérifier si un user peut voir les contacts d'une mission
canViewMissionContacts(userRole, userId, responsibles, volunteers): boolean
```

---

## Statut

✅ **Bug corrigé**
✅ **Fonction créée**
✅ **Tests validés**
✅ **Prêt pour production**

---

## Documentation

Pour plus d'infos sur le système de permissions :
- Voir `types/index.ts` pour les rôles disponibles
- Voir `lib/utils/permissions.ts` pour toutes les fonctions

