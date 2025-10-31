# 📱 Guide : Expérience des bénévoles avec les notifications

## 🎯 Vue d'ensemble

Les bénévoles recevront des notifications **push en temps réel** sur leurs appareils (ordinateur, smartphone, tablette). Voici ce qu'ils verront selon le contexte.

---

## 📊 Scénarios d'utilisation

### Scénario 1 : Application OUVERTE (Premier plan)

**Contexte** : Le bénévole est connecté et navigue sur l'application.

#### 🖥️ Sur ordinateur (PC/Mac)

```
┌─────────────────────────────────────┐
│  Festival Films Courts de Dinan     │
│  ──────────────────────────────────  │
│                                      │
│  [Dashboard]  [Missions]  [Profil]  │
│                                      │
│    📬 Toast notification (coin bas-droit)
│    ┌──────────────────────────────┐ │
│    │ 🎯 Nouvelle affectation      │ │
│    │                              │ │
│    │ Vous avez été assigné à la   │ │
│    │ mission "Accueil public"     │ │
│    │                              │ │
│    │        [Voir]     [×]        │ │
│    └──────────────────────────────┘ │
│                                      │
└─────────────────────────────────────┘
```

**Comportement** :
- ✅ **Toast animé** (bibliothèque Sonner) apparaît en bas à droite
- ⏱️ **Durée** : 5 secondes (ou jusqu'à fermeture manuelle)
- 🔵 **Bouton "Voir"** : Redirige vers la page concernée (ex: `/dashboard/missions/[id]`)
- 🔊 **Son** : Son système (si autorisé par le navigateur)
- 📍 **Sticky** : Reste visible même si l'utilisateur scroll

---

#### 📱 Sur smartphone (Chrome Android / Safari iOS)

```
┌────────────────────────┐
│  🔵 benevoles3.vercel  │
│ ──────────────────────  │
│                         │
│  [☰]  Mes missions      │
│                         │
│  ┌────────────────────┐│
│  │ 🎯 Nouvelle        ││
│  │    affectation     ││
│  │                    ││
│  │ Mission "Accueil   ││
│  │ public"            ││
│  │                    ││
│  │  [Voir]   [×]      ││
│  └────────────────────┘│
│                         │
│  Mission 1             │
│  Mission 2             │
└────────────────────────┘
```

**Comportement** :
- ✅ **Toast en haut de l'écran** (optimisé mobile)
- 👆 **Swipe pour fermer**
- 🔵 **Bouton "Voir"** cliquable
- 📱 **Adaptatif** : Taille ajustée à l'écran

---

### Scénario 2 : Application FERMÉE ou onglet EN ARRIÈRE-PLAN

**Contexte** : Le bénévole n'est pas sur l'application, mais le navigateur est ouvert (ou l'app PWA installée).

#### 🖥️ Sur ordinateur (Windows)

```
┌─────────────────────────────────────────┐
│  Windows Taskbar                         │
│  [Chrome] [Excel] [Outlook] ...    10:34 │
└─────────────────────────────────────────┘
                    ↓
                    🔔 NOTIFICATION SYSTÈME
                    
    ╔═══════════════════════════════════╗
    ║  🌟 Festival Films Courts Dinan   ║
    ║  ─────────────────────────────────  ║
    ║  🎯 Nouvelle affectation          ║
    ║                                   ║
    ║  Vous avez été assigné à la       ║
    ║  mission "Accueil public" le      ║
    ║  samedi 15 juin à 14h00           ║
    ║                                   ║
    ║  📅 Centre des Congrès            ║
    ║                                   ║
    ║         [Voir la mission]         ║
    ╚═══════════════════════════════════╝
```

**Comportement** :
- 🔔 **Notification Windows** (coin bas-droit)
- 🖼️ **Icône** : Logo du festival (`/icon-192x192.png`)
- ⏱️ **Durée** : Reste affichée jusqu'à clic ou fermeture (paramètre `requireInteraction: true`)
- 🔊 **Son** : Son système Windows
- 👆 **Clic** : Ouvre automatiquement l'application sur la page concernée

---

#### 📱 Sur smartphone Android

```
╔═══════════════════════════════════════════╗
║  Notifications                        🔋📶  ║
╠═══════════════════════════════════════════╣
║                                           ║
║  🌟 Festival Films Courts Dinan           ║
║  à l'instant                              ║
║  ─────────────────────────────────────    ║
║  🎯 Nouvelle affectation                  ║
║                                           ║
║  Vous avez été assigné à la mission       ║
║  "Accueil public" le samedi 15 juin       ║
║  à 14h00                                  ║
║                                           ║
║  📍 Centre des Congrès                    ║
║  ─────────────────────────────────────    ║
║                                           ║
║  [Voir]                        [Balayer] ║
╚═══════════════════════════════════════════╝
```

**Comportement** :
- 📱 **Notification native Android**
- 🔔 **Affichage** : Barre de notification + popup si écran déverrouillé
- 👈 **Swipe** : Fermer
- 👆 **Tap** : Ouvre l'application sur la page concernée
- 🔒 **Écran verrouillé** : Apparaît sur l'écran de verrouillage

---

#### 📱 Sur iPhone (iOS Safari/Chrome)

```
┌───────────────────────────────────────┐
│  🔒 iPhone verrouillé            12:34 │
├───────────────────────────────────────┤
│                                       │
│      🌟 Festival Films Courts         │
│      🎯 Nouvelle affectation          │
│                                       │
│      Vous avez été assigné à la       │
│      mission "Accueil public"...      │
│                                       │
│      [Afficher]           [Fermer]    │
│                                       │
└───────────────────────────────────────┘
```

**Comportement iOS** :
- 📱 **Notification iOS native**
- 🔒 **Lock screen** : Visible sur l'écran verrouillé
- 📲 **Notification Center** : Accessible par swipe-down
- 👆 **Tap** : Déverrouille + ouvre l'app
- 🔕 **Do Not Disturb** : Respecté (pas d'affichage)

---

## 📋 Types de notifications et leurs contenus

### 1️⃣ Nouvelle affectation (`new_assignment`)

```
🎯 Nouvelle affectation

Vous avez été assigné à la mission "Accueil public"
le samedi 15 juin 2025 à 14h00

📍 Centre des Congrès
👥 3 autres bénévoles

[Voir la mission]
```

**Redirection** : `/dashboard/missions/[missionId]`

---

### 2️⃣ Modification de mission (`mission_update`)

```
⚠️ Mission modifiée

La mission "Accueil public" a été modifiée.

🕐 Nouveau horaire : 15h00 (au lieu de 14h00)
📍 Nouveau lieu : Hall principal

[Voir les détails]
```

**Redirection** : `/dashboard/missions/[missionId]`

---

### 3️⃣ Rappel de mission (`mission_reminder`)

```
🔔 Rappel : Mission demain !

N'oubliez pas votre mission "Accueil public"
demain à 14h00

📍 Centre des Congrès
📞 Contact : Marie Dupont - 06 12 34 56 78

[Voir ma mission]
```

**Redirection** : `/dashboard/missions/[missionId]`

---

### 4️⃣ Annulation de mission (`mission_cancellation`)

```
❌ Mission annulée

La mission "Accueil public" prévue le
samedi 15 juin à 14h00 a été annulée.

Vous êtes maintenant disponible à ce créneau.

[Voir le planning]
```

**Redirection** : `/dashboard`

---

### 5️⃣ Message du responsable (`category_message`)

```
💬 Message de votre responsable

Marie Dupont (Accueil) :

"Réunion d'équipe vendredi 14 juin à 18h
pour préparer le weekend. Merci d'être ponctuel !"

[Lire le message]
```

**Redirection** : `/dashboard/messages` ou `/dashboard`

---

### 6️⃣ Annonce générale (`general_announcement`)

```
📢 Annonce importante

Le festival commence dans 3 jours !

Pensez à récupérer votre badge d'accès
dès vendredi matin à partir de 9h.

🏢 Accueil principal - Hall A

[Plus d'infos]
```

**Redirection** : `/dashboard`

---

## 🎨 Éléments visuels

### Icône de l'application

Toutes les notifications affichent le **logo du festival** :

```
📂 /public/icon-192x192.png
📂 /public/icon-512x512.png (haute résolution)
```

**Caractéristiques** :
- 🖼️ Format : PNG transparent
- 📏 Taille : 192x192 px (notifications) et 512x512 px (PWA)
- 🎨 Style : Logo du festival avec fond

---

### Badge (notifications groupées)

Si plusieurs notifications non lues :

```
🌟 Festival Films Courts
   🔴 3
   
   3 nouvelles notifications
```

---

## ⚙️ Préférences utilisateur

Les bénévoles peuvent **personnaliser** ce qu'ils reçoivent via :

### Page `/dashboard/profile/notifications`

```
┌──────────────────────────────────────┐
│  Paramètres de notification          │
├──────────────────────────────────────┤
│                                      │
│  🔔 Notifications Push               │
│     [●] Activées                     │
│                                      │
│  Types de notifications :            │
│  ☑ Nouvelle affectation              │
│  ☑ Modification de mission           │
│  ☑ Rappel avant mission              │
│  ☑ Annulation de mission             │
│  ☑ Messages du responsable           │
│  ☐ Annonces générales (désactivé)    │
│                                      │
│  📧 Notifications par email          │
│     [●] Activées                     │
│                                      │
│        [Sauvegarder]                 │
└──────────────────────────────────────┘
```

**Options** :
- ✅ Activer/désactiver les notifications push globalement
- ✅ Choisir les types de notifications à recevoir
- ✅ Activer également les emails (doublé pour sécurité)

---

## 🔇 Mode "Ne pas déranger"

### Respect des paramètres système

- **Windows** : Si mode "Focus" ou "Ne pas déranger" activé → Notifications silencieuses
- **Android** : Respect du mode "Ne pas déranger"
- **iOS** : Respect du mode "Concentration"

### Notifications silencieuses vs normales

```typescript
// Notification NORMALE (par défaut)
{
  requireInteraction: true,  // Reste affichée
  silent: false              // Avec son
}

// Notification SILENCIEUSE (nuit/urgence)
{
  requireInteraction: false, // Disparaît après 5 sec
  silent: true              // Sans son
}
```

---

## 🌍 Multi-appareils

Un bénévole peut activer les notifications sur **plusieurs appareils** :

### Exemple : Marie a activé sur 3 appareils

```
📱 iPhone → Token 1
💻 PC Maison → Token 2
🖥️ PC Travail → Token 3
```

**Comportement** :
- ✅ La même notification est envoyée **simultanément** aux 3 appareils
- ✅ Clic sur un appareil **ne supprime pas** la notification des autres
- ✅ Désactiver sur un appareil **n'affecte pas** les autres

---

## 🚀 Cas d'usage réels

### Cas 1 : Affectation par l'admin

1. **Admin** : Affecte Marie à la mission "Accueil public"
2. **Serveur** : Envoie notification à tous les tokens FCM de Marie
3. **Marie (iPhone)** : 📱 Reçoit la notification instantanément
4. **Marie (PC)** : 💻 Reçoit aussi la notification
5. **Marie** : Clique sur la notification iPhone → Ouvre l'app → Voit les détails

---

### Cas 2 : Rappel automatique (24h avant)

1. **Cron Job** (Cloud Functions) : Détecte missions dans 24h
2. **Serveur** : Envoie rappel à tous les bénévoles concernés
3. **Bénévole** : Reçoit notification la veille à 14h00
4. **Contenu** : Rappel avec lieu, horaire, contact responsable

---

### Cas 3 : Annulation urgente

1. **Responsable** : Annule une mission (intempéries)
2. **Serveur** : Notification immédiate aux 10 bénévoles inscrits
3. **Bénévoles** : 
   - 📱 Sur mobile : Notification push + email de confirmation
   - 💻 Sur PC : Popup notification système
   - 🔔 Son d'alerte pour attirer l'attention

---

## 🔧 Dépannage

### "Je ne reçois pas de notifications"

**Checklist bénévole** :

1. ✅ Vérifier que les notifications sont activées :
   - Menu profil → Notifications → Activer
   
2. ✅ Vérifier les permissions du navigateur :
   - Chrome : `chrome://settings/content/notifications`
   - Safari : Préférences → Sites web → Notifications
   
3. ✅ Vérifier que le site est autorisé :
   - `benevoles3.vercel.app` doit être dans la liste "Autorisé"

4. ✅ Tester avec une notification locale :
   - `/dashboard/debug-notifications` → Bouton "Envoyer test"

---

### "Trop de notifications"

**Solution** : Personnaliser les préférences

```
/dashboard/profile/notifications

→ Décocher les types non souhaités
→ Garder uniquement "Nouvelle affectation" et "Annulation"
```

---

## 📊 Statistiques (pour l'admin)

L'admin peut voir les **taux de réception** :

```
Notification envoyée : "Réunion d'équipe"
─────────────────────────────────────
✅ Envoyée : 45 bénévoles
✅ Reçue : 42 appareils (93%)
❌ Échec : 3 tokens expirés

Détails :
- 30 notifications affichées (71%)
- 12 cliquées (28%)
- Temps moyen de réaction : 5 min
```

---

## 🎯 Résumé pour les bénévoles

### Ce qu'ils verront

| Situation | Apparence | Action |
|-----------|-----------|--------|
| **App ouverte** | Toast élégant en bas à droite | Cliquer "Voir" → Page détail |
| **App fermée** | Notification système native | Cliquer → Ouvre l'app |
| **Mobile** | Notification push standard | Tap → Redirige dans l'app |
| **Écran verrouillé** | Apparaît sur lock screen | Déverrouiller → App s'ouvre |

### Avantages pour eux

- ⏱️ **Instantané** : Reçu en < 2 secondes
- 📱 **Multi-appareils** : Téléphone, tablette, ordinateur
- 🎯 **Pertinent** : Personnalisable par type
- 🔕 **Non intrusif** : Respecte mode silencieux
- 🔐 **Sécurisé** : Pas de numéro de téléphone exposé

---

✅ **Les bénévoles auront une expérience moderne, fluide et professionnelle !**

