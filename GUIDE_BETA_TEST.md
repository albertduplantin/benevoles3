# 🧪 Guide de Beta Test - Festival Films Courts de Dinan

**Date** : 4 octobre 2025  
**Version** : v1.0 PWA  
**Durée estimée** : 30-45 minutes par testeur

---

## 👥 Répartition des Tests

### **🖥️ Beta Testeur 1 - Tests Desktop (PC)**
- Parcours utilisateur complet sur ordinateur
- Installation PWA sur Windows/Mac
- Navigation et fonctionnalités avancées
- Tests de performance

### **📱 Beta Testeur 2 - Tests Mobile (Smartphone)**
- Parcours utilisateur sur mobile
- Installation PWA sur Android/iOS
- Responsive design
- Mode hors ligne

---

## 🖥️ **BETA TESTEUR 1 - TESTS DESKTOP**

### **📋 Informations de connexion**

**URL de test** : https://benevoles3.vercel.app  
*(ou l'URL Vercel fournie)*

**Compte de test** :
- Email : `beta1@test.com`
- Mot de passe : *(à créer lors de l'inscription)*

---

### **✅ PHASE 1 : Inscription et Profil (10 min)**

#### **Test 1.1 - Première visite**
- [ ] Ouvrir l'URL dans **Chrome** (recommandé)
- [ ] Vérifier que la page d'accueil s'affiche correctement
- [ ] Observer le design (note sur 10) : ___/10
- [ ] Commentaires sur la page d'accueil :

```
_________________________________________
_________________________________________
```

#### **Test 1.2 - Inscription**
- [ ] Cliquer sur **"Créer un compte"**
- [ ] Remplir le formulaire :
  - Prénom : Beta
  - Nom : Testeur1
  - Email : beta1@test.com
  - Mot de passe : (minimum 6 caractères)
  - ✅ Cocher les consentements RGPD
- [ ] Cliquer sur **"S'inscrire"**
- [ ] **Problème rencontré ?** Si oui, décrire :

```
_________________________________________
```

#### **Test 1.3 - Complétion du profil**
- [ ] Ajouter votre numéro de téléphone : `06 XX XX XX XX`
- [ ] Cliquer sur **"Continuer"**
- [ ] Vérifier la redirection vers le dashboard

**⏱️ Temps total pour l'inscription** : ___ minutes

---

### **✅ PHASE 2 : Navigation et Interface (10 min)**

#### **Test 2.1 - Header et Menu**
- [ ] Vérifier que le **header** est affiché en haut
- [ ] Cliquer sur chaque menu :
  - [ ] Tableau de bord
  - [ ] Missions
- [ ] Cliquer sur votre **avatar** (coin supérieur droit)
- [ ] Vérifier le menu déroulant (profil, déconnexion)
- [ ] **Navigation fluide ?** ⭐ ___/5

#### **Test 2.2 - Tableau de bord**
- [ ] Observer les **3 cartes statistiques** en haut
- [ ] Vérifier que le **calendrier** s'affiche
- [ ] Vérifier la présence du bouton **"Exporter mon planning"**
- [ ] **Design du dashboard** : ⭐ ___/5
- [ ] **Commentaires** :

```
_________________________________________
```

---

### **✅ PHASE 3 : Missions (15 min)**

#### **Test 3.1 - Liste des missions**
- [ ] Aller dans **"Missions"**
- [ ] Vérifier que des missions s'affichent
- [ ] Utiliser la **barre de recherche** (taper "accueil")
- [ ] Tester les **filtres** :
  - [ ] Filtre par statut (Publiée)
  - [ ] Filtre par catégorie
  - [ ] Filtre par date
- [ ] **Filtres fonctionnent ?** Oui ❌ Non ❌
- [ ] **Problèmes rencontrés** :

```
_________________________________________
```

#### **Test 3.2 - Inscription à une mission**
- [ ] Choisir une mission **"Publiée"**
- [ ] Cliquer dessus pour voir les détails
- [ ] Lire toutes les informations (lieu, date, description)
- [ ] Cliquer sur **"S'inscrire"**
- [ ] Vérifier le message de confirmation
- [ ] Retourner à la liste → Observer le badge **"Inscrit"** vert
- [ ] **Badge visible ?** Oui ❌ Non ❌

#### **Test 3.3 - Voir les autres participants**
- [ ] Retourner sur la mission où vous êtes inscrit
- [ ] Scroller en bas → Section **"Participants"**
- [ ] Vérifier que vous apparaissez dans la liste
- [ ] **Informations affichées** :
  - [ ] Nom
  - [ ] Email
  - [ ] Téléphone

#### **Test 3.4 - Désinscription**
- [ ] Sur la page de détail de la mission
- [ ] Cliquer sur **"Se désinscrire"**
- [ ] Confirmer
- [ ] Vérifier que le badge **"Inscrit"** disparaît
- [ ] **Se réinscrire** à la même mission
- [ ] **Désinscription fonctionne ?** Oui ❌ Non ❌

---

### **✅ PHASE 4 : Calendrier (5 min)**

#### **Test 4.1 - Visualisation**
- [ ] Retourner au **Tableau de bord**
- [ ] Observer le calendrier
- [ ] Vérifier que votre mission apparaît
- [ ] Observer les **badges** :
  - 🟢 Vert = Inscrit
  - 🔵 Bleu = Responsable
- [ ] Cliquer sur les **boutons de navigation** :
  - [ ] Aujourd'hui
  - [ ] Mois précédent
  - [ ] Mois suivant
- [ ] **Navigation calendrier fluide ?** Oui ❌ Non ❌

#### **Test 4.2 - Légende**
- [ ] Vérifier la présence de la **légende** sous le calendrier
- [ ] **Légende claire ?** Oui ❌ Non ❌

---

### **✅ PHASE 5 : Profil et Paramètres (5 min)**

#### **Test 5.1 - Mon Profil**
- [ ] Cliquer sur votre **avatar** → **"Mon profil"**
- [ ] Vérifier toutes les informations affichées :
  - [ ] Nom complet
  - [ ] Email
  - [ ] Téléphone
  - [ ] Rôle (Bénévole)
  - [ ] Date d'inscription
- [ ] Observer les **consentements RGPD**
- [ ] **Essayer de changer** :
  - [ ] Switch "Communications" → Activer/Désactiver
  - [ ] Switch "Notifications par email"
  - [ ] Switch "Notifications par SMS"
- [ ] Vérifier le **toast de confirmation** après chaque changement
- [ ] **Switches fonctionnent ?** Oui ❌ Non ❌

---

### **✅ PHASE 6 : Installation PWA (10 min)**

#### **Test 6.1 - Banner d'installation**
- [ ] Rester sur la page pendant **5 secondes**
- [ ] Observer si un **banner bleu** apparaît en bas à droite
- [ ] **Banner apparu ?** Oui ❌ Non ❌ (après combien de temps ? ___ sec)
- [ ] Cliquer sur **"Installer"**
- [ ] Accepter l'installation

#### **Test 6.2 - Application installée**
- [ ] Vérifier qu'une **nouvelle fenêtre** s'ouvre
- [ ] Observer la barre de titre (pas d'adresse URL visible)
- [ ] Vérifier l'**icône** dans la barre des tâches (Windows) ou Dock (Mac)
- [ ] **Icône visible ?** 🎬 Oui ❌ Non ❌
- [ ] Fermer l'app → Rouvrir depuis l'icône
- [ ] **Réouverture fonctionne ?** Oui ❌ Non ❌

#### **Test 6.3 - Mode hors ligne (Chrome DevTools)**
- [ ] Ouvrir **DevTools** (F12)
- [ ] Aller dans l'onglet **"Network"**
- [ ] Cocher **"Offline"** en haut
- [ ] Rafraîchir la page (F5)
- [ ] Observer la **page "Hors ligne"** avec le message
- [ ] **Page offline s'affiche ?** Oui ❌ Non ❌
- [ ] Décocher "Offline" → Rafraîchir
- [ ] **Retour à la normale ?** Oui ❌ Non ❌

---

### **✅ PHASE 7 : Export Planning (5 min)**

#### **Test 7.1 - Export PDF**
- [ ] Aller au **Tableau de bord**
- [ ] Cliquer sur **"Exporter mon planning"**
- [ ] Choisir **"Export PDF"**
- [ ] Ouvrir le fichier téléchargé
- [ ] Vérifier que vos missions apparaissent
- [ ] **PDF lisible ?** Oui ❌ Non ❌

#### **Test 7.2 - Export Excel**
- [ ] Cliquer sur **"Exporter mon planning"**
- [ ] Choisir **"Export Excel"**
- [ ] Ouvrir le fichier avec Excel/LibreOffice
- [ ] Vérifier les données
- [ ] **Excel correct ?** Oui ❌ Non ❌

---

### **📊 Évaluation Globale Desktop**

| Critère | Note /10 |
|---------|----------|
| Design général | ___ |
| Facilité d'utilisation | ___ |
| Navigation | ___ |
| Performance (rapidité) | ___ |
| Installation PWA | ___ |
| **TOTAL** | **___/50** |

### **💬 Commentaires généraux**

**Points positifs** :
```
_________________________________________
_________________________________________
```

**Points à améliorer** :
```
_________________________________________
_________________________________________
```

**Bugs rencontrés** :
```
_________________________________________
_________________________________________
```

---
---

## 📱 **BETA TESTEUR 2 - TESTS MOBILE**

### **📋 Informations de connexion**

**URL de test** : https://benevoles3.vercel.app

**Compte de test** :
- Email : `beta2@test.com`
- Mot de passe : *(à créer lors de l'inscription)*

**Appareil utilisé** :
- Marque/Modèle : ________________
- OS : Android ❌ / iOS ❌
- Navigateur : Chrome ❌ / Safari ❌ / Autre : ______

---

### **✅ PHASE 1 : Inscription Mobile (10 min)**

#### **Test 1.1 - Première visite**
- [ ] Ouvrir l'URL dans votre navigateur mobile
- [ ] Vérifier l'affichage **responsive**
- [ ] Scroller de haut en bas
- [ ] **Page lisible sur mobile ?** ⭐ ___/5

#### **Test 1.2 - Inscription**
- [ ] Cliquer sur **"Créer un compte"**
- [ ] Remplir le formulaire (clavier mobile)
- [ ] **Clavier s'adapte ?** (@ pour email, chiffres pour tel) Oui ❌ Non ❌
- [ ] Cocher les consentements
- [ ] S'inscrire
- [ ] **Problème rencontré ?** :

```
_________________________________________
```

#### **Test 1.3 - Profil**
- [ ] Ajouter votre téléphone
- [ ] Continuer
- [ ] Arriver au dashboard

---

### **✅ PHASE 2 : Menu Burger Mobile (5 min)**

#### **Test 2.1 - Menu hamburger**
- [ ] Observer le **header** en haut
- [ ] Cliquer sur l'icône **"☰"** (burger menu) en haut à gauche
- [ ] Vérifier que le **menu latéral** s'ouvre
- [ ] Cliquer sur chaque item :
  - [ ] Tableau de bord
  - [ ] Missions
  - [ ] Mon Profil
  - [ ] Déconnexion
- [ ] **Menu responsive fonctionne ?** Oui ❌ Non ❌
- [ ] **Facile d'utilisation ?** ⭐ ___/5

#### **Test 2.2 - Avatar mobile**
- [ ] Cliquer sur votre **avatar** (coin supérieur droit)
- [ ] Vérifier le menu déroulant
- [ ] **Cliquable facilement ?** Oui ❌ Non ❌

---

### **✅ PHASE 3 : Missions Mobile (15 min)**

#### **Test 3.1 - Liste responsive**
- [ ] Aller dans **"Missions"**
- [ ] Scroller la liste
- [ ] Vérifier que les **cartes** s'affichent bien
- [ ] **Layout adapté au mobile ?** ⭐ ___/5

#### **Test 3.2 - Recherche mobile**
- [ ] Utiliser la **barre de recherche**
- [ ] Taper avec le clavier mobile
- [ ] **Recherche fonctionne ?** Oui ❌ Non ❌

#### **Test 3.3 - Filtres mobile**
- [ ] Ouvrir les **filtres**
- [ ] Tester chaque filtre
- [ ] **Filtres clairs sur mobile ?** Oui ❌ Non ❌

#### **Test 3.4 - Détail mission**
- [ ] Cliquer sur une mission
- [ ] Lire les détails
- [ ] **Tout est lisible ?** (pas de texte tronqué) Oui ❌ Non ❌
- [ ] **S'inscrire** à la mission
- [ ] Vérifier le badge **"Inscrit"**
- [ ] **Badge visible sur mobile ?** Oui ❌ Non ❌

---

### **✅ PHASE 4 : Calendrier Mobile (5 min)**

#### **Test 4.1 - Calendrier responsive**
- [ ] Aller au **Tableau de bord**
- [ ] Observer le **calendrier**
- [ ] **Calendrier adapté au mobile ?** Oui ❌ Non ❌
- [ ] Utiliser les boutons de navigation
- [ ] **Navigation fluide ?** Oui ❌ Non ❌
- [ ] Cliquer sur une mission dans le calendrier
- [ ] **Détails s'affichent ?** Oui ❌ Non ❌

#### **Test 4.2 - Gestures**
- [ ] Essayer de **swiper** (glisser) sur le calendrier
- [ ] **Swipe fonctionne ?** Oui ❌ Non ❌

---

### **✅ PHASE 5 : Installation PWA Mobile (15 min)**

#### **Test 5.1 - Banner mobile**
- [ ] Attendre **5 secondes** sur le dashboard
- [ ] Observer le **banner bleu** en bas de l'écran
- [ ] **Banner apparu ?** Oui ❌ Non ❌
- [ ] Lire le message
- [ ] **Message clair ?** Oui ❌ Non ❌

#### **Test 5.2 - Installation Android (Chrome)**
- [ ] Cliquer sur **"Installer"** dans le banner
- [ ] Accepter l'installation
- [ ] Vérifier l'**icône** sur l'écran d'accueil
- [ ] **Icône 🎬 visible ?** Oui ❌ Non ❌
- [ ] Ouvrir l'app depuis l'icône
- [ ] **App s'ouvre en fullscreen ?** (sans barre d'adresse) Oui ❌ Non ❌

**OU**

#### **Test 5.3 - Installation iOS (Safari)**
- [ ] Cliquer sur l'icône **Partager** (en bas)
- [ ] Choisir **"Sur l'écran d'accueil"**
- [ ] Nommer l'app : "Festival Dinan"
- [ ] Ajouter
- [ ] Vérifier l'**icône** sur l'écran d'accueil
- [ ] **Icône visible ?** Oui ❌ Non ❌
- [ ] Ouvrir l'app depuis l'icône

#### **Test 5.4 - Mode hors ligne mobile**
- [ ] Activer le **mode avion** sur votre téléphone
- [ ] Ouvrir l'app
- [ ] Observer le **toast rouge** "Hors ligne"
- [ ] Essayer de naviguer
- [ ] **Page offline s'affiche ?** Oui ❌ Non ❌
- [ ] Désactiver le mode avion
- [ ] Observer le **toast vert** "Connexion rétablie"
- [ ] **Reconnexion détectée ?** Oui ❌ Non ❌

---

### **✅ PHASE 6 : Responsive Design (10 min)**

#### **Test 6.1 - Orientation portrait**
- [ ] Utiliser le téléphone en **portrait**
- [ ] Naviguer dans toute l'app
- [ ] **Tout s'affiche correctement ?** Oui ❌ Non ❌

#### **Test 6.2 - Orientation paysage**
- [ ] Tourner le téléphone en **paysage**
- [ ] Observer le dashboard
- [ ] Observer les missions
- [ ] Observer le calendrier
- [ ] **Layout adapté au paysage ?** Oui ❌ Non ❌
- [ ] **Problèmes rencontrés** :

```
_________________________________________
```

#### **Test 6.3 - Taille de police**
- [ ] Vérifier que le **texte est lisible** partout
- [ ] Noter les pages où le texte est **trop petit** :

```
_________________________________________
```

#### **Test 6.4 - Boutons et liens**
- [ ] Essayer de cliquer sur tous les **boutons**
- [ ] **Tous les boutons sont assez grands ?** Oui ❌ Non ❌
- [ ] **Boutons trop petits** (noter lesquels) :

```
_________________________________________
```

---

### **✅ PHASE 7 : Performance Mobile (5 min)**

#### **Test 7.1 - Vitesse de chargement**
- [ ] Rafraîchir la page d'accueil
- [ ] **Temps de chargement** : ___ secondes
- [ ] **Ressenti** : Rapide ❌ / Moyen ❌ / Lent ❌

#### **Test 7.2 - Fluidité**
- [ ] Scroller dans la liste des missions
- [ ] **Scroll fluide ?** Oui ❌ Non ❌
- [ ] Ouvrir plusieurs pages rapidement
- [ ] **Transitions fluides ?** Oui ❌ Non ❌

#### **Test 7.3 - Consommation batterie**
- [ ] Noter le **% batterie** au début : ___%
- [ ] Utiliser l'app pendant 15 minutes
- [ ] Noter le **% batterie** après : ___%
- [ ] **Consommation excessive ?** Oui ❌ Non ❌

---

### **📊 Évaluation Globale Mobile**

| Critère | Note /10 |
|---------|----------|
| Design responsive | ___ |
| Facilité d'utilisation mobile | ___ |
| Menu burger | ___ |
| Performance | ___ |
| Installation PWA | ___ |
| **TOTAL** | **___/50** |

### **💬 Commentaires généraux**

**Points positifs** :
```
_________________________________________
_________________________________________
```

**Points à améliorer** :
```
_________________________________________
_________________________________________
```

**Bugs rencontrés** :
```
_________________________________________
_________________________________________
```

---

## 📸 **CAPTURES D'ÉCRAN (Optionnel)**

Si possible, prenez des **screenshots** des :
- [ ] Page d'accueil
- [ ] Dashboard
- [ ] Liste des missions
- [ ] Détail d'une mission
- [ ] Calendrier
- [ ] Profil
- [ ] Menu burger (mobile)
- [ ] App installée sur l'écran d'accueil

Envoyez-les par email ou WhatsApp.

---

## 🚨 **Signalement de Bug**

Si vous rencontrez un bug :

**Template de rapport** :
```
❌ BUG TROUVÉ

Page concernée : ________________
Action effectuée : ________________
Résultat attendu : ________________
Résultat obtenu : ________________
Navigateur/OS : ________________
Gravité : Bloquant ⚠️ / Moyen ⚡ / Mineur 💡
```

---

## ✅ **Après les Tests**

**Merci d'envoyer ce document complété à** :  
📧 Email : ________________  
📱 WhatsApp : ________________

**Ou remplir le formulaire en ligne** : ________________

---

**Merci pour votre aide précieuse ! 🙏**  
**Vos retours sont essentiels pour améliorer l'application.** 🎬


