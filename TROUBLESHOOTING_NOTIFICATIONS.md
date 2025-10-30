# 🔧 Dépannage : Notification non reçue

## 🚨 Problème : Toast de succès mais rien reçu

**Symptôme** : 
- ✅ Admin : "Notification envoyée à 1 bénévole"
- ❌ Bénévole : Rien reçu sur le téléphone

**Causes possibles** (par ordre de fréquence) :

---

## ✅ VÉRIFICATION 1 : Les notifications sont-elles ACTIVÉES ?

### Sur le téléphone du bénévole

1. **Ouvrir l'app sur le téléphone Android**
2. **Aller sur** : Menu → Notifications (ou `/dashboard/profile/notifications`)
3. **Vérifier** : Le bouton doit être VERT "Désactiver"

```
┌────────────────────────────────┐
│  🔔 Notifications Push         │
│  ──────────────────────────────  │
│  ● Notifications activées      │  ← Doit être VERT
│  Vous recevez des notifications│
│                                │
│  [Désactiver] ← Bouton rouge   │
└────────────────────────────────┘
```

**Si le bouton est BLEU "Activer"** :
→ Les notifications ne sont PAS activées !
→ Il faut cliquer sur "Activer" et autoriser dans le popup

---

## ✅ VÉRIFICATION 2 : Les tokens sont-ils enregistrés ?

### Sur le téléphone du bénévole

1. **Aller sur** : `/dashboard/debug-notifications`
2. **Vérifier** la ligne : "Tokens enregistrés dans Firestore"

```
┌────────────────────────────────────────┐
│  État du système                       │
│  ──────────────────────────────────────  │
│                                        │
│  ✅ Permission accordée                │
│  ✅ Service Worker enregistré          │
│  ✅ Token FCM actuel                   │
│                                        │
│  ⚠️ Tokens enregistrés dans Firestore  │
│     (0) ← PROBLÈME ICI !               │
│     Aucun token enregistré             │
└────────────────────────────────────────┘
```

**Si le compteur est à (0)** :
→ Le token n'est pas sauvegardé dans Firestore
→ L'API ne peut pas envoyer la notification

**Solution** :
1. Aller sur `/dashboard/profile/notifications`
2. Cliquer sur "Désactiver" puis "Activer"
3. Autoriser dans le popup Android
4. Revenir sur `/dashboard/debug-notifications`
5. Vérifier que le compteur passe à **(1)** ✅

---

## ✅ VÉRIFICATION 3 : Le bon bénévole est-il sélectionné ?

### Côté admin

Vérifier que vous avez bien coché **benevole2** dans la liste :

```
Bénévoles (1 sélectionné)
┌─────────────────────────────────┐
│ ☐ Admin (admin@email.com)       │
│ ☑ benevole2 (benevole2@...)  ← Coché ? │
│ ☐ Jean Dupont                   │
└─────────────────────────────────┘
```

**Si vous avez coché le mauvais compte** :
→ La notification part vers un autre compte

---

## ✅ VÉRIFICATION 4 : Permissions Android

### Sur le téléphone Android

#### Étape 1 : Vérifier les paramètres du navigateur

**Chrome Android** :
1. Ouvrir Chrome
2. Menu (⋮) → **Paramètres**
3. **Paramètres des sites** → **Notifications**
4. Chercher **benevoles3.vercel.app**
5. Vérifier : **Autorisé** ✅

```
Notifications
─────────────────────────────
benevoles3.vercel.app
[●] Autorisé  ← Doit être activé
```

**Si bloqué** :
1. Appuyer sur le site
2. Changer en "Autorisé"
3. Fermer et rouvrir l'app

---

#### Étape 2 : Vérifier les paramètres système Android

1. **Paramètres Android** → **Applications**
2. Chercher **Chrome** (ou votre navigateur)
3. **Notifications** → Vérifier que c'est activé

```
Chrome
─────────────────────
Notifications
[●] Activé  ← Doit être ON
```

---

## ✅ VÉRIFICATION 5 : Console DevTools (Technique)

### Sur le téléphone (Chrome DevTools distant)

1. Sur PC : Ouvrir Chrome
2. Aller sur : `chrome://inspect`
3. Connecter le téléphone en USB
4. Cliquer "Inspect" sur l'app
5. **Onglet Console** → Chercher les erreurs

**Messages attendus** :
```javascript
✅ Service Worker enregistré
✅ Token FCM obtenu: [token]
✅ Firestore persistence enabled
```

**Messages d'erreur** :
```javascript
❌ InvalidCharacterError: Failed to execute 'atob'
   → Problème de clé VAPID

❌ Service Worker registration failed
   → Problème d'enregistrement

⚠️ Notifications push désactivées pour l'utilisateur
   → Paramètres utilisateur
```

---

## 🧪 TEST DE DIAGNOSTIC COMPLET

### Étape par étape pour identifier le problème

#### 1️⃣ Sur le téléphone du bénévole

**A. Vérifier la page debug**
```
/dashboard/debug-notifications

Résultat attendu :
✅ Support des notifications
✅ Permission accordée
✅ Service Worker enregistré
✅ Clé VAPID configurée
✅ Token FCM actuel
✅ Tokens enregistrés dans Firestore (1)  ← CRITIQUE
```

**B. Tester une notification locale**
```
Sur la page debug :
[Envoyer une notification de test (locale)]

→ Doit afficher une notification immédiatement
```

**Si la notification locale FONCTIONNE** :
→ Le problème est côté serveur/admin

**Si la notification locale NE FONCTIONNE PAS** :
→ Le problème est côté client/bénévole

---

#### 2️⃣ Côté admin

**A. Vérifier les logs de la console**

Après avoir cliqué "Envoyer", ouvrir la console (F12) :

```javascript
// Chercher ces messages :

POST /api/notifications/send 200
Response: {
  success: true,
  sent: 0,        ← PROBLÈME : devrait être 1
  failed: 0,
  total: 0        ← PROBLÈME : devrait être 1
}

// Ou

Response: {
  message: "Aucun token FCM trouvé pour ces utilisateurs"
  sent: 0
}
```

**Si `sent: 0`** :
→ Aucun token trouvé dans Firestore pour benevole2
→ Le bénévole doit activer les notifications

---

**B. Vérifier dans Firebase Console**

1. Aller sur https://console.firebase.google.com
2. Projet **benevoles3-a85b4**
3. **Firestore Database**
4. Collection **users**
5. Document **benevole2**
6. Chercher le champ **fcmTokens**

```json
{
  "uid": "...",
  "email": "benevole2@...",
  "fcmTokens": [
    "e7xY2z9..."  ← Doit contenir au moins 1 token
  ]
}
```

**Si `fcmTokens` est vide ou absent** :
→ Le token n'est pas sauvegardé
→ Le bénévole doit réactiver les notifications

---

## 🔄 SOLUTION COMPLÈTE (à faire dans l'ordre)

### Sur le téléphone du bénévole (benevole2)

1. ✅ **Aller sur** `/dashboard/profile/notifications`

2. ✅ **Si les notifications sont "activées"** :
   - Cliquer sur "Désactiver"
   - Attendre le toast "Notifications désactivées"

3. ✅ **Puis cliquer sur "Activer"**
   - Une popup Android devrait apparaître
   - Cliquer "Autoriser" dans la popup

4. ✅ **Attendre** le toast vert :
   ```
   ✓ Notifications activées avec succès !
   ```

5. ✅ **Vérifier sur** `/dashboard/debug-notifications` :
   ```
   Tokens enregistrés dans Firestore (1)  ← Doit être à 1
   Token: e7xY2z9...
   ```

---

### Côté admin (votre PC)

6. ✅ **Retourner sur** `/dashboard/admin/notifications`

7. ✅ **Remplir à nouveau** :
   ```
   Type: 📢 Annonce générale
   Destinataires: Sélection personnalisée
   Cocher: ☑ benevole2
   Titre: Test 2
   Message: Deuxième test après réactivation
   ```

8. ✅ **Envoyer**

9. ✅ **Ouvrir la console (F12)** et vérifier :
   ```javascript
   Response: {
     success: true,
     sent: 1,      ← Doit être 1
     failed: 0,
     total: 1      ← Doit être 1
   }
   ```

10. ✅ **Sur le téléphone**, vous devriez voir la notification **IMMÉDIATEMENT** (< 2 secondes)

---

## 🎯 CHECKLIST DE VÉRIFICATION

Cochez ce qui est OK :

### Côté bénévole (téléphone Android)

- [ ] App ouverte sur Chrome Android (pas autre navigateur)
- [ ] Connecté avec le compte **benevole2**
- [ ] Bouton "Désactiver" visible (notifications activées)
- [ ] Page `/dashboard/debug-notifications` → "Tokens (1)" ✅
- [ ] Permissions Chrome : benevoles3.vercel.app "Autorisé"
- [ ] Permissions Android : Chrome → Notifications "Activé"
- [ ] Pas en mode "Ne pas déranger"
- [ ] Connexion internet active

### Côté admin (votre PC)

- [ ] Bénévole **benevole2** bien coché dans la liste
- [ ] Titre et message remplis
- [ ] Toast "Notification envoyée à 1 bénévole"
- [ ] Console : `sent: 1` (pas `sent: 0`)

---

## 🆘 CAS PARTICULIERS

### Cas 1 : Le bénévole utilise un autre navigateur

**Problème** : Notifications activées sur Chrome PC, mais il teste sur Samsung Internet mobile

**Solution** : Activer les notifications **sur chaque navigateur/appareil** séparément

---

### Cas 2 : Mode navigation privée

**Problème** : Les notifications ne marchent pas en navigation privée

**Solution** : Utiliser le mode normal (pas incognito)

---

### Cas 3 : PWA installée

**Problème** : L'app est installée comme PWA, mais les notifications ne marchent pas

**Solution** : 
1. Désinstaller la PWA
2. Réinstaller
3. Réactiver les notifications

---

### Cas 4 : Timeout de connexion

**Problème** : Le bénévole était déconnecté pendant longtemps

**Solution** :
1. Se déconnecter
2. Se reconnecter
3. Réactiver les notifications

---

## 📊 LOGS À VÉRIFIER

### Logs Vercel (côté serveur)

```bash
vercel logs benevoles3 --follow

# Chercher :
POST /api/notifications/send
Notifications envoyées: 1/1  ← Doit être 1/1
✅ Success
```

### Logs Firebase (Cloud Messaging)

Firebase Console → Cloud Messaging → Historique

```
Date              | Envois | Succès | Échecs
─────────────────────────────────────────────
15/01 14:30      | 1      | 1      | 0      ← OK
15/01 14:25      | 1      | 0      | 1      ← ERREUR
```

---

## 🎓 RÉSUMÉ POUR DÉBOGUER

| Symptôme | Cause probable | Solution |
|----------|---------------|----------|
| Toast succès mais `sent: 0` | Pas de token FCM | Réactiver notifications |
| Token (0) dans debug | Token pas sauvegardé | Désactiver puis réactiver |
| Notification locale marche pas | Permissions manquantes | Autoriser dans Chrome |
| Console : "Permission denied" | Chrome bloque | Paramètres Chrome → Autoriser |
| Marche sur PC mais pas mobile | Token pas sur mobile | Activer sur mobile aussi |

---

✅ **Solution la plus fréquente** : 
Le bénévole doit aller sur `/dashboard/profile/notifications` et cliquer "Activer" en autorisant dans le popup.

