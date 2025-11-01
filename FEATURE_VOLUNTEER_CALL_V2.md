# 🚀 Générateur d'Appel aux Bénévoles - Version 2.0 (Améliorée)

## Date : 1er Novembre 2025

## 📋 Vue d'ensemble

Version améliorée du générateur d'appel aux bénévoles avec 3 améliorations majeures :

1. ✅ **Sélection Manuelle des Missions** : Choisir exactement quelles missions inclure
2. ✅ **Personnalisation du Message** : Éditer le message avant de l'envoyer
3. ✅ **Envoi Direct par Email** : Envoyer directement aux bénévoles depuis l'interface

---

## 🎯 Nouvelles Fonctionnalités

### 1. 🎯 Sélection Manuelle des Missions

#### Checkboxes sur chaque mission
- Cocher/décocher individuellement chaque mission
- Boutons "Tout sélectionner" / "Tout déselectionner"
- Compteur en temps réel des missions sélectionnées

#### Filtres Intelligents
```
📁 Par Catégorie : Bar/Restauration, Accueil, Technique, etc.
⚡ Par Urgence : Toutes / Urgentes / Normales
📅 Par Date : Toutes / Dans 7 jours / Plus tard
```

#### Statistiques en Temps Réel
- Nombre de missions sélectionnées
- Total de places à pourvoir
- Nombre de missions urgentes

**Cas d'usage** :
> Un responsable veut envoyer un appel uniquement pour les missions du week-end d'ouverture, sans inclure celles de clôture. Il peut filtrer par date et sélectionner manuellement.

---

### 2. ✏️ Personnalisation du Message

#### Champs Personnalisables

**1. Nom du festival**
```
Par défaut : Festival Films Courts de Dinan
Personnalisable : Festival du Court Métrage 2025
```

**2. Dates du festival**
```
Par défaut : 19-23 novembre 2025
Personnalisable : Du 19 au 23 novembre 2025
```

**3. Message d'introduction**
```
Par défaut : "Bonjour à tous,"

Personnalisé :
"Chers bénévoles,

J'espère que vous allez bien ! Le festival approche à grands pas 
et nous avons encore besoin de votre aide pour quelques missions 
essentielles.

Voici où nous avons besoin de vous :"
```

#### Aperçu en Temps Réel
- Le message se met à jour automatiquement
- Voir le rendu texte et HTML en direct
- Compatible avec les 2 formats (WhatsApp + Email)

**Cas d'usage** :
> Un responsable de catégorie veut ajouter une touche personnelle et mentionner qu'il y aura une soirée de remerciement pour les bénévoles. Il personnalise l'intro du message.

---

### 3. 📧 Envoi Direct par Email

#### Types de Destinataires

**Option 1 : Tous les bénévoles**
- Envoie à tous les utilisateurs inscrits
- Idéal pour un appel général

**Option 2 : Par catégories préférées**
- Cibler les bénévoles ayant indiqué ces catégories dans leurs préférences
- Exemple : Envoyer uniquement aux bénévoles intéressés par "Bar/Restauration"
- Sélection multiple possible

**Option 3 : Sans mission assignée**
- Cibler uniquement les bénévoles qui n'ont encore aucune mission
- Idéal pour mobiliser les "inactifs"

**Option 4 : Liste personnalisée**
- Sélectionner manuellement chaque destinataire
- Avec checkboxes + noms complets
- Idéal pour un groupe spécifique

#### Sujet d'Email Personnalisable
```
Par défaut : 🎬 Appel aux bénévoles - Festival Films Courts
Personnalisé : [URGENT] Besoin de bénévoles pour le Bar ce week-end !
```

#### Compteur de Destinataires
- Affichage en temps réel du nombre estimé de destinataires
- Basé sur le type de sélection et les filtres

#### Confirmation Avant Envoi
- Bouton "Envoyer par Email (X destinataires)"
- Loader pendant l'envoi
- Toast de confirmation avec nombre exact d'envois

**Cas d'usage** :
> Un admin constate que la mission "Bar du samedi soir" manque de bénévoles. Il sélectionne uniquement cette mission, personnalise le message avec un ton urgent, et envoie uniquement aux bénévoles sans mission assignée + ceux intéressés par "Bar/Restauration".

---

## 🎨 Interface Utilisateur

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  📢 Appel aux Bénévoles (Version Améliorée)                │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│  🎯 SÉLECTION MISSIONS   │  ✏️ PERSONNALISATION            │
│                          │                                  │
│  [Filtres]               │  Nom du festival: [___________] │
│  ┌──────────────────┐    │  Dates: [___________]           │
│  │ ☑ Mission 1      │    │  Message intro: [___________]   │
│  │ ☑ Mission 2      │    │                                  │
│  │ ☐ Mission 3      │    │  👥 DESTINATAIRES               │
│  │ ☑ Mission 4      │    │  Type: [Dropdown]               │
│  └──────────────────┘    │  Estimé: 45 bénévoles           │
│                          │                                  │
│  Stats: 3 missions       │  Sujet: [___________]           │
│         12 places        │                                  │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┤
│  APERÇU                                                     │
│  [WhatsApp] [Email]                                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Bonjour à tous,                                        │ │
│  │ Nous avons besoin de 12 bénévoles...                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│                    [Annuler]  [📧 Envoyer par Email (45)]  │
└─────────────────────────────────────────────────────────────┘
```

### Responsive
- 2 colonnes sur desktop (sélection | personnalisation)
- 1 colonne sur mobile (stack vertical)
- Scroll indépendant pour la liste des missions
- Modal optimisé pour 95vh

---

## 🔧 Utilisation

### Pour les Administrateurs

#### Accès
```
Dashboard Admin → Carte "Communication" → "Générer un appel aux bénévoles"
```

#### Workflow Complet
```
1. Modal s'ouvre avec toutes les missions incomplètes pré-sélectionnées
   ↓
2. FILTRER (optionnel)
   - Catégorie : "Bar / Restauration"
   - Urgence : "Urgentes"
   ↓
3. SÉLECTIONNER
   - Cocher/décocher les missions souhaitées
   - Utiliser "Tout" ou "Aucun" si besoin
   ↓
4. PERSONNALISER
   - Modifier le nom/dates du festival si besoin
   - Ajouter un message d'introduction personnalisé
   ↓
5. CHOISIR LES DESTINATAIRES
   - Type : "Par catégories préférées"
   - Sélectionner : "Bar / Restauration" + "Billetterie"
   - Estimé : 23 bénévoles
   ↓
6. PERSONNALISER LE SUJET
   - "[URGENT] Besoin de bénévoles pour le Bar"
   ↓
7. PRÉVISUALISER
   - Onglet WhatsApp : voir le texte
   - Onglet Email : voir le HTML
   ↓
8. ENVOYER ou COPIER
   - Bouton "Envoyer par Email (23)" → envoi direct
   - OU Bouton "Copier" → copier pour WhatsApp/autre
   ↓
9. CONFIRMATION
   - "✅ Email envoyé à 23 bénévole(s) !"
```

### Pour les Responsables de Catégorie

Même workflow, mais avec filtrage automatique sur leurs catégories.

---

## 🔌 API Créée

### `POST /api/volunteer-calls/send-email`

#### Body
```json
{
  "recipientType": "by_category" | "all" | "without_mission" | "custom",
  "categoryIds": ["Bar / Restauration", "Accueil"],
  "userIds": ["uid1", "uid2"], // Pour type "custom"
  "subject": "🎬 Appel aux bénévoles",
  "htmlContent": "<div>...</div>",
  "textContent": "Bonjour...",
  "missionIds": ["mission1", "mission2"]
}
```

#### Response Success
```json
{
  "success": true,
  "callId": "abc123",
  "recipientCount": 23,
  "recipients": [
    { "email": "john@example.com", "firstName": "John" },
    ...
  ],
  "message": "Email envoyé à 23 bénévole(s)"
}
```

#### Response Error
```json
{
  "error": "Aucun destinataire trouvé"
}
```

---

## 📊 Historique des Appels

Les appels envoyés sont enregistrés dans Firestore :

```
Collection: volunteer-calls
Document: {
  id: "abc123",
  subject: "🎬 Appel aux bénévoles",
  recipientType: "by_category",
  categoryIds: ["Bar / Restauration"],
  userIds: [],
  missionIds: ["mission1", "mission2"],
  recipientCount: 23,
  sentAt: Timestamp,
  status: "sent"
}
```

**Utilité future** :
- Voir l'historique des appels envoyés
- Statistiques sur l'efficacité (taux d'inscription post-envoi)
- Éviter les doublons (ne pas re-solliciter trop souvent)

---

## 🎯 Comparaison V1 vs V2

| Fonctionnalité | V1 | V2 |
|---|---|---|
| Sélection des missions | ❌ Toutes automatiquement | ✅ Sélection manuelle |
| Filtres | ❌ Aucun | ✅ Catégorie, Urgence, Date |
| Personnalisation | ❌ Message fixe | ✅ Intro + Festival + Dates |
| Destinataires | ❌ Copier-coller manuel | ✅ 4 types ciblés |
| Envoi | ❌ Copier-coller | ✅ Envoi direct API |
| Historique | ❌ Aucun | ✅ Enregistré dans Firestore |
| Compteur destinataires | ❌ Non | ✅ Temps réel |
| Sujet email personnalisé | ❌ Non | ✅ Oui |

---

## 🚀 Intégration dans le Projet

### Remplacer l'ancien composant

**Avant** (dans `volunteer-call-card.tsx`) :
```tsx
import { VolunteerCallModal } from './volunteer-call-modal';

<VolunteerCallModal missions={missions} />
```

**Après** :
```tsx
import { VolunteerCallModalV2 } from './volunteer-call-modal-v2';

<VolunteerCallModalV2 missions={missions} />
```

### Compatibilité
- ✅ Même props interface (`missions: MissionClient[]`)
- ✅ Même style de bouton
- ✅ Backward compatible avec V1

---

## ⚠️ Limitation Actuelle : Envoi Email

### État Actuel
L'API `/api/volunteer-calls/send-email` est fonctionnelle mais **simule l'envoi**.
Les emails sont **loggés dans la console** mais pas réellement envoyés.

### Code à Ajouter
Pour activer l'envoi réel, intégrer un service d'email :

#### Option 1 : SendGrid (Recommandé)
```bash
npm install @sendgrid/mail
```

```typescript
// Dans route.ts
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const messages = recipients.map(r => ({
  to: r.email,
  from: 'noreply@votredomaine.fr',
  subject: subject,
  html: htmlContent.replace('{{firstName}}', r.firstName),
  text: textContent,
}));

await sgMail.send(messages);
```

#### Option 2 : Resend (Moderne)
```bash
npm install resend
```

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.sendBatch(
  recipients.map(r => ({
    from: 'Festival <noreply@votredomaine.fr>',
    to: r.email,
    subject: subject,
    html: htmlContent,
  }))
);
```

#### Variables d'Environnement
```env
# .env.local
SENDGRID_API_KEY=SG.xxx
# ou
RESEND_API_KEY=re_xxx
```

---

## ✅ Tests à Effectuer

### 1. Sélection et Filtres
- [ ] Cocher/décocher une mission
- [ ] Bouton "Tout sélectionner"
- [ ] Bouton "Tout déselectionner"
- [ ] Filtre par catégorie fonctionne
- [ ] Filtre par urgence fonctionne
- [ ] Filtre par date fonctionne
- [ ] Statistiques se mettent à jour

### 2. Personnalisation
- [ ] Modifier le nom du festival
- [ ] Modifier les dates
- [ ] Ajouter un message d'intro personnalisé
- [ ] Voir l'aperçu se mettre à jour en temps réel

### 3. Destinataires
- [ ] Sélection "Tous" affiche le bon nombre
- [ ] Sélection "Par catégories" fonctionne
- [ ] Sélection "Sans mission" fonctionne
- [ ] Sélection "Liste personnalisée" fonctionne
- [ ] Compteur de destinataires correct

### 4. Envoi
- [ ] Clic sur "Envoyer" affiche le loader
- [ ] API retourne une réponse
- [ ] Toast de succès s'affiche
- [ ] Modal se ferme après succès
- [ ] Historique enregistré dans Firestore

### 5. Copie (backward compatible)
- [ ] Copier le texte WhatsApp fonctionne
- [ ] Copier le HTML fonctionne
- [ ] Toast de confirmation

---

## 📦 Fichiers Créés/Modifiés

### Nouveaux Fichiers
```
app/api/volunteer-calls/send-email/route.ts
  └─ API d'envoi direct par email

components/features/admin/volunteer-call-modal-v2.tsx
  └─ Nouveau modal amélioré

FEATURE_VOLUNTEER_CALL_V2.md
  └─ Documentation complète
```

### Fichiers Modifiés
```
lib/utils/volunteer-call-generator.ts
  ├─ generateVolunteerCallMessage() : ajout options
  └─ generateVolunteerCallHTML() : ajout options
```

---

## 🎯 Roadmap Future

### Phase 3 (Futures Améliorations)
1. **Templates Multiples**
   - Template "Urgent"
   - Template "Rappel"
   - Template "Dernière minute"

2. **Statistiques**
   - Taux d'ouverture des emails
   - Taux de clics sur les liens
   - Taux de conversion (inscriptions)

3. **Planification**
   - Programmer l'envoi à une date/heure précise
   - Rappels automatiques si missions toujours incomplètes

4. **Exports**
   - Export en image pour Instagram Stories
   - Export PDF pour affichage physique
   - QR Code vers la page d'inscription

5. **A/B Testing**
   - Tester 2 versions de message
   - Voir laquelle performe le mieux

---

## 🔒 Sécurité

### Validations Côté API
- ✅ Vérification des champs requis
- ✅ Validation du type de destinataires
- ✅ Vérification que categoryIds/userIds sont fournis si nécessaires
- ✅ Vérification qu'au moins un destinataire existe

### Rate Limiting (À Ajouter)
```typescript
// Limiter à 1 appel toutes les 5 minutes par admin
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1,
});
```

### Permissions
- ✅ Accessible uniquement aux admins et responsables de catégorie
- ✅ Responsables de catégorie : filtrage automatique sur leurs catégories

---

## 💡 Bonnes Pratiques

### Pour les Admins
1. **Soyez précis** : Sélectionnez uniquement les missions vraiment urgentes
2. **Personnalisez** : Un message personnalisé a plus d'impact
3. **Ciblez** : N'envoyez pas à tout le monde à chaque fois
4. **Timing** : Envoyez au bon moment (pas trop tôt, pas trop tard)

### Pour les Responsables
1. **Coordonnez** : Vérifiez avec les autres responsables pour éviter les doublons
2. **Soyez clairs** : Expliquez bien ce qui est attendu
3. **Remerciez** : Mentionnez toujours les remerciements dans le message

---

**Version** : 2.0.0  
**Date** : 1er Novembre 2025  
**Statut** : ✅ Prêt pour Test (Email réel à configurer)  
**Auteur** : Assistant IA pour Festival Films Courts de Dinan


