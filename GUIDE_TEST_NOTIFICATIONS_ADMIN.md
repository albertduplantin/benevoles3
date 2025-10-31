# 🎯 Guide : Tester l'envoi de notifications depuis l'admin

## 🚀 Accès rapide

### URL de la page admin
```
https://benevoles3.vercel.app/dashboard/admin/notifications

Ou via le menu :
Menu "Maintenance" → "Envoyer notifications"
```

**⚠️ Prérequis** : Vous devez être connecté avec un compte **admin**

---

## 📋 Interface d'envoi - Vue d'ensemble

```
┌─────────────────────────────────────────────────────┐
│  🔔 Envoyer des Notifications                       │
│  Envoyer des notifications push aux bénévoles       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📦 Nouvelle notification                           │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Type de notification ▼                             │
│  ┌─────────────────────────────────────────────┐   │
│  │ 📢 Annonce générale                         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Destinataires ▼                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ Sélection personnalisée                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Bénévoles (1 sélectionné)                         │
│  ┌─────────────────────────────────────────────┐   │
│  │ ☑ Votre Nom (votre@email.com)              │   │
│  │ ☐ Jean Dupont (jean@email.com)             │   │
│  │ ☐ Marie Martin (marie@email.com)           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Titre                                              │
│  ┌─────────────────────────────────────────────┐   │
│  │ Test de notification                        │   │
│  └─────────────────────────────────────────────┘   │
│  0/50 caractères                                    │
│                                                     │
│  Message                                            │
│  ┌─────────────────────────────────────────────┐   │
│  │ Ceci est un test de notification push.     │   │
│  │ Si vous voyez ceci, tout fonctionne ! 🎉   │   │
│  └─────────────────────────────────────────────┘   │
│  0/200 caractères                                   │
│                                                     │
│  Lien (optionnel)                                   │
│  ┌─────────────────────────────────────────────┐   │
│  │ /dashboard                                  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│        ┌───────────────────────────────────┐       │
│        │  📤 Envoyer la notification       │       │
│        └───────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

---

## 🧪 Test 1 : Notification à VOUS-MÊME (recommandé)

### Étape 1 : Aller sur la page admin

```
https://benevoles3.vercel.app/dashboard/admin/notifications
```

---

### Étape 2 : Remplir le formulaire

#### 1️⃣ Type de notification
```
Sélectionner : 📢 Annonce générale
```

**Options disponibles** :
- 📢 Annonce générale
- 💬 Message de catégorie
- ⚠️ Mise à jour de mission
- 🔔 Rappel de mission

---

#### 2️⃣ Destinataires
```
Sélectionner : Sélection personnalisée
```

**Options disponibles** :
- **Tous les utilisateurs** : Envoie à tout le monde (⚠️ attention !)
- **Par rôle** : Bénévoles / Responsables / Admins
- **Par catégorie** : Responsables d'une catégorie spécifique
- **Sélection personnalisée** : Choisir manuellement (👈 **recommandé pour test**)

---

#### 3️⃣ Sélectionner VOTRE compte

Dans la liste déroulante des bénévoles :

```
☑ Votre Prénom Nom (votre@email.com)  ← Cocher uniquement celui-ci
☐ Jean Dupont (jean@email.com)
☐ Marie Martin (marie@email.com)
☐ Pierre Durand (pierre@email.com)
...
```

**💡 Astuce** : Cochez UNIQUEMENT votre propre compte pour ne pas déranger les autres !

---

#### 4️⃣ Titre de la notification

```
Test de notification
```

**Limite** : 50 caractères maximum

**Exemples** :
- `Test notification push 🎉`
- `Vérification système`
- `Message de test`

---

#### 5️⃣ Message

```
Ceci est un test de notification push.
Si vous voyez ceci, le système fonctionne parfaitement ! 🎉
```

**Limite** : 200 caractères maximum

**Exemples** :
```
Bonjour ! Ceci est une notification de test.
Tout fonctionne correctement 👍

---

Test d'envoi de notification.
Heure : 14h30
Émetteur : Admin

---

🔔 Notification test réussie !
Vous recevez bien les alertes du festival.
```

---

#### 6️⃣ Lien (optionnel)

```
/dashboard
```

**Ce lien sera ouvert** quand l'utilisateur clique sur la notification.

**Exemples de liens utiles** :
- `/dashboard` - Page d'accueil
- `/dashboard/missions` - Liste des missions
- `/dashboard/profile` - Profil utilisateur
- `/dashboard/profile/notifications` - Paramètres notifications

---

### Étape 3 : Envoyer

Cliquez sur le bouton bleu :

```
┌───────────────────────────────┐
│  📤 Envoyer la notification   │
└───────────────────────────────┘
```

---

### Étape 4 : Résultat attendu

#### ✅ Message de succès (Toast vert)

```
┌────────────────────────────────────┐
│  ✓ Notification envoyée à 1        │
│    bénévole                         │
└────────────────────────────────────┘
```

---

#### 📱 Réception de la notification

**IMMÉDIATEMENT** (< 2 secondes), vous devriez voir :

##### Si l'application est OUVERTE :

```
┌──────────────────────────────┐
│ 📢 Test de notification      │
│                              │
│ Ceci est un test de          │
│ notification push...         │
│                              │
│   [Voir]         [×]         │
└──────────────────────────────┘
```

**→ Toast animé dans le coin bas-droit**

---

##### Si l'application est FERMÉE ou en arrière-plan :

**Windows** :
```
╔═══════════════════════════════════╗
║  🌟 Festival Films Courts         ║
║  ─────────────────────────────────  ║
║  📢 Test de notification          ║
║                                   ║
║  Ceci est un test de              ║
║  notification push...             ║
║                                   ║
║         [Voir]                    ║
╚═══════════════════════════════════╝
```

**→ Notification système (coin bas-droit)**  
**→ Avec SON 🔊**

---

**Smartphone (Android/iOS)** :
```
╔═══════════════════════════════════╗
║  🌟 Festival Films Courts         ║
║  à l'instant                      ║
║  ─────────────────────────────────  ║
║  📢 Test de notification          ║
║                                   ║
║  Ceci est un test de notification ║
║  push...                          ║
║                                   ║
║  [Voir]              [Balayer]   ║
╚═══════════════════════════════════╝
```

**→ Notification native mobile**  
**→ Apparaît même écran verrouillé**

---

## 🧪 Test 2 : Notification à UN bénévole spécifique

### Configuration

```yaml
Type: 📢 Annonce générale
Destinataires: Sélection personnalisée
Bénévole: Jean Dupont (jean@email.com)

Titre: Message pour Jean
Message: Bonjour Jean, ceci est un test d'envoi de notification personnalisée.
Lien: /dashboard
```

### Résultat attendu

- ✅ Seul Jean reçoit la notification
- ✅ Vous ne recevez rien
- ✅ Toast : "Notification envoyée à 1 bénévole"

---

## 🧪 Test 3 : Notification à TOUS les bénévoles

### ⚠️ ATTENTION : À utiliser UNIQUEMENT pour tester en production

### Configuration

```yaml
Type: 📢 Annonce générale
Destinataires: Par rôle
Rôle: Bénévoles

Titre: Message à tous
Message: Ceci est un message de test envoyé à tous les bénévoles.
Lien: /dashboard
```

### Résultat attendu

- ✅ **TOUS** les bénévoles ayant activé les notifications les reçoivent
- ✅ Toast : "Notification envoyée à tous les bénévoles"
- ✅ Affiche le nombre exact d'appareils touchés

---

## 🧪 Test 4 : Notification par catégorie

### Configuration

```yaml
Type: 💬 Message de catégorie
Destinataires: Par catégorie
Catégorie: Accueil

Titre: Réunion équipe Accueil
Message: Réunion d'équipe vendredi 14 juin à 18h. Présence obligatoire !
Lien: /dashboard
```

### Résultat attendu

- ✅ Seuls les **responsables de la catégorie "Accueil"** reçoivent
- ✅ Les bénévoles simples ne reçoivent pas
- ✅ Toast : "Notification envoyée aux responsables de la catégorie"

---

## 🔍 Vérification de la réception

### Méthode 1 : Console du navigateur (F12)

Ouvrez la console DevTools (F12) et cherchez :

```javascript
// Côté bénévole (qui reçoit)
✅ Message reçu en premier plan: {
  notification: {
    title: "Test de notification",
    body: "Ceci est un test..."
  },
  data: {
    type: "general_announcement",
    url: "/dashboard"
  }
}
```

---

### Méthode 2 : Logs Vercel (côté serveur)

Allez sur **Vercel Dashboard** → **Logs** :

```
[2025-01-15 14:30:12] POST /api/notifications/send
[2025-01-15 14:30:12] Notifications envoyées: 1/1
[2025-01-15 14:30:12] ✅ Success
```

---

### Méthode 3 : Firebase Console

Allez sur **Firebase Console** → **Cloud Messaging** :

```
Envois récents
─────────────────────────────────
15/01/2025 14:30  |  1 envoi  |  1 succès  |  0 échec
```

---

## 🎯 Scénarios d'erreurs et solutions

### Erreur 1 : "Aucun token FCM trouvé"

**Symptôme** :
```
⚠️ Aucun token FCM trouvé pour ces utilisateurs
Envoyées : 0
```

**Causes possibles** :
1. Le bénévole n'a **pas activé** les notifications
2. Le bénévole a **désactivé** les notifications
3. Le token a **expiré**

**Solution** :
1. Vérifier que le bénévole a bien activé les notifications :
   ```
   /dashboard/profile/notifications → Activer
   ```

2. Vérifier sur la page debug :
   ```
   /dashboard/debug-notifications
   → "Tokens enregistrés dans Firestore (1)" doit être vert
   ```

---

### Erreur 2 : "Permission de notification refusée"

**Symptôme** : Le toast de succès apparaît mais le bénévole ne reçoit rien

**Cause** : Le navigateur bloque les notifications

**Solution bénévole** :
1. Réactiver dans les paramètres du navigateur
2. Chrome : `chrome://settings/content/notifications`
3. Autoriser `benevoles3.vercel.app`

---

### Erreur 3 : Notification reçue mais clic ne fonctionne pas

**Symptôme** : Notification s'affiche, mais clic n'ouvre rien

**Cause** : URL invalide dans le champ "Lien"

**Solution** :
- Utiliser un chemin relatif : `/dashboard/missions/123`
- Pas d'URL externe (http://)
- Pas de lien vide (laisser `/dashboard` par défaut)

---

## 📊 Statistiques d'envoi

### Après envoi, vous verrez :

```javascript
{
  success: true,
  sent: 3,        // Notifications envoyées avec succès
  failed: 1,      // Tokens invalides/expirés
  total: 4        // Total de tokens tentés
}
```

**Interprétation** :
- `sent` = Nombre d'**appareils** qui ont reçu la notification
- `failed` = Tokens expirés (nettoyés automatiquement)
- Un bénévole peut avoir **plusieurs tokens** (PC + mobile)

---

## 🎓 Bonnes pratiques

### ✅ À FAIRE

1. **Tester sur vous-même AVANT** d'envoyer à tous
2. **Utiliser des titres courts** (max 50 car.)
3. **Messages clairs et concis** (max 200 car.)
4. **Toujours indiquer un lien** pertinent
5. **Vérifier les préférences** des bénévoles (ils peuvent désactiver certains types)

---

### ❌ À ÉVITER

1. ❌ Envoyer trop souvent (spam)
2. ❌ Messages trop longs (coupés)
3. ❌ Liens externes ou cassés
4. ❌ Envoyer à tous sans test préalable
5. ❌ Notifications la nuit (respecter 8h-22h)

---

## 🚀 Cas d'usage réels

### Cas 1 : Rappel réunion

```yaml
Type: 💬 Message de catégorie
Destinataires: Par catégorie (Accueil)
Titre: Réunion demain 18h
Message: N'oubliez pas la réunion d'équipe demain à 18h au Centre des Congrès. Pensez à amener votre badge.
Lien: /dashboard
```

---

### Cas 2 : Annulation urgente

```yaml
Type: ⚠️ Mise à jour de mission
Destinataires: Sélection personnalisée (10 bénévoles de la mission)
Titre: Mission annulée - Intempéries
Message: La mission "Accueil samedi matin" est annulée en raison de la météo. Vous êtes désormais disponible.
Lien: /dashboard/missions
```

---

### Cas 3 : Message général

```yaml
Type: 📢 Annonce générale
Destinataires: Tous les utilisateurs
Titre: Le festival commence dans 3 jours !
Message: Récupérez vos badges dès vendredi 9h au Hall A. Merci à tous pour votre engagement ! 🎉
Lien: /dashboard
```

---

## 📝 Checklist avant envoi

Avant de cliquer sur "Envoyer", vérifier :

- [ ] Le **titre** est clair et court
- [ ] Le **message** est compréhensible
- [ ] Les **destinataires** sont les bons
- [ ] Le **lien** fonctionne (tester dans le navigateur)
- [ ] Le **type** de notification est approprié
- [ ] Vous avez **testé sur vous-même** si c'est un message important

---

## 🎯 Résumé

### Workflow complet

1. **Préparer** : Réfléchir au message et aux destinataires
2. **Tester** : Envoyer à vous-même d'abord
3. **Vérifier** : Constater la réception
4. **Envoyer** : Envoyer au groupe cible
5. **Confirmer** : Vérifier le toast de succès

### Temps moyen par envoi

```
Remplir formulaire : ~1 minute
Test sur soi-même  : ~30 secondes
Vérification       : ~30 secondes
Envoi final        : ~10 secondes
─────────────────────────────────
TOTAL             : ~2-3 minutes
```

---

✅ **Vous êtes maintenant prêt à envoyer des notifications comme un pro !**

