# ⚡ Test Rapide du Header - 5 Minutes

**Ouvrez l'application** : [http://localhost:3000](http://localhost:3000)

---

## ✅ Test 1 : Header Desktop (30 secondes)

1. **Connectez-vous** à l'application
2. **Vérifiez** que vous voyez :
   ```
   ┌─────────────────────────────────────────────────────┐
   │ 🎬 Festival  [Tableau de bord] [Missions]  [Avatar]│
   └─────────────────────────────────────────────────────┘
   ```
3. **Cliquez** sur l'avatar (👤) en haut à droite
4. **Résultat attendu** :
   - ✅ Menu déroulant s'ouvre
   - ✅ Votre nom/email sont affichés
   - ✅ Bouton "Se déconnecter" visible en rouge

---

## ✅ Test 2 : Navigation (30 secondes)

1. **Cliquez** sur "Missions" dans le header
2. **Résultat attendu** :
   - ✅ "Missions" devient bleu (actif)
   - ✅ Redirection vers `/dashboard/missions`

3. **Cliquez** sur "Tableau de bord"
4. **Résultat attendu** :
   - ✅ "Tableau de bord" devient bleu
   - ✅ Retour au dashboard

---

## ✅ Test 3 : Mobile (1 minute)

1. **Ouvrez DevTools** (`F12`)
2. **Activez** le mode responsive (`Ctrl+Shift+M`)
3. **Sélectionnez** "iPhone 12 Pro" ou similaire
4. **Résultat attendu** :
   ```
   ┌───────────────────────┐
   │ 🎬 FB          ☰     │
   └───────────────────────┘
   ```
   - ✅ Logo abrégé "FB"
   - ✅ Menu burger (☰) visible

5. **Cliquez** sur le menu burger (☰)
6. **Résultat attendu** :
   - ✅ Panneau latéral s'ouvre de la droite
   - ✅ Votre profil en haut
   - ✅ Liste des menus
   - ✅ Bouton "Se déconnecter" en rouge

7. **Cliquez** sur "Missions"
   - ✅ Menu se ferme automatiquement
   - ✅ Navigation vers les missions

---

## ✅ Test 4 : Profil Utilisateur (1 minute)

1. **Cliquez** sur l'avatar (👤)
2. **Cliquez** sur "Mon profil"
3. **Résultat attendu** :
   - ✅ Redirection vers `/dashboard/profile`
   - ✅ Vos informations affichées :
     - Nom complet
     - Email
     - Téléphone
     - Badge rôle coloré
     - Date de création du compte
     - Consentements RGPD

---

## ✅ Test 5 : Déconnexion (30 secondes)

1. **Cliquez** sur l'avatar (👤)
2. **Cliquez** sur "Se déconnecter" (rouge)
3. **Résultat attendu** :
   - ✅ Déconnexion immédiate
   - ✅ Redirection vers `/auth/login`
   - ✅ Header n'est plus visible

---

## 🎯 Résultat du Test

**Cochez si tout fonctionne** :

- [ ] Header visible sur toutes les pages dashboard
- [ ] Navigation fonctionne (changement de page)
- [ ] Route active en bleu
- [ ] Menu utilisateur (dropdown) fonctionne
- [ ] Page profil accessible
- [ ] Menu burger mobile fonctionne
- [ ] Déconnexion opérationnelle
- [ ] Pas d'erreurs console (`F12` > Console)

---

## ❌ En cas de Problème

### Le header ne s'affiche pas
```bash
# Vérifier que le serveur tourne
npm run dev

# Recharger la page
Ctrl+R ou F5
```

### "Module not found" dans la console
```bash
# Arrêter le serveur (Ctrl+C)
# Redémarrer
npm run dev
```

### Le menu burger ne s'ouvre pas
1. Vérifier la largeur de la fenêtre (< 768px)
2. Ouvrir la console (`F12`) pour voir les erreurs

### Erreur de redirection
1. Vider le cache (`Ctrl+Shift+R`)
2. Se déconnecter/reconnecter

---

## 📊 Rapport de Test

**Date** : _____________  
**Testeur** : _____________  

**Résultat Global** :
- ✅ Tous les tests passent
- ⚠️ Quelques problèmes mineurs (préciser)
- ❌ Problèmes majeurs (préciser)

**Commentaires** :
___________________________________
___________________________________
___________________________________

---

**⏱️ Temps total : 5 minutes**

**Si tous les tests passent = Header validé ! 🎉**

