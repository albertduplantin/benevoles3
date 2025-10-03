# 📢 Fonctionnalité : Générateur d'Appel aux Bénévoles

## 🎯 Objectif

Permettre aux administrateurs de générer automatiquement un message d'appel aux bénévoles pour les missions incomplètes, avec des liens directs pour l'inscription.

## ✨ Fonctionnalités

### 📝 Génération Automatique de Messages

- **Analyse des missions** : Détecte automatiquement les missions publiées qui nécessitent encore des bénévoles
- **Tri intelligent** : 
  - Missions urgentes en priorité (🔴)
  - Missions avec le plus de places restantes ensuite
- **Formatage engageant** : Messages avec emojis, structure claire, et appel à l'action

### 📱 Deux Formats Disponibles

#### 1. WhatsApp / SMS / Réseaux Sociaux (Texte)
```
🎬 Festival Films Courts de Dinan 2025 🎬

🙏 Appel aux bénévoles !

Nous avons besoin de votre aide...
```
- Format texte simple avec emojis
- Liens cliquables
- Copie en un clic
- Parfait pour WhatsApp, SMS, Facebook, Instagram

#### 2. Email (HTML)
- Design moderne et responsive
- Boutons d'action colorés
- Cartes visuelles pour chaque mission
- Badges pour les missions urgentes
- Copie du HTML en un clic

## 🎨 Design

### Structure du Message

1. **En-tête** :
   - Nom du festival avec emojis
   - Titre accrocheur : "Appel aux bénévoles !"

2. **Corps** :
   - Liste des missions incomplètes
   - Pour chaque mission :
     - Numéro et titre
     - Badge "URGENT" si nécessaire 🔴
     - Description (max 150 caractères)
     - Date et heure 📅
     - Lieu 📍
     - Nombre de bénévoles recherchés 👥
     - Lien d'inscription direct 🔗

3. **Appel à l'action** :
   - "Pourquoi nous rejoindre ?"
   - Liste des avantages (projections, convivialité, etc.)
   - Invitation à partager le message

4. **Pied de page** :
   - Remerciements
   - Dates du festival
   - Informations de contact

## 🔧 Utilisation

### Pour les Administrateurs

1. **Accéder au dashboard admin**
2. **Carte "Communication"** en bas de page
3. **Bouton "Générer appel aux bénévoles"**
   - Un badge indique le nombre de missions incomplètes
4. **Modal s'ouvre** avec :
   - Aperçu du nombre de missions et bénévoles recherchés
   - Badge "Missions urgentes" si applicable
5. **Choisir le format** :
   - Onglet "WhatsApp / SMS" pour texte simple
   - Onglet "Email (HTML)" pour email formaté
6. **Prévisualiser** le message
7. **Copier** en un clic
8. **Coller** dans WhatsApp, email, etc.

### Exemple de Workflow

```
Admin → Dashboard → Communication
  ↓
"Générer appel aux bénévoles" (3 missions incomplètes)
  ↓
Modal s'ouvre → Onglet WhatsApp
  ↓
Prévisualisation du message
  ↓
"Copier le texte" → Texte copié ✓
  ↓
WhatsApp → Coller → Envoyer au groupe
```

## 📊 Logique de Filtrage

```typescript
// Conditions pour inclure une mission
1. status === 'published' ✓
2. volunteers.length < maxVolunteers ✓

// Tri
1. isUrgent = true → en premier 🔴
2. Sinon, tri par (maxVolunteers - volunteers.length) DESC
```

## 🎨 Exemples de Messages

### Texte (WhatsApp)

```
🎬 **Festival Films Courts de Dinan 2025** 🎬

🙏 **Appel aux bénévoles !**

Nous avons besoin de votre aide pour faire de ce festival un succès !
Voici les missions qui nécessitent encore des bénévoles :

━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. Accueil des spectateurs** 🔴 URGENT

Accueillir et orienter les spectateurs à l'entrée du cinéma...

📅 Mercredi 20 novembre à 18h00
📍 Cinéma Le Club
👥 **3 bénévoles recherchés**

🔗 **Inscrivez-vous ici :** https://benevoles3.vercel.app/...

━━━━━━━━━━━━━━━━━━━━━━━━━━

💙 **Pourquoi nous rejoindre ?**
✨ Vivez le festival de l'intérieur
🤝 Rencontrez des passionnés de cinéma
🎟️ Accès privilégié aux projections
☕ Convivialité et bonne ambiance garanties !

📲 **Partagez ce message** à vos amis qui pourraient être intéressés !

Merci pour votre engagement ! 🙌
```

### HTML (Email)

- Cards colorées avec background gris clair
- Badge rouge pour "URGENT"
- Bouton bleu "Je m'inscris !"
- Section bleue claire pour les avantages
- Footer avec séparateur

## 🔒 Sécurité

- ✅ Accessible uniquement aux administrateurs
- ✅ Validation du rôle côté client et serveur
- ✅ Liens générés avec l'URL complète de l'application
- ✅ Pas de données sensibles dans les messages
- ✅ Conformité RGPD (pas d'emails/téléphones exposés)

## 📱 Responsive

- Modal adaptée aux écrans mobiles
- Prévisualisation scrollable
- Boutons de copie toujours visibles
- Onglets empilés sur petit écran

## 🚀 Technologies

- **React** : Composant client-side
- **shadcn/ui** : Dialog, Tabs, Button, Badge
- **date-fns** : Formatage des dates en français
- **Clipboard API** : Copie en un clic
- **Lucide Icons** : Icônes modernes

## 📦 Fichiers Créés

```
lib/utils/message-generator.ts
  ├─ generateVolunteerCallMessage()
  ├─ generateVolunteerCallMessageHTML()
  └─ getIncompleteMissions()

components/features/admin/volunteer-call-generator.tsx
  └─ VolunteerCallGenerator (Modal + Tabs)

components/ui/dialog.tsx (shadcn)
components/ui/tabs.tsx (shadcn)
```

## 🎯 Améliorations Futures Possibles

1. **Personnalisation** :
   - Permettre de modifier le message avant copie
   - Ajouter un logo du festival
   - Personnaliser les couleurs

2. **Statistiques** :
   - Tracker combien de fois le message a été généré
   - Voir si les inscriptions augmentent après envoi

3. **Envoi Direct** :
   - Intégration avec Twilio pour SMS
   - Intégration avec SendGrid pour emails
   - Bouton "Envoyer par email" direct

4. **Templates** :
   - Plusieurs modèles de messages
   - Templates pour différents canaux
   - Historique des messages générés

5. **Ciblage** :
   - Générer un message pour une seule mission
   - Filtrer par type de mission
   - Filtrer par date

## ✅ Tests à Effectuer

1. **Test Admin** :
   - [ ] Bouton visible dans le dashboard
   - [ ] Modal s'ouvre correctement
   - [ ] Badge affiche le bon nombre

2. **Test Génération** :
   - [ ] Message texte formaté correctement
   - [ ] Message HTML rendu proprement
   - [ ] Liens fonctionnels
   - [ ] Dates en français

3. **Test Copie** :
   - [ ] Copie texte fonctionne
   - [ ] Copie HTML fonctionne
   - [ ] Feedback visuel (✓ Copié !)
   - [ ] Fonctionne sur mobile

4. **Test WhatsApp** :
   - [ ] Texte collé conserve le formatage
   - [ ] Emojis s'affichent
   - [ ] Liens cliquables

5. **Test Email** :
   - [ ] HTML rendu dans Gmail
   - [ ] HTML rendu dans Outlook
   - [ ] Responsive sur mobile
   - [ ] Boutons cliquables

## 📝 Notes d'Utilisation

- Le message est généré **à la volée** (temps réel)
- Si aucune mission incomplète : message "Toutes les missions sont complètes !"
- Les missions sont triées automatiquement (urgentes → plus de places)
- L'URL de base est détectée automatiquement (`window.location.origin`)
- Fallback sur `benevoles3.vercel.app` si appelé côté serveur

---

**Date de création** : 3 octobre 2025  
**Version** : 1.0.0  
**Statut** : ✅ Déployé en production

