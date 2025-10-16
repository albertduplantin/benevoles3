# 🚀 Session Beta Test - Plan d'Action Immédiat

**Date** : Aujourd'hui  
**Durée** : 60-90 minutes  
**Testeurs** : 2 personnes (1 PC + 1 Mobile)

---

## 📱 QUI TESTE QUOI ?

### **👨‍💻 TESTEUR 1 - SUR PC**
**Focus** : Fonctionnalités admin et expérience desktop
- ✅ Installation PWA sur Windows/Mac
- ✅ Création et gestion des missions
- ✅ Exports PDF/Excel
- ✅ Interface d'administration
- ✅ Navigation générale

### **📱 TESTEUR 2 - SUR MOBILE**
**Focus** : Expérience mobile et responsive
- ✅ Installation PWA sur téléphone
- ✅ Responsive design
- ✅ Menu burger et navigation tactile
- ✅ Mode hors ligne (mode avion)
- ✅ Inscriptions aux missions

---

## ⚡ PRÉPARATION RAPIDE (10 min)

### 1️⃣ **Vérifier que l'app est accessible**

**URL** : Quelle est votre URL de déploiement ?
- Si sur Vercel : `https://votre-app.vercel.app`
- Si local : `http://localhost:3000`

### 2️⃣ **Créer un compte admin pour vous**

Si pas encore fait :
1. Ouvrir l'app
2. S'inscrire avec votre email
3. Aller dans Firebase Console → Firestore → `users`
4. Modifier votre `role` : `volunteer` → `admin`

### 3️⃣ **Créer 3-5 missions de test**

Se connecter en admin et créer rapidement :

**Mission 1 - URGENTE** :
- Titre : "Accueil soirée d'ouverture"
- Date : Dans 2 jours, 18h-22h
- Lieu : "Théâtre des Jacobins"
- Places : 5
- ✅ Urgent
- Statut : Publiée

**Mission 2 - Normale** :
- Titre : "Service bar"
- Date : Dans 3 jours, 20h-00h
- Lieu : "Bar du festival"
- Places : 8
- Statut : Publiée

**Mission 3 - Peu de places** :
- Titre : "Réseaux sociaux"
- Date : Dans 4 jours, 10h-18h
- Lieu : "Bureau festival"
- Places : 2
- Statut : Publiée

### 4️⃣ **Imprimer les guides**

Imprimer 2 copies (ou avoir sur tablette) :
- [ ] Guide Desktop (page 2 de ce document)
- [ ] Guide Mobile (page 3 de ce document)

---

## 📋 DÉROULEMENT DE LA SESSION

### **Introduction (5 min)**

**Leur dire** :
> "Vous allez tester une app de gestion de bénévoles pour un festival de cinéma.
> 
> **Testeur PC** : Tu vas découvrir l'app en tant qu'admin et tester les fonctionnalités avancées.
> 
> **Testeur Mobile** : Tu vas tester l'app en tant que bénévole sur téléphone et essayer de l'installer.
> 
> Soyez critiques ! Notez tout ce qui vous gêne, même les petits détails. Il n'y a pas de mauvais retours."

**Donner** :
- L'URL de l'app
- Le guide imprimé ou sur tablette
- Un stylo pour noter

### **Phase de Test (45-60 min)**

Les deux testeurs suivent leur guide en parallèle.

**Vous** → Restez en retrait et observez. Prenez des notes :
- ⏱️ Temps pour chaque tâche
- 🤔 Moments d'hésitation
- ❌ Erreurs rencontrées
- 💬 Commentaires à voix haute

**N'intervenez que si vraiment bloqué (après 2 min)**

### **Debriefing (15-20 min)**

Questions rapides :

**Général** :
- Note sur 10 pour la facilité d'utilisation ?
- Ce que vous avez préféré ?
- Ce qui vous a agacé ?

**Design** :
- Le design est moderne ? Professionnel ?
- Les couleurs sont agréables ?

**Fonctionnalités** :
- Qu'est-ce qui manque ?
- Qu'est-ce qui est inutile ?

**Bugs** :
- Récapituler tous les bugs trouvés

---

---

## 🖥️ GUIDE TESTEUR PC (30-45 min)

### **📋 INFORMATIONS**

**URL** : _________________________  
**Email de test** : `pc.testeur@test.com`  
**Créer votre propre mot de passe** lors de l'inscription

---

### **✅ ÉTAPE 1 : Inscription (5 min)**

**Tâche** : Créer un compte

- [ ] Ouvrir l'URL dans Chrome
- [ ] Cliquer "Créer un compte" ou "S'inscrire"
- [ ] Remplir le formulaire :
  - Prénom : TesteurPC
  - Nom : Desktop
  - Email : pc.testeur@test.com
  - Téléphone : 06 12 34 56 78
  - Mot de passe : (minimum 6 caractères)
  - ✅ Cocher les cases RGPD
- [ ] S'inscrire

**❓ Problèmes rencontrés ?**
```
_______________________________________________
```

**⏱️ Temps** : ___ min

---

### **✅ ÉTAPE 2 : Découverte Dashboard (3 min)**

- [ ] Observer le tableau de bord
- [ ] Vérifier les 3 cartes statistiques en haut
- [ ] Vérifier que le calendrier s'affiche

**📝 Première impression (note /10)** : ___/10

**💬 Commentaire** :
```
_______________________________________________
```

---

### **✅ ÉTAPE 3 : Navigation (3 min)**

- [ ] Cliquer sur "Missions" dans le menu
- [ ] Vérifier que des missions s'affichent
- [ ] Cliquer sur votre avatar (coin supérieur droit)
- [ ] Vérifier le menu déroulant (profil, déconnexion)
- [ ] Aller dans "Mon profil"

**✅ Navigation fluide ?** : Oui ❌ / Non ❌

---

### **✅ ÉTAPE 4 : Inscription à une mission (5 min)**

- [ ] Retourner dans "Missions"
- [ ] Utiliser la **barre de recherche** (taper "bar" ou autre mot)
- [ ] **Recherche fonctionne ?** : Oui ❌ / Non ❌
- [ ] Cliquer sur une mission pour voir les détails
- [ ] Lire toutes les informations
- [ ] Cliquer "S'inscrire" ou "Je m'inscris"
- [ ] Vérifier le message de confirmation (toast vert)
- [ ] Retourner à la liste
- [ ] **Badge "Inscrit" visible ?** : Oui ❌ / Non ❌

**❓ Problèmes ?**
```
_______________________________________________
```

---

### **✅ ÉTAPE 5 : Calendrier (5 min)**

- [ ] Retourner au "Tableau de bord"
- [ ] Observer le calendrier
- [ ] Vérifier que votre mission apparaît
- [ ] Utiliser les boutons :
  - [ ] "Aujourd'hui"
  - [ ] Mois précédent ◀
  - [ ] Mois suivant ▶
- [ ] Cliquer sur votre mission dans le calendrier

**✅ Navigation calendrier fluide ?** : Oui ❌ / Non ❌

**💬 Le calendrier est-il clair ?** (note /5) : ___/5

---

### **✅ ÉTAPE 6 : Devenir Admin (TEST SPÉCIAL)**

**⚠️ Cette étape nécessite votre aide**

Demandez à l'organisateur de :
1. Ouvrir Firebase Console
2. Modifier votre rôle → `admin`
3. Vous demander de rafraîchir la page (F5)

- [ ] Rafraîchir la page
- [ ] **Vérifier** : Nouvelles options d'admin apparaissent ?
- [ ] **Vérifier** : Bouton "Nouvelle mission" visible ?

---

### **✅ ÉTAPE 7 : Créer une mission (ADMIN) (10 min)**

- [ ] Aller dans "Missions"
- [ ] Cliquer "Nouvelle mission"
- [ ] Remplir le formulaire :
  - Titre : "Test - Mission PC"
  - Description : "Mission créée par le testeur PC"
  - Type : "Planifiée"
  - Date début : Demain à 14h00
  - Date fin : Demain à 16h00
  - Lieu : "Lieu de test"
  - Nombre de bénévoles : 3
  - Mission urgente : ✅ Oui
  - Statut : Publiée
- [ ] Cliquer "Créer" ou "Enregistrer"

**✅ Mission créée avec succès ?** : Oui ❌ / Non ❌

**💬 Difficulté du formulaire** (note /5) : ___/5

**❓ Problèmes ?**
```
_______________________________________________
```

---

### **✅ ÉTAPE 8 : Installation PWA (5 min)**

- [ ] Rester sur le dashboard pendant 10 secondes
- [ ] Observer si un **banner bleu** apparaît en bas à droite
- [ ] **Banner apparu ?** : Oui ❌ / Non ❌ (après ___ sec)

**Si le banner apparaît** :
- [ ] Cliquer "Installer"
- [ ] Accepter l'installation
- [ ] **Une nouvelle fenêtre s'ouvre ?** : Oui ❌ / Non ❌
- [ ] **Icône visible** dans la barre des tâches ? : Oui ❌ / Non ❌
- [ ] Fermer l'app → Rouvrir depuis l'icône
- [ ] **Réouverture fonctionne ?** : Oui ❌ / Non ❌

**Si pas de banner** :
```
Pas grave, noter : Banner d'installation non apparu
```

---

### **✅ ÉTAPE 9 : Export Planning (3 min)**

- [ ] Aller au "Tableau de bord"
- [ ] Chercher le bouton "Exporter mon planning" ou "Export"
- [ ] **Bouton trouvé facilement ?** : Oui ❌ / Non ❌
- [ ] Cliquer dessus
- [ ] Choisir "Export PDF"
- [ ] Ouvrir le fichier téléchargé
- [ ] **PDF lisible et correct ?** : Oui ❌ / Non ❌

---

### **📊 ÉVALUATION GLOBALE PC**

| Critère | Note /10 |
|---------|----------|
| Design général | ___ |
| Facilité d'utilisation | ___ |
| Navigation | ___ |
| Performance (rapidité) | ___ |
| Installation PWA | ___ |
| **TOTAL** | **___/50** |

### **💬 COMMENTAIRES GÉNÉRAUX**

**👍 Points positifs** :
```
_______________________________________________
_______________________________________________
```

**👎 Points à améliorer** :
```
_______________________________________________
_______________________________________________
```

**🐛 Bugs rencontrés** :
```
_______________________________________________
_______________________________________________
```

---

---

## 📱 GUIDE TESTEUR MOBILE (30-45 min)

### **📋 INFORMATIONS**

**URL** : _________________________  
**Email de test** : `mobile.testeur@test.com`  
**Créer votre propre mot de passe** lors de l'inscription

**Appareil** :
- Marque/Modèle : ________________
- OS : Android ❌ / iOS ❌
- Navigateur : Chrome ❌ / Safari ❌

---

### **✅ ÉTAPE 1 : Inscription Mobile (5 min)**

**Tâche** : Créer un compte depuis votre téléphone

- [ ] Ouvrir l'URL dans votre navigateur mobile
- [ ] Observer l'affichage (responsive)
- [ ] **Page lisible sur mobile ?** : Oui ❌ / Non ❌
- [ ] Cliquer "Créer un compte" ou "S'inscrire"
- [ ] Remplir le formulaire :
  - Prénom : TesteurMobile
  - Nom : Phone
  - Email : mobile.testeur@test.com
  - Téléphone : 06 98 76 54 32
  - Mot de passe : (minimum 6 caractères)
  - ✅ Cocher RGPD
- [ ] S'inscrire
- [ ] **Clavier s'adapte ?** (@ pour email, chiffres pour tel) : Oui ❌ / Non ❌

**⏱️ Temps** : ___ min

**❓ Problèmes ?**
```
_______________________________________________
```

---

### **✅ ÉTAPE 2 : Menu Burger (3 min)**

- [ ] Observer le **header** en haut de l'écran
- [ ] Chercher l'icône menu (☰ ou trois barres)
- [ ] **Icône trouvée facilement ?** : Oui ❌ / Non ❌
- [ ] Cliquer dessus
- [ ] **Menu latéral s'ouvre ?** : Oui ❌ / Non ❌
- [ ] Cliquer sur chaque item :
  - [ ] Tableau de bord
  - [ ] Missions
  - [ ] Mon Profil
- [ ] **Menu facile à utiliser ?** (note /5) : ___/5

**💬 Le menu est-il intuitif ?**
```
_______________________________________________
```

---

### **✅ ÉTAPE 3 : Missions sur Mobile (7 min)**

- [ ] Aller dans "Missions"
- [ ] Scroller la liste
- [ ] **Cartes lisibles sur mobile ?** : Oui ❌ / Non ❌
- [ ] **Texte assez grand ?** : Oui ❌ / Non ❌
- [ ] Utiliser la **barre de recherche**
- [ ] **Recherche facile à utiliser ?** : Oui ❌ / Non ❌
- [ ] Cliquer sur une mission pour voir les détails
- [ ] **Tout est lisible ?** (pas de texte coupé) : Oui ❌ / Non ❌
- [ ] Cliquer "S'inscrire" ou "Je m'inscris"
- [ ] Vérifier le message de confirmation
- [ ] Retourner à la liste
- [ ] **Badge "Inscrit" visible ?** : Oui ❌ / Non ❌

**💬 Expérience mobile** (note /5) : ___/5

**❓ Problèmes ?**
```
_______________________________________________
```

---

### **✅ ÉTAPE 4 : Calendrier Mobile (5 min)**

- [ ] Retourner au "Tableau de bord"
- [ ] Observer le **calendrier**
- [ ] **Calendrier adapté au mobile ?** : Oui ❌ / Non ❌
- [ ] Utiliser les boutons de navigation (◀ ▶)
- [ ] **Boutons assez grands ?** (facile à cliquer) : Oui ❌ / Non ❌
- [ ] Cliquer sur votre mission dans le calendrier
- [ ] **Détails s'affichent correctement ?** : Oui ❌ / Non ❌

**💬 Calendrier sur mobile** (note /5) : ___/5

---

### **✅ ÉTAPE 5 : Installation PWA (10 min)**

#### **Option A : Android (Chrome)**

- [ ] Rester sur le dashboard pendant 10 secondes
- [ ] Observer un **banner** en bas de l'écran
- [ ] **Banner apparu ?** : Oui ❌ / Non ❌
- [ ] Lire le message
- [ ] Cliquer "Installer"
- [ ] Accepter l'installation
- [ ] Chercher l'**icône** sur l'écran d'accueil
- [ ] **Icône 🎬 visible ?** : Oui ❌ / Non ❌
- [ ] Ouvrir l'app depuis l'icône
- [ ] **App s'ouvre en plein écran ?** (sans barre d'adresse) : Oui ❌ / Non ❌

#### **Option B : iOS (Safari)**

- [ ] Cliquer sur l'icône **Partager** (en bas au centre)
- [ ] Scroller et choisir **"Sur l'écran d'accueil"**
- [ ] Nommer l'app : "Festival Dinan"
- [ ] Ajouter
- [ ] Chercher l'**icône** sur l'écran d'accueil
- [ ] **Icône visible ?** : Oui ❌ / Non ❌
- [ ] Ouvrir l'app depuis l'icône

**💬 Installation PWA** (note /5) : ___/5

**❓ Problèmes ?**
```
_______________________________________________
```

---

### **✅ ÉTAPE 6 : Mode Hors Ligne (5 min)**

**TEST IMPORTANT**

- [ ] Activer le **mode avion** sur votre téléphone
- [ ] Rouvrir l'app
- [ ] Observer un **message** en bas (toast rouge "Hors ligne")
- [ ] **Message apparu ?** : Oui ❌ / Non ❌
- [ ] Essayer de naviguer dans l'app
- [ ] **L'app fonctionne partiellement hors ligne ?** : Oui ❌ / Non ❌
- [ ] Désactiver le mode avion
- [ ] Observer un **toast vert** "Connexion rétablie"
- [ ] **Reconnexion détectée ?** : Oui ❌ / Non ❌

**✅ Mode hors ligne fonctionne bien ?** : Oui ❌ / Non ❌

---

### **✅ ÉTAPE 7 : Orientation & Responsive (3 min)**

- [ ] Utiliser le téléphone en **portrait** (vertical)
- [ ] Naviguer dans toute l'app
- [ ] **Tout s'affiche correctement ?** : Oui ❌ / Non ❌
- [ ] Tourner le téléphone en **paysage** (horizontal)
- [ ] Observer le dashboard, les missions, le calendrier
- [ ] **Layout adapté au paysage ?** : Oui ❌ / Non ❌

**❓ Problèmes en paysage ?**
```
_______________________________________________
```

---

### **✅ ÉTAPE 8 : Tailles et Tactile (3 min)**

- [ ] Essayer de cliquer sur tous les **boutons**
- [ ] **Tous les boutons sont assez grands ?** : Oui ❌ / Non ❌
- [ ] **Boutons trop petits** (noter lesquels) :
```
_______________________________________________
```

- [ ] Vérifier que le **texte est lisible** partout
- [ ] **Texte trop petit quelque part ?** (noter où) :
```
_______________________________________________
```

---

### **✅ ÉTAPE 9 : Performance (2 min)**

- [ ] Rafraîchir la page d'accueil
- [ ] **Temps de chargement ressenti** : Rapide ❌ / Moyen ❌ / Lent ❌
- [ ] Scroller dans la liste des missions
- [ ] **Scroll fluide ?** : Oui ❌ / Non ❌
- [ ] Ouvrir plusieurs pages rapidement
- [ ] **Transitions fluides ?** : Oui ❌ / Non ❌

---

### **📊 ÉVALUATION GLOBALE MOBILE**

| Critère | Note /10 |
|---------|----------|
| Design responsive | ___ |
| Facilité d'utilisation mobile | ___ |
| Menu burger | ___ |
| Performance | ___ |
| Installation PWA | ___ |
| **TOTAL** | **___/50** |

### **💬 COMMENTAIRES GÉNÉRAUX**

**👍 Points positifs** :
```
_______________________________________________
_______________________________________________
```

**👎 Points à améliorer** :
```
_______________________________________________
_______________________________________________
```

**🐛 Bugs rencontrés** :
```
_______________________________________________
_______________________________________________
```

---

---

## 🎯 APRÈS LA SESSION

### **1. Récupérer les retours**

- [ ] Rassembler les 2 guides complétés
- [ ] Compiler tous les bugs dans un document
- [ ] Classer par priorité :
  - 🔴 **Bloquant** → Empêche l'utilisation
  - 🟠 **Important** → Gêne l'expérience
  - 🟡 **Moyen** → Amélioration souhaitable
  - 🟢 **Mineur** → Nice to have

### **2. Créer la liste des corrections**

Créer un fichier `BUGS_BETA_[DATE].md` avec :

```markdown
# 🐛 Retours Beta Test - [Date]

## 🔴 Bugs Bloquants
- [ ] Bug 1 : Description détaillée
- [ ] Bug 2 : Description détaillée

## 🟠 Bugs Importants
- [ ] Bug 3 : Description

## 🟡 Améliorations UX
- [ ] Amélioration 1 : Description

## 💡 Idées Nouvelles Fonctionnalités
- [ ] Idée 1 : Description
```

### **3. Remercier vos testeurs !**

> "Merci beaucoup pour votre temps et vos retours ! Vos remarques vont vraiment aider à améliorer l'application. 🙏"

**Optionnel** :
- Leur offrir un café/boisson
- Les inviter au festival
- Leur montrer les corrections une fois faites

---

## ✅ CHECKLIST AVANT DE COMMENCER

**Dernière vérification (5 min avant)** :

- [ ] App accessible (URL fonctionne)
- [ ] Au moins 3 missions créées et publiées
- [ ] 2 guides imprimés ou sur tablette
- [ ] Stylos pour noter
- [ ] PC avec Chrome ouvert
- [ ] Mobile avec Chrome ou Safari
- [ ] Connexion Internet stable
- [ ] Vous êtes admin dans l'app

---

## 💡 CONSEILS PENDANT LA SESSION

### **✅ À FAIRE**
- Rester en retrait et observer
- Prendre des notes détaillées
- Encourager la critique constructive
- Ne pas intervenir sauf si vraiment bloqué (2+ min)
- Remercier pour chaque retour

### **❌ À ÉVITER**
- Se justifier ("Oui mais c'est normal parce que...")
- Minimiser les problèmes ("C'est pas grave")
- Guider ("Non, clique là")
- Prendre la défense du code
- Interrompre pendant les tests

---

**🚀 Bonne session de test ! Vos retours seront précieux ! 🎬**



