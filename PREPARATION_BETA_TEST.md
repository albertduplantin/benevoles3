# 🎯 Préparation Session Beta Test

## ✅ **Checklist Avant la Session**

### **1. Déploiement sur Vercel**
```bash
# Si pas encore fait
vercel --prod
```

- [ ] App déployée sur Vercel
- [ ] URL de production : `https://benevoles3.vercel.app`
- [ ] Vérifier que l'app fonctionne en production
- [ ] Tester rapidement une inscription

---

### **2. Créer des Missions de Test**

**Se connecter en tant qu'admin** :
- Email : `topinambour124@gmail.com`
- Mot de passe : *(votre mot de passe)*

**Créer au moins 5 missions variées** :

#### **Mission 1 : Accueil du public**
- Titre : "Accueil du public - Soirée d'ouverture"
- Date : 19 novembre 2025, 18h00 - 22h00
- Lieu : Théâtre des Jacobins
- Catégorie : Accueil
- Places : 5
- Statut : **Publiée**
- Description : "Accueillir les festivaliers, distribuer les programmes"

#### **Mission 2 : Projection**
- Titre : "Gestion projection - Compétition internationale"
- Date : 20 novembre 2025, 14h00 - 17h00
- Lieu : Cinéma Le Club
- Catégorie : Projection
- Places : 3
- Statut : **Publiée**

#### **Mission 3 : Bar**
- Titre : "Service bar - Soirée de clôture"
- Date : 23 novembre 2025, 20h00 - 00h00
- Lieu : Bar du festival
- Catégorie : Bar/Restauration
- Places : 8
- Statut : **Publiée**

#### **Mission 4 : Logistique**
- Titre : "Installation matériel - Préparation festival"
- Date : 18 novembre 2025, 09h00 - 12h00
- Lieu : Entrepôt municipal
- Catégorie : Logistique
- Places : 10
- Statut : **Publiée**

#### **Mission 5 : Communication**
- Titre : "Réseaux sociaux - Couverture live"
- Date : 21 novembre 2025, 10h00 - 18h00
- Lieu : Bureau festival
- Catégorie : Communication
- Places : 2
- Statut : **Publiée**
- Description : "Poster des photos/vidéos en temps réel sur Instagram/Facebook"

---

### **3. Préparer les Documents**

- [ ] Imprimer **2 copies** du `GUIDE_BETA_TEST.md`
- [ ] Préparer des **stylos**
- [ ] Avoir un **chronomètre** (ou smartphone)

---

### **4. Préparer les Appareils**

#### **Testeur 1 (Desktop)** :
- [ ] PC/Mac avec Chrome installé
- [ ] Connexion Internet stable
- [ ] URL Vercel ouverte dans un onglet

#### **Testeur 2 (Mobile)** :
- [ ] Smartphone avec Chrome (Android) ou Safari (iOS)
- [ ] Connexion 4G/5G ou WiFi
- [ ] URL Vercel ouverte

---

### **5. Comptes de Test**

**Créer 2 comptes en avance** (optionnel) :

| Testeur | Email | Mot de passe |
|---------|-------|--------------|
| Beta 1 (Desktop) | `beta1@test.com` | `Test123!` |
| Beta 2 (Mobile) | `beta2@test.com` | `Test123!` |

**OU** laisser les testeurs créer leurs comptes (recommandé pour tester l'inscription).

---

## 📋 **Déroulement de la Session (90 min)**

### **Partie 1 : Introduction (10 min)**

**Dire aux testeurs** :
```
"Merci d'avoir accepté de tester l'application !

Cette app permet aux bénévoles du Festival Films Courts 
de Dinan de s'inscrire aux missions, voir leur calendrier, 
et gérer leur profil.

Vous allez tester l'application comme si vous étiez un 
véritable bénévole. N'hésitez pas à tout essayer et à 
noter TOUS les problèmes que vous rencontrez.

Il n'y a pas de mauvais retours, au contraire ! 
Plus vous êtes critiques, mieux c'est. 😊

Vous avez chacun un guide de test papier. Cochez les cases 
au fur et à mesure et notez vos commentaires.

Des questions avant de commencer ?"
```

**Distribuer** :
- [ ] Guide de test papier
- [ ] Stylo
- [ ] URL Vercel (QR code ou écrit)

---

### **Partie 2 : Tests en parallèle (60 min)**

**Testeur 1 (Desktop)** → Suit son guide  
**Testeur 2 (Mobile)** → Suit son guide

**Vous** → Observez sans intervenir (sauf si bloqué)

**Prendre des notes** sur :
- Les hésitations
- Les erreurs
- Les questions posées
- Le temps pour chaque phase

---

### **Partie 3 : Debriefing (20 min)**

**Questions à poser** :

#### **Expérience générale**
- "Sur une échelle de 1 à 10, à quel point l'app est facile à utiliser ?"
- "Qu'avez-vous préféré ?"
- "Qu'avez-vous le moins aimé ?"

#### **Design**
- "Le design vous semble-t-il moderne et professionnel ?"
- "Les couleurs sont-elles agréables ?"
- "Y a-t-il des éléments mal placés ?"

#### **Navigation**
- "Avez-vous toujours su où vous étiez dans l'app ?"
- "Le menu est-il clair ?"
- "Avez-vous été perdu à un moment ?"

#### **Fonctionnalités**
- "Quelle fonctionnalité manque selon vous ?"
- "Y a-t-il des fonctionnalités inutiles ?"

#### **PWA (Installation)**
- "Utiliseriez-vous cette app installée sur votre téléphone/PC ?"
- "L'installation était-elle claire ?"

#### **Bugs**
- "Récapitulez les bugs rencontrés"

---

## 📊 **Après la Session**

### **1. Compiler les retours**
- [ ] Rassembler les 2 guides papier
- [ ] Créer un document de synthèse
- [ ] Classer les bugs par priorité :
  - 🔴 **Bloquant** → À corriger immédiatement
  - 🟠 **Important** → À corriger avant la v2
  - 🟡 **Moyen** → À améliorer
  - 🟢 **Mineur** → Nice to have

### **2. Tracker les bugs**
Créer un fichier `BUGS_BETA_TEST.md` :

```markdown
# 🐛 Bugs Trouvés - Beta Test

## 🔴 Bugs Bloquants
- [ ] Bug 1 : Description
- [ ] Bug 2 : Description

## 🟠 Bugs Importants
- [ ] Bug 3 : Description

## 🟡 Bugs Moyens
- [ ] Bug 4 : Description

## 🟢 Améliorations Suggérées
- [ ] Amélioration 1 : Description
```

### **3. Prioriser les corrections**
1. Corriger les bugs bloquants
2. Implémenter les améliorations critiques
3. Retester

---

## 💡 **Conseils pour l'Animation**

### **DO ✅**
- Observer en silence (ne pas guider)
- Prendre des notes détaillées
- Encourager la critique
- Remercier pour chaque retour
- Être positif et ouvert

### **DON'T ❌**
- Ne pas se justifier ("Oui mais c'est normal car...")
- Ne pas minimiser les problèmes ("C'est pas grave")
- Ne pas interrompre
- Ne pas prendre la défense de votre code
- Ne pas guider ("Non, il faut cliquer là")

### **Si un testeur est bloqué**
Attendre **2 minutes** avant d'intervenir.  
Si vraiment bloqué : "Que cherchez-vous à faire ?"  
→ Noter que c'est un problème d'UX !

---

## 🎁 **Remercier les Testeurs**

**À la fin de la session** :
```
"Merci énormément pour votre temps et vos retours précieux !

Vos remarques vont nous aider à améliorer l'application 
pour tous les bénévoles du festival.

Si vous remarquez d'autres choses en utilisant l'app 
ces prochains jours, n'hésitez pas à me contacter."
```

**Optionnel** :
- Offrir un café/boisson
- Leur donner un code promo ou goodies du festival
- Les inviter au festival en VIP 😊

---

## 📞 **Contact en Cas de Problème**

**Pendant la session, si l'app plante** :
1. Noter l'erreur exacte
2. Vérifier les logs Vercel
3. Basculer sur un environnement de secours si nécessaire

**Vercel Dashboard** : https://vercel.com/dashboard  
**Logs en temps réel** : `vercel logs --prod`

---

## ✅ **Checklist Finale**

**30 minutes avant la session** :
- [ ] App en production fonctionne
- [ ] 5+ missions créées
- [ ] Guides imprimés
- [ ] Appareils préparés
- [ ] Connexion Internet OK
- [ ] Chronomètre prêt

**Pendant la session** :
- [ ] Observer sans intervenir
- [ ] Prendre des notes
- [ ] Chronométrer les phases

**Après la session** :
- [ ] Récupérer les guides
- [ ] Compiler les retours
- [ ] Créer la liste des bugs
- [ ] Remercier les testeurs

---

**Bonne session de test ! 🚀**

