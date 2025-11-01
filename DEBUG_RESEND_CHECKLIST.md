# 🔍 Débogage - Envoi d'Emails avec Resend

## 📋 Checklist de Débogage

Suivez ces étapes dans l'ordre pour identifier le problème.

---

## ✅ Étape 1 : Vérifier la Configuration Vercel

### 1.1 Variable d'environnement ajoutée ?

1. Allez sur **https://vercel.com/albertduplantins-projects/benevoles3**
2. Cliquez sur **"Settings"** (en haut)
3. Menu gauche → **"Environment Variables"**
4. Cherchez **`RESEND_API_KEY`** dans la liste

**✅ Si vous la voyez** :
```
RESEND_API_KEY    Production, Preview, Development    [Hidden]
```
→ Passez à l'étape 1.2

**❌ Si vous ne la voyez PAS** :
→ Elle n'est pas encore ajoutée. Retournez à l'étape de configuration.

### 1.2 Les 3 environnements sont cochés ?

Cliquez sur les **3 points** (⋮) à droite de `RESEND_API_KEY` → **Edit**

Vérifiez que les 3 cases sont cochées :
- ☑️ Production
- ☑️ Preview
- ☑️ Development

**Si non cochées** → Cochez-les et cliquez **"Save"**

---

## ✅ Étape 2 : Vérifier le Redéploiement

Les variables d'environnement ne s'appliquent qu'aux **nouveaux déploiements**.

### 2.1 Avez-vous redéployé APRÈS avoir ajouté la variable ?

1. Allez dans l'onglet **"Deployments"** sur Vercel
2. Regardez l'heure du dernier déploiement
3. Comparez avec l'heure où vous avez ajouté `RESEND_API_KEY`

**❌ Si le déploiement est AVANT l'ajout de la variable** :
→ Il faut redéployer ! Voir étape 2.2

**✅ Si le déploiement est APRÈS** :
→ Passez à l'étape 2.3

### 2.2 Redéployer maintenant

**Option A : Via Git** (Recommandé)
```bash
cd benevoles3
git commit --allow-empty -m "Redeploy for Resend"
git push origin feature/volunteer-call-v2-preview
```

**Option B : Via Vercel**
1. Onglet "Deployments"
2. Dernier déploiement → 3 points → **"Redeploy"**
3. Confirmez

### 2.3 Attendre que le déploiement soit terminé

1. Restez sur l'onglet **"Deployments"**
2. Le statut doit être **✅ "Ready"** (pas "Building" ou "Error")
3. Cela prend 2-3 minutes

**⏳ Si statut = "Building"** → Attendez

**❌ Si statut = "Error"** → Cliquez dessus pour voir les logs d'erreur

---

## ✅ Étape 3 : Vérifier que Vous Testez Correctement

### 3.1 Êtes-vous sur la bonne URL ?

Vous devez tester sur l'URL du **dernier déploiement**.

1. Vercel → Onglet **"Deployments"**
2. Dernier déploiement avec statut **"Ready"**
3. Cliquez sur **"Visit"** ou copiez l'URL
4. Utilisez **CETTE URL** pour vos tests

### 3.2 Avez-vous fait un test depuis le dashboard ?

1. Connectez-vous à l'application
2. Allez sur **`/dashboard/volunteer-call`**
3. Sélectionnez **1 seule mission**
4. Destinataires : **"Liste personnalisée"**
5. Cochez **UNIQUEMENT votre email**
6. Cliquez **"Envoyer par Email"**

### 3.3 Quel message voyez-vous ?

**⚠️ Si vous voyez** :
```
⚠️ Envoi simulé à 1 bénévole(s) 
(RESEND_API_KEY non configurée)
```
→ La clé n'est PAS encore active. Retournez à l'étape 1 et 2.

**✅ Si vous voyez** :
```
✅ Email envoyé à 1 bénévole(s) !
```
→ L'email a été envoyé ! Passez à l'étape 4.

---

## ✅ Étape 4 : Vérifier la Réception

### 4.1 Vérifiez votre boîte de réception

Attendez **30 secondes à 2 minutes** maximum.

1. Ouvrez votre boîte email
2. Rafraîchissez (F5)
3. Cherchez un email de **"Festival Films Courts"**
4. De : `noreply@updates.resend.dev`

### 4.2 Vérifiez les SPAMS

⚠️ **TRÈS IMPORTANT** : La première fois, l'email peut arriver en spam !

1. Ouvrez votre dossier **"Spam"** / **"Courrier indésirable"**
2. Cherchez un email de **"Festival Films Courts"** ou `noreply@updates.resend.dev`
3. Si vous le trouvez → **Marquez-le comme "Non spam"**

### 4.3 Vérifiez l'adresse email

Assurez-vous que vous avez bien sélectionné **VOTRE propre email** dans la liste des destinataires.

---

## ✅ Étape 5 : Vérifier les Logs Vercel

Si l'email n'arrive toujours pas, vérifiez les logs.

### 5.1 Accéder aux logs

1. Vercel Dashboard → **"Functions"** (dans le menu du haut)
2. Cliquez sur **"Logs"** (ou "Real-time Logs")
3. Filtrez par : `/api/volunteer-calls/send-email`

### 5.2 Que disent les logs ?

**Scénario A : Mode simulé**
```
⚠️ RESEND_API_KEY non configurée - Envoi simulé
📧 Simulation d'envoi à 1 bénévoles
```
→ La clé n'est pas active. Retournez étape 1 et 2.

**Scénario B : Envoi réel**
```
📧 Envoi réel d'emails à 1 bénévoles via Resend
✅ 1/1 emails envoyés avec succès
```
→ L'email a bien été envoyé ! Vérifiez les spams (étape 4.2).

**Scénario C : Erreur**
```
❌ Erreur lors de l'envoi: Invalid API key
```
→ La clé est incorrecte. Vérifiez qu'elle est bien copiée.

### 5.3 Copier les logs d'erreur

Si vous voyez une erreur, copiez le message complet.

---

## ✅ Étape 6 : Vérifier le Dashboard Resend

### 6.1 Accéder au dashboard

1. Allez sur **https://resend.com/emails**
2. Connectez-vous avec votre compte Resend

### 6.2 Que voyez-vous ?

**✅ Si vous voyez votre email** :
- Date/heure récente
- Destinataire : votre email
- Statut : **"Delivered"** ✅

→ L'email a été envoyé et délivré ! Vérifiez vos spams.

**❌ Si vous ne voyez RIEN** :
→ L'email n'a pas été envoyé via Resend. La clé n'est peut-être pas active.

**⚠️ Si statut = "Bounced"** :
→ L'adresse email est invalide ou bloquée.

---

## 🔧 Solutions aux Problèmes Courants

### Problème 1 : "Envoi simulé" au lieu de "Email envoyé"

**Cause** : `RESEND_API_KEY` non configurée ou pas encore appliquée

**Solution** :
1. Vérifiez que la variable est sur Vercel (étape 1)
2. Redéployez l'application (étape 2)
3. Attendez que le déploiement soit "Ready"
4. Utilisez l'URL du nouveau déploiement
5. Videz le cache (Ctrl+Shift+R)

### Problème 2 : Email n'arrive pas (mais envoi réussi)

**Cause** : Email dans les spams OU délai de livraison

**Solution** :
1. Vérifiez les **spams** (90% des cas)
2. Attendez 2-3 minutes (parfois il y a un délai)
3. Vérifiez Resend Dashboard → L'email est marqué "Delivered" ?
4. Essayez avec une autre adresse email (Gmail, Outlook, etc.)

### Problème 3 : Erreur "Invalid API key"

**Cause** : Clé mal copiée ou espaces

**Solution** :
1. Vercel → Settings → Environment Variables
2. Modifiez `RESEND_API_KEY`
3. Vérifiez qu'il n'y a pas d'espaces avant/après
4. La clé doit être : `re_jJaA821r_2zSBLxehxUNFjAtsiLGw4hGv`
5. Save et redéployez

### Problème 4 : "Rate limit exceeded"

**Cause** : Trop d'emails envoyés (limite : 3000/mois)

**Solution** :
1. Attendez le mois prochain (reset automatique)
2. Ou passez au plan payant Resend

---

## 🧪 Test de Diagnostic Rapide

Faites ce test pour identifier rapidement le problème :

### Test 1 : Vérifier que la clé est active

1. Ouvrez la console développeur (F12)
2. Allez dans l'onglet "Network"
3. Sur `/dashboard/volunteer-call`, cliquez "Envoyer"
4. Regardez la requête à `/api/volunteer-calls/send-email`
5. Cliquez dessus → Onglet "Response"

**Si vous voyez** :
```json
{
  "success": true,
  "message": "⚠️ Envoi simulé...",
  "simulated": true
}
```
→ La clé n'est PAS active

**Si vous voyez** :
```json
{
  "success": true,
  "message": "Email envoyé à 1 bénévole(s) !",
  "recipientCount": 1
}
```
→ La clé EST active et l'email a été envoyé !

---

## 📞 Que Faire Maintenant ?

### Si après TOUTES ces vérifications ça ne fonctionne pas :

**Donnez-moi ces informations** :

1. **Message affiché** après avoir cliqué "Envoyer" :
   - `⚠️ Envoi simulé` OU `✅ Email envoyé` ?

2. **Logs Vercel** :
   - Que disent les logs de `/api/volunteer-calls/send-email` ?

3. **Dashboard Resend** :
   - Voyez-vous des emails envoyés ?

4. **Variable Vercel** :
   - Confirmez que `RESEND_API_KEY` est bien visible dans Settings → Environment Variables

5. **Dernier déploiement** :
   - À quelle heure ? (Pour vérifier qu'il est après l'ajout de la variable)

---

## ✅ Checklist Récapitulative

Cochez au fur et à mesure :

- [ ] Variable `RESEND_API_KEY` ajoutée sur Vercel
- [ ] Les 3 environnements sont cochés
- [ ] Application redéployée APRÈS l'ajout de la variable
- [ ] Déploiement terminé (statut "Ready")
- [ ] Test effectué sur l'URL du dernier déploiement
- [ ] Message affiché : `✅ Email envoyé` (pas "simulé")
- [ ] Boîte de réception vérifiée
- [ ] **Spams vérifiés** ⚠️
- [ ] Logs Vercel consultés
- [ ] Dashboard Resend consulté

---

**Date** : 1er Novembre 2025  
**Objectif** : Identifier pourquoi l'email n'arrive pas


