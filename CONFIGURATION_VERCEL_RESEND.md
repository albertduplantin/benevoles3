# 🔐 Configuration Vercel - Clé API Resend

## ⚠️ IMPORTANT - SÉCURITÉ

Cette clé API est **CONFIDENTIELLE** :
- ❌ Ne jamais la commiter dans Git
- ❌ Ne jamais la partager publiquement
- ❌ Ne jamais l'inclure dans le code
- ✅ Uniquement dans les variables d'environnement Vercel

---

## 🚀 Configuration sur Vercel (3 minutes)

### Étape 1 : Aller sur le Dashboard Vercel

1. Ouvrez votre navigateur
2. Allez sur : **https://vercel.com/**
3. Connectez-vous avec votre compte
4. Sélectionnez le projet **`benevoles3`**

### Étape 2 : Accéder aux Variables d'Environnement

1. Cliquez sur l'onglet **"Settings"** (en haut)
2. Dans le menu de gauche, cliquez sur **"Environment Variables"**

### Étape 3 : Ajouter la Variable RESEND_API_KEY

1. Cliquez sur le bouton **"Add New"** (en haut à droite)

2. Remplissez le formulaire :

   **Name (Key)** :
   ```
   RESEND_API_KEY
   ```

   **Value** :
   ```
   [COLLEZ VOTRE CLE RESEND ICI - Elle commence par re_]
   ```

3. **Environments** - Cochez les 3 cases :
   - ☑️ **Production**
   - ☑️ **Preview**
   - ☑️ **Development**

4. Cliquez sur **"Save"**

### Étape 4 : Vérifier que la Variable est Bien Ajoutée

Vous devriez voir dans la liste :
```
RESEND_API_KEY    Production, Preview, Development    [Hidden]
```

---

## 🔄 Redéployer l'Application

Les variables d'environnement ne sont appliquées qu'aux **nouveaux déploiements**.

### Option A : Depuis votre Terminal (Recommandé)

```bash
cd benevoles3
git commit --allow-empty -m "Trigger redeploy for Resend configuration"
git push origin feature/volunteer-call-v2-preview
```

### Option B : Depuis Vercel Dashboard

1. Allez dans l'onglet **"Deployments"**
2. Trouvez le dernier déploiement
3. Cliquez sur les **3 points** (⋮) à droite
4. Cliquez sur **"Redeploy"**
5. Dans la popup, cliquez sur **"Redeploy"** pour confirmer

---

## ⏱️ Attendre le Déploiement

Le redéploiement prend environ **2-3 minutes**.

Vous pouvez suivre la progression :
1. Vercel Dashboard → Onglet **"Deployments"**
2. Le déploiement en cours aura un badge **"Building"** puis **"Ready"**
3. Attendez que le statut soit ✅ **"Ready"**

---

## 🧪 Tester l'Envoi Réel

### Une fois le déploiement terminé :

1. **Allez sur votre preview Vercel**
   - L'URL est dans l'onglet "Deployments" → Cliquez sur "Visit"

2. **Connectez-vous** avec vos identifiants

3. **Allez sur** `/dashboard/volunteer-call`

4. **Faites un test avec VOUS-MÊME** :
   - Sélectionnez **1 seule mission**
   - Type de destinataires : **"Liste personnalisée"**
   - Cochez **UNIQUEMENT votre propre email**
   - Sujet : "Test Resend - Appel Bénévoles"
   - Cliquez sur **"Envoyer par Email"**

5. **Vérifiez votre boîte email** (et les spams)
   - L'email devrait arriver en quelques secondes
   - De : **Festival Films Courts <noreply@updates.resend.dev>**
   - Sujet : **Test Resend - Appel Bénévoles**

---

## ✅ Résultat Attendu

### Avant (sans clé API)
```
⚠️ Envoi simulé à 1 bénévole(s) 
(RESEND_API_KEY non configurée)
```

### Après (avec clé API configurée)
```
✅ Email envoyé à 1 bénévole(s) !
```

Et vous recevez **vraiment l'email** ! 🎉

---

## 🔍 Vérifications Supplémentaires

### 1. Vérifier les Logs Vercel

1. Vercel Dashboard → Onglet **"Functions"**
2. Cliquez sur **"Logs"**
3. Cherchez les logs récents de `/api/volunteer-calls/send-email`
4. Vous devriez voir :
   ```
   📧 Envoi réel d'emails à 1 bénévoles via Resend
   ✅ 1/1 emails envoyés avec succès
   ```

### 2. Vérifier le Dashboard Resend

1. Allez sur **https://resend.com/emails**
2. Vous devriez voir votre email envoyé
3. Statut : **"Delivered"** ✅

---

## 🎯 Utilisation Normale

Une fois configuré, l'envoi d'emails fonctionne normalement :

1. Allez sur `/dashboard/volunteer-call`
2. Sélectionnez les missions
3. Choisissez les destinataires
4. Personnalisez le message
5. Envoyez !

Les emails sont **vraiment envoyés** aux bénévoles ! 📧

---

## 💾 Configuration en Local (Optionnel)

Si vous voulez tester en local aussi :

1. **Créez ou modifiez** `.env.local` dans `benevoles3/` :
   ```bash
   RESEND_API_KEY=[VOTRE_CLE_RESEND_ICI]
   ```

2. **Redémarrez** le serveur :
   ```bash
   npm run dev
   ```

⚠️ **N'oubliez pas** : `.env.local` est dans `.gitignore`, il ne sera jamais commité.

---

## 📊 Limites à Connaître

Avec le plan gratuit Resend :

| Limite | Valeur |
|--------|--------|
| Emails/mois | 3000 |
| Emails/jour | ~100 |
| Emails/envoi | Illimité |

**Conseils** :
- Ne pas envoyer à tous les bénévoles à chaque fois
- Cibler précisément (par catégorie, sans mission, etc.)
- Maximum 1-2 appels par semaine

---

## 🐛 Dépannage

### Problème : Toujours "Envoi simulé"

**Solutions** :
1. Vérifiez que la variable est bien nommée : `RESEND_API_KEY` (respecter la casse)
2. Vérifiez qu'elle est cochée pour les 3 environnements
3. Redéployez l'application
4. Attendez que le déploiement soit terminé (statut "Ready")
5. Videz le cache du navigateur (Ctrl+Shift+R)

### Problème : Email n'arrive pas

**Vérifications** :
1. ✅ Vérifiez les **spams**
2. ✅ Vérifiez Resend Dashboard → Emails
3. ✅ Vérifiez les logs Vercel
4. ✅ Vérifiez que l'email du destinataire est correct

### Problème : Erreur "Invalid API key"

**Solutions** :
1. Vérifiez que vous avez copié la clé complète
2. Vérifiez qu'il n'y a pas d'espaces avant/après
3. Si besoin, générez une nouvelle clé sur Resend

---

## 🔒 Sécurité - Rappels Importants

### ✅ À FAIRE
- Garder la clé dans les variables d'environnement Vercel
- Utiliser `.env.local` en développement local
- Régénérer la clé si elle est compromise

### ❌ À NE JAMAIS FAIRE
- Commiter la clé dans Git
- Partager la clé publiquement
- L'inclure dans le code source
- La mettre dans un fichier non ignoré par Git

---

## 📞 Support

**Dashboard Resend** : https://resend.com/emails  
**Dashboard Vercel** : https://vercel.com/albertduplantins-projects/benevoles3  
**Logs Vercel** : https://vercel.com/albertduplantins-projects/benevoles3/logs  

---

## ✅ Checklist Finale

Avant de considérer comme terminé :

- [ ] Variable `RESEND_API_KEY` ajoutée sur Vercel
- [ ] Cochée pour les 3 environnements (Production, Preview, Development)
- [ ] Application redéployée
- [ ] Déploiement terminé (statut "Ready")
- [ ] Test d'envoi à vous-même effectué
- [ ] Email reçu dans votre boîte (vérifier spams)
- [ ] Logs Vercel confirment l'envoi réel
- [ ] Dashboard Resend montre l'email comme "Delivered"

---

## 🎉 Félicitations !

Une fois ces étapes complétées, votre application peut **envoyer de vrais emails** aux bénévoles !

**Plan gratuit Resend** : 3000 emails/mois = Largement suffisant pour votre festival ! 🚀

---

**Date** : 1er Novembre 2025  
**Clé API** : `re_jJaA821r_***` (masquée pour sécurité)  
**Statut** : Prêt à configurer sur Vercel


