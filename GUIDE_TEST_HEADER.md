# 🧪 Guide de Test - Header Responsive

**Date** : 3 octobre 2025  
**Objectif** : Vérifier le fonctionnement complet du header et de la navigation

---

## 🎯 Tests Desktop (≥768px)

### Test 1 : Affichage du Header ✅
```
1. Ouvrir http://localhost:3000/dashboard
2. Vérifier la présence du header en haut de page

Résultat attendu :
✅ Header blanc avec bordure
✅ Logo "🎬 Festival Bénévoles" à gauche
✅ Navigation horizontale au centre
✅ Avatar utilisateur à droite
✅ Header sticky (reste en haut au scroll)
```

### Test 2 : Navigation selon le Rôle ✅

**En tant que Bénévole** :
```
Menus visibles :
✅ Tableau de bord
✅ Missions
❌ Nouvelle mission (caché)
❌ Bénévoles (caché)
```

**En tant qu'Admin** :
```
Menus visibles :
✅ Tableau de bord
✅ Missions
✅ Nouvelle mission
✅ Bénévoles
```

### Test 3 : Indicateur Route Active ✅
```
1. Aller sur /dashboard
   ✅ "Tableau de bord" en fond bleu clair

2. Aller sur /dashboard/missions
   ✅ "Missions" en fond bleu clair
   ✅ "Tableau de bord" redevient gris

3. Aller sur /dashboard/missions/abc123
   ✅ "Missions" reste en bleu (route parente active)
```

### Test 4 : Menu Utilisateur (Dropdown) ✅
```
1. Cliquer sur l'avatar à droite

Résultat attendu :
✅ Menu déroulant s'ouvre
✅ Nom complet affiché
✅ Email affiché
✅ Badge rôle affiché (bleu/violet/rouge)
✅ Lien "Mon profil"
✅ Lien "Paramètres" (si admin uniquement)
✅ Bouton "Se déconnecter" en rouge

2. Cliquer sur "Mon profil"
   ✅ Redirection vers /dashboard/profile
   ✅ Page profil affichée avec informations

3. Revenir au dashboard et cliquer avatar > "Se déconnecter"
   ✅ Déconnexion Firebase
   ✅ Redirection vers /auth/login
```

---

## 📱 Tests Mobile (<768px)

### Test 5 : Affichage Mobile ✅
```
1. Réduire la fenêtre à < 768px (ou ouvrir DevTools mode mobile)

Résultat attendu :
✅ Logo abrégé "🎬 FB" visible
✅ Navigation horizontale cachée
✅ Icône burger (☰) visible à droite
✅ Avatar caché sur mobile
```

### Test 6 : Menu Burger ✅
```
1. Cliquer sur l'icône burger (☰)

Résultat attendu :
✅ Panneau latéral s'ouvre de la droite
✅ Largeur 320px (w-80)
✅ Overlay sombre sur le contenu
✅ Profil utilisateur en haut du menu :
   - Avatar avec initiales
   - Nom complet
   - Email
   - Badge rôle

2. Vérifier la liste des liens
   ✅ Icônes à gauche de chaque lien
   ✅ Tableau de bord
   ✅ Missions
   ✅ Nouvelle mission (si admin)
   ✅ Bénévoles (si admin)
   ✅ Séparateur
   ✅ Mon profil
   ✅ Paramètres (si admin)
   ✅ Séparateur
   ✅ Se déconnecter (en rouge)

3. Cliquer sur "Missions"
   ✅ Menu se ferme automatiquement
   ✅ Navigation vers /dashboard/missions

4. Rouvrir le menu et cliquer en dehors
   ✅ Menu se ferme
```

### Test 7 : Responsive Breakpoints ✅
```
Tester différentes largeurs :

1. 1920px (grand écran)
   ✅ Tout visible, espacé
   ✅ Navigation complète

2. 1024px (tablette paysage)
   ✅ Version desktop
   ✅ Navigation complète

3. 768px (tablette portrait)
   ✅ Version desktop limite

4. 767px
   ✅ Bascule en version mobile
   ✅ Menu burger visible

5. 375px (iPhone)
   ✅ Logo abrégé
   ✅ Menu burger fonctionnel
```

---

## 🎨 Tests Visuels

### Test 8 : Couleurs et États ✅
```
1. Survol des liens navigation
   ✅ Fond gris clair au hover
   ✅ Transition fluide

2. Route active
   ✅ Fond bleu clair (bg-blue-100)
   ✅ Texte bleu foncé (text-blue-700)

3. Avatar dans dropdown
   ✅ Couleur de fond basée sur l'UID
   ✅ Initiales blanches centrées

4. Badge rôle
   ✅ Admin : Rouge (destructive)
   ✅ Responsable : Violet (bg-purple-600)
   ✅ Bénévole : Bleu (bg-blue-600)

5. Bouton déconnexion
   ✅ Texte rouge (text-red-600)
   ✅ Fond rouge clair au hover (hover:bg-red-50)
```

### Test 9 : Typographie ✅
```
✅ Logo : text-xl font-bold
✅ Navigation : text-sm font-medium
✅ Nom utilisateur : text-sm font-medium
✅ Email : text-xs text-gray-500
✅ Badge rôle : text-xs
```

### Test 10 : Espacement ✅
```
✅ Header height : 64px (h-16)
✅ Padding container : px-4
✅ Gap entre liens : gap-1 (4px)
✅ Padding liens : px-4 py-2
✅ Avatar size : 40px (h-10 w-10)
```

---

## 🔐 Tests Sécurité

### Test 11 : Protection Routes ✅
```
1. Se déconnecter
2. Essayer d'accéder à /dashboard
   ✅ Redirection vers /auth/login
   ✅ Header non affiché

3. Se reconnecter en tant que bénévole
4. Vérifier que "Nouvelle mission" est caché
5. Essayer d'accéder directement à /dashboard/missions/new
   ✅ Protection middleware (à vérifier)
```

### Test 12 : Filtrage Navigation ✅
```
Créer 3 comptes :
1. Bénévole : jean@example.com
2. Responsable : marie@example.com  
3. Admin : admin@example.com

Pour chaque compte, vérifier :
✅ Navigation filtrée correctement
✅ Pas d'accès aux menus interdits
✅ Badge rôle correct
```

---

## 🚀 Tests Performance

### Test 13 : Temps de Chargement ✅
```
1. Ouvrir DevTools > Network
2. Recharger /dashboard

Résultat attendu :
✅ Header render < 50ms
✅ Pas de layout shift (CLS = 0)
✅ Avatar chargé rapidement
```

### Test 14 : Re-renders ✅
```
1. Ouvrir React DevTools
2. Activer "Highlight updates"
3. Naviguer entre les pages

Résultat attendu :
✅ Header ne re-render pas inutilement
✅ Seule la route active change
```

---

## 🐛 Tests Edge Cases

### Test 15 : Utilisateur sans Photo ✅
```
1. Créer un compte sans Google Sign-In
   ✅ Initiales générées correctement
   ✅ Couleur de fond aléatoire mais cohérente
```

### Test 16 : Nom Très Long ✅
```
1. Créer un utilisateur "Jean-Baptiste-Alexandre Dupont-Durand"
   ✅ Initiales : "JD" (premier + dernier nom)
   ✅ Nom tronqué si nécessaire dans le dropdown
```

### Test 17 : Navigation Rapide ✅
```
1. Cliquer rapidement sur plusieurs liens
   ✅ Pas d'erreur console
   ✅ Navigation fluide
   ✅ Route active se met à jour correctement
```

### Test 18 : Menu Burger Multiples Ouvertures ✅
```
1. Ouvrir/fermer le menu burger 10 fois rapidement
   ✅ Pas d'erreur
   ✅ Animation fluide
   ✅ Overlay fonctionne toujours
```

---

## ✅ Checklist Complète

### Fonctionnalités
- [ ] Logo cliquable → /dashboard
- [ ] Navigation filtrée par rôle
- [ ] Route active indiquée
- [ ] Menu dropdown fonctionnel
- [ ] Menu burger mobile
- [ ] Déconnexion opérationnelle
- [ ] Page profil accessible

### Responsive
- [ ] Desktop (≥768px) : Navigation horizontale
- [ ] Mobile (<768px) : Menu burger
- [ ] Transitions fluides
- [ ] Pas de layout shift

### Design
- [ ] Couleurs cohérentes
- [ ] Typographie lisible
- [ ] Espacements corrects
- [ ] Hover states visibles
- [ ] Badge rôle coloré

### Performance
- [ ] Render rapide (< 50ms)
- [ ] Pas de re-renders inutiles
- [ ] Avatar chargé vite
- [ ] Navigation fluide

### Sécurité
- [ ] Navigation filtrée
- [ ] Déconnexion sécurisée
- [ ] Routes protégées
- [ ] Pas d'erreurs console

---

## 📸 Screenshots Attendus

### Desktop
```
┌─────────────────────────────────────────────────────┐
│ 🎬 Festival Bénévoles                               │
│                                                      │
│ [Tableau de bord] [Missions] [+Nouvelle]       👤  │
│                    ━━━━━━━                          │
│                   (bleu = actif)                    │
└─────────────────────────────────────────────────────┘
```

### Mobile
```
┌──────────────────────────┐
│ 🎬 FB              ☰    │
└──────────────────────────┘

(Menu burger ouvert)
┌──────────────────────────┐
│ 👤 Jean Dupont          │
│    jean@example.com     │
│    Bénévole             │
├──────────────────────────┤
│ 🏠 Tableau de bord      │
│ 📋 Missions             │
├──────────────────────────┤
│ 👤 Mon profil           │
├──────────────────────────┤
│ 🚪 Se déconnecter       │
└──────────────────────────┘
```

---

## 🎯 Critères de Succès

**Header validé si** :
- ✅ Tous les tests passent sans erreur
- ✅ Responsive parfait mobile/desktop
- ✅ Navigation intuitive
- ✅ Déconnexion fonctionne
- ✅ Pas d'erreur console
- ✅ Performance optimale

---

**📝 Résultats à Reporter**

Pour chaque test, noter :
- ✅ **Succès** : Fonctionne comme attendu
- ⚠️ **Attention** : Fonctionne mais amélioration possible
- ❌ **Échec** : Ne fonctionne pas, à corriger

**Bon test ! 🚀**

