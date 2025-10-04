# 🎬 Missions de Test - Beta Test

**6 missions créées pour tester l'application**

---

## 📋 **Liste des Missions**

### **1. 🔴 Accueil du public - Soirée d'ouverture**

**Type** : Scheduled  
**Date** : Mercredi 19 novembre 2025  
**Horaires** : 18h00 - 22h00  
**Lieu** : Théâtre des Jacobins  
**Places** : 5 bénévoles  
**Statut** : ✅ Publiée  
**Urgent** : 🔴 OUI

**Description** :
> Accueillir les festivaliers à l'entrée du théâtre, distribuer les programmes et orienter le public vers les différentes salles. Un sourire et une bonne connaissance du lieu sont vos meilleurs atouts !

---

### **2. Gestion projection - Compétition internationale**

**Type** : Scheduled  
**Date** : Jeudi 20 novembre 2025  
**Horaires** : 14h00 - 17h00  
**Lieu** : Cinéma Le Club  
**Places** : 3 bénévoles  
**Statut** : ✅ Publiée  
**Urgent** : Non

**Description** :
> Assurer le bon déroulement de la projection : accueil en salle, présentation du court-métrage, gestion des questions-réponses avec le réalisateur. Idéal pour les cinéphiles !

---

### **3. Service bar - Soirée de clôture**

**Type** : Scheduled  
**Date** : Samedi 23 novembre 2025  
**Horaires** : 20h00 - 00h00  
**Lieu** : Bar du Festival - Salle des fêtes  
**Places** : 8 bénévoles  
**Statut** : ✅ Publiée  
**Urgent** : Non

**Description** :
> Servir les boissons au bar du festival pendant la soirée de clôture. Ambiance festive garantie ! Expérience en service bienvenue mais pas obligatoire.

---

### **4. 🔴 Installation matériel - Préparation festival**

**Type** : Scheduled  
**Date** : Lundi 18 novembre 2025  
**Horaires** : 09h00 - 13h00  
**Lieu** : Entrepôt municipal - Zone technique  
**Places** : 10 bénévoles  
**Statut** : ✅ Publiée  
**Urgent** : 🔴 OUI

**Description** :
> Aider à l'installation du matériel (scène, son, lumières, signalétique) avant le début du festival. Bras musclés bienvenus ! Travail en équipe dans une bonne ambiance.

---

### **5. Réseaux sociaux - Couverture live du festival**

**Type** : Scheduled  
**Date** : Vendredi 21 novembre 2025  
**Horaires** : 10h00 - 18h00  
**Lieu** : Bureau du festival - Maison des associations  
**Places** : 2 bénévoles  
**Statut** : ✅ Publiée  
**Urgent** : Non

**Description** :
> Assurer la couverture du festival sur les réseaux sociaux : photos, vidéos, stories Instagram/Facebook, interactions avec la communauté. Smartphone et créativité requis !

---

### **6. Billetterie et contrôle d'accès**

**Type** : Scheduled  
**Date** : Jeudi 20 novembre 2025  
**Horaires** : 17h30 - 22h00  
**Lieu** : Hall d'entrée - Théâtre des Jacobins  
**Places** : 4 bénévoles  
**Statut** : ✅ Publiée  
**Urgent** : Non

**Description** :
> Gérer la billetterie, scanner les QR codes, contrôler les accès et renseigner les festivaliers. Rigueur et sens du contact indispensables.

---

## 📊 **Statistiques**

| Métrique | Valeur |
|----------|--------|
| Total missions | 6 |
| Total places | 32 |
| Missions urgentes | 2 |
| Jours couverts | 6 (du 18 au 24 nov) |
| Durée moyenne | 4h |

---

## 🎯 **Répartition**

### **Par jour**
- **Lundi 18 nov** : 1 mission (Installation)
- **Mercredi 19 nov** : 1 mission (Accueil)
- **Jeudi 20 nov** : 2 missions (Projection + Billetterie)
- **Vendredi 21 nov** : 1 mission (Réseaux sociaux)
- **Samedi 23 nov** : 1 mission (Bar)

### **Par type de mission**
- 🎭 **Accueil** : 2 missions
- 🎬 **Projection** : 1 mission
- 🍺 **Bar** : 1 mission
- 🔧 **Logistique** : 1 mission
- 📱 **Communication** : 1 mission

### **Par horaire**
- 🌅 **Matin** (09h-12h) : 1 mission
- 🌞 **Après-midi** (14h-18h) : 2 missions
- 🌆 **Soir** (18h-00h) : 3 missions

---

## 🧪 **Scénarios de Test**

### **Scénario 1 : Bénévole découvre l'app**
1. S'inscrire
2. Compléter le profil
3. Voir la liste des missions
4. S'inscrire à "Service bar"
5. Vérifier le calendrier
6. Exporter son planning

### **Scénario 2 : Bénévole actif**
1. S'inscrire à 3 missions différentes
2. Se désinscrire d'une mission
3. Demander à être responsable d'une mission
4. Voir les autres participants
5. Modifier ses préférences de notification

### **Scénario 3 : Admin gère les missions**
1. Créer une nouvelle mission
2. Éditer une mission existante
3. Approuver/refuser une demande de responsabilité
4. Générer un appel aux bénévoles
5. Exporter les données
6. Supprimer une mission

---

## 📝 **Instructions pour créer les missions**

### **Option 1 : Via le script (automatique)**

```bash
# Installer tsx si pas déjà fait
npm install -D tsx

# Exécuter le script
npx tsx scripts/create-test-missions.ts
```

### **Option 2 : Manuellement dans l'app**

1. Se connecter en **admin**
2. Aller dans **"Nouvelle mission"**
3. Remplir chaque mission avec les données ci-dessus
4. Publier chaque mission

---

## ✅ **Checklist de Préparation**

Avant le beta test :

- [ ] Créer les 6 missions
- [ ] Vérifier que toutes sont **publiées**
- [ ] Vérifier les dates (novembre 2025)
- [ ] Vérifier que 2 sont marquées **urgentes**
- [ ] Tester l'inscription à une mission
- [ ] Vérifier que le calendrier affiche bien les missions
- [ ] Tester l'export planning
- [ ] Tester le générateur d'appel aux bénévoles

---

## 🎓 **Points à faire tester**

### **Fonctionnalités générales**
- [ ] Inscription/Connexion
- [ ] Complétion du profil
- [ ] Navigation dans l'app

### **Missions**
- [ ] Liste des missions
- [ ] Filtres (statut, type, urgent)
- [ ] Recherche
- [ ] Détails d'une mission
- [ ] Inscription rapide (bouton sur carte)
- [ ] Inscription depuis détails
- [ ] Désinscription
- [ ] Demande de responsabilité

### **Calendrier**
- [ ] Affichage des missions
- [ ] Navigation (mois précédent/suivant)
- [ ] Clic sur une mission
- [ ] Badges (inscrit/responsable)
- [ ] Légende

### **Admin**
- [ ] Créer une mission
- [ ] Éditer une mission
- [ ] Supprimer une mission (depuis liste)
- [ ] Supprimer une mission (depuis calendrier)
- [ ] Générer appel aux bénévoles
- [ ] Exports PDF/Excel
- [ ] Gérer les bénévoles
- [ ] Approuver demandes de responsabilité

### **PWA**
- [ ] Installation (desktop)
- [ ] Installation (mobile)
- [ ] Mode offline
- [ ] Icône sur écran d'accueil

---

## 💡 **Conseils pour le Beta Test**

### **Répartition des tests**
- **Testeur 1 (Desktop)** : Se concentrer sur les fonctionnalités admin et exports
- **Testeur 2 (Mobile)** : Se concentrer sur l'expérience bénévole et PWA

### **Missions à utiliser**
- **Pour s'inscrire** : Service bar, Billetterie (pas urgentes, assez de places)
- **Pour tester l'urgence** : Accueil, Installation (marquées urgentes)
- **Pour tester le remplissage** : Réseaux sociaux (seulement 2 places)

### **Scénarios avancés**
- S'inscrire à plusieurs missions le même jour
- S'inscrire à une mission urgente
- Essayer de s'inscrire à une mission complète
- Demander à être responsable

---

## 📸 **Points visuels à vérifier**

- [ ] Badge "URGENT" rouge bien visible
- [ ] Badge "Inscrit" vert sur les cartes
- [ ] Badge "Responsable" violet sur les cartes
- [ ] Compteur de places à jour
- [ ] Calendrier coloré et clair
- [ ] Responsive sur mobile
- [ ] Boutons bien dimensionnés (tactile)

---

**Missions prêtes pour le beta test ! 🚀**

