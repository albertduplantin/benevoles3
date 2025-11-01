# 📧 Guide de Configuration Resend - Envoi d'Emails Réels

## 🎯 Vue d'ensemble

Ce guide vous explique comment configurer **Resend** pour envoyer de vrais emails depuis votre application.

**Statut actuel** : ✅ Code intégré - Besoin de configurer la clé API

---

## 🚀 Étape 1 : Créer un compte Resend (5 min)

### 1.1 Inscription

1. Allez sur : https://resend.com/
2. Cliquez sur **"Start Building"** ou **"Sign Up"**
3. Créez votre compte avec votre email
4. Vérifiez votre email (cliquez sur le lien de confirmation)

### 1.2 Se connecter

Une fois inscrit, connectez-vous au dashboard Resend.

---

## 🔑 Étape 2 : Obtenir une Clé API (2 min)

### 2.1 Créer une clé API

1. Dans le dashboard Resend, allez dans **"API Keys"** (menu de gauche)
2. Cliquez sur **"Create API Key"**
3. Donnez un nom : `benevoles3-production`
4. Permissions : Laissez **"Full Access"** (par défaut)
5. Cliquez sur **"Add"**

### 2.2 Copier la clé

⚠️ **IMPORTANT** : La clé ne s'affiche qu'**une seule fois** !

- La clé commence par `re_...`
- Copiez-la immédiatement dans un endroit sûr
- Si vous la perdez, il faudra en créer une nouvelle

**Exemple de clé** :
```
re_123abc456def789ghi012jkl345mno678pqr
```

---

## ☁️ Étape 3 : Configurer Vercel (3 min)

### 3.1 Aller sur le dashboard Vercel

1. Allez sur : https://vercel.com/
2. Connectez-vous à votre compte
3. Sélectionnez votre projet **`benevoles3`**

### 3.2 Ajouter la variable d'environnement

1. Allez dans **Settings** (en haut)
2. Dans le menu de gauche, cliquez sur **"Environment Variables"**
3. Cliquez sur **"Add New"**
4. Remplissez :
   - **Key** : `RESEND_API_KEY`
   - **Value** : Collez votre clé Resend (celle qui commence par `re_...`)
   - **Environments** : Cochez **tous les environnements** :
     - ✅ Production
     - ✅ Preview
     - ✅ Development
5. Cliquez sur **"Save"**

### 3.3 Redéployer

⚠️ Les variables d'environnement ne sont appliquées qu'aux **nouveaux déploiements**.

**Option A : Via Git** (Recommandé)
```bash
git commit --allow-empty -m "Trigger redeploy for Resend"
git push
```

**Option B : Via Vercel Dashboard**
1. Allez dans l'onglet **"Deployments"**
2. Cliquez sur les **3 points** du dernier déploiement
3. Cliquez sur **"Redeploy"**
4. Confirmez avec **"Redeploy"**

---

## 💻 Étape 4 : Configuration Locale (Développement)

Pour tester en local (optionnel) :

### 4.1 Ajouter au fichier .env.local

```bash
# Dans benevoles3/.env.local
RESEND_API_KEY=re_votre_cle_ici
```

### 4.2 Redémarrer le serveur

```bash
npm run dev
```

---

## 📧 Étape 5 : Configuration de l'Adresse d'Envoi

### Option 1 : Utiliser le Domaine par Défaut (Gratuit)

Par défaut, l'application utilise :
```
Festival Films Courts <noreply@updates.resend.dev>
```

✅ **Avantages** :
- Fonctionne immédiatement
- Aucune configuration nécessaire

⚠️ **Inconvénients** :
- Adresse générique
- Moins professionnel
- Peut finir en spam plus facilement

### Option 2 : Utiliser Votre Propre Domaine (Recommandé)

Si vous avez un domaine (ex: `festivalfilmscourts.fr`) :

#### 5.1 Ajouter le domaine sur Resend

1. Dans Resend Dashboard → **"Domains"**
2. Cliquez sur **"Add Domain"**
3. Entrez votre domaine : `festivalfilmscourts.fr`
4. Suivez les instructions pour ajouter les enregistrements DNS :
   - SPF
   - DKIM
   - DMARC (optionnel)

#### 5.2 Vérifier le domaine

Resend vérifiera automatiquement les enregistrements DNS (peut prendre 24-48h).

#### 5.3 Modifier l'adresse d'envoi

Dans `app/api/volunteer-calls/send-email/route.ts`, ligne 205 :

**Avant** :
```typescript
from: 'Festival Films Courts <noreply@updates.resend.dev>',
```

**Après** :
```typescript
from: 'Festival Films Courts <benevoles@festivalfilmscourts.fr>',
```

Puis redéployer.

---

## 🧪 Étape 6 : Tester l'Envoi

### 6.1 Tester en Preview/Production

1. Allez sur votre application déployée
2. Connectez-vous en tant qu'admin
3. Allez sur `/dashboard/volunteer-call`
4. Sélectionnez **1 seule mission** (pour tester)
5. Type de destinataires : **"Liste personnalisée"**
6. Sélectionnez **VOUS-MÊME uniquement** (votre propre email)
7. Cliquez sur **"Envoyer par Email"**

### 6.2 Vérifier la Réception

1. Vérifiez votre boîte email
2. Vérifiez aussi les **spams** (au cas où)
3. L'email devrait arriver en quelques secondes

### 6.3 Vérifier les Logs Vercel

1. Vercel Dashboard → **"Functions"** → **"Logs"**
2. Cherchez les logs de l'API `/api/volunteer-calls/send-email`
3. Vous devriez voir : `✅ 1/1 emails envoyés avec succès`

### 6.4 Vérifier Resend Dashboard

1. Resend Dashboard → **"Emails"**
2. Vous devriez voir votre email envoyé
3. Statut : **"Delivered"** (si tout va bien)

---

## 🎯 Comportement de l'Application

### Avec RESEND_API_KEY configurée

✅ **Envoi réel d'emails via Resend**
- Les emails sont vraiment envoyés
- Toast : `✅ Email envoyé à X bénévole(s) !`
- Logs : `📧 Envoi réel d'emails à X bénévoles via Resend`

### Sans RESEND_API_KEY (mode simulation)

⚠️ **Envoi simulé (console.log)**
- Aucun email n'est envoyé
- Toast : `⚠️ Envoi simulé à X bénévole(s) (RESEND_API_KEY non configurée)`
- Logs : `⚠️ RESEND_API_KEY non configurée - Envoi simulé`
- Statut Firestore : `simulated`

---

## 📊 Limites du Plan Gratuit

### Resend Free Plan

| Limite | Valeur |
|--------|--------|
| Emails/mois | 3000 |
| Emails/jour | ~100 |
| Emails/heure | Illimité |
| Destinataires | Illimité |
| Domaines personnalisés | 1 |

**Suffisant pour** :
- ✅ Festival avec 50-100 bénévoles
- ✅ 1-2 appels par semaine
- ✅ Emails de notification automatiques

**Insuffisant pour** :
- ❌ Newsletter hebdomadaire à 1000+ abonnés
- ❌ Emails marketing massifs

---

## ⚠️ Bonnes Pratiques Anti-Spam

### 1. Respecter les Préférences

L'application respecte déjà les préférences de notification des bénévoles.

### 2. Ne Pas Spammer

- ⏰ Maximum 1-2 appels par semaine
- 🎯 Cibler précisément (par catégorie, sans mission, etc.)
- 📧 Ne pas envoyer à tout le monde à chaque fois

### 3. Contenu de Qualité

- ✍️ Message clair et personnalisé
- 🎯 Sujet explicite
- 🚫 Éviter les mots "spam" (URGENT, GRATUIT, GAGNEZ, etc.)

### 4. Faciliter la Désinscription

Dans le futur, ajouter un lien de désinscription dans le footer des emails.

---

## 🐛 Dépannage

### Problème : "RESEND_API_KEY non configurée"

**Solution** :
1. Vérifiez que la variable est bien ajoutée sur Vercel
2. Vérifiez le nom exact : `RESEND_API_KEY` (sensible à la casse)
3. Redéployez l'application

### Problème : Emails n'arrivent Pas

**Vérifications** :
1. ✅ Vérifiez les **spams**
2. ✅ Vérifiez Resend Dashboard → Emails → Statut
3. ✅ Vérifiez les logs Vercel
4. ✅ Si domaine personnalisé : vérifiez que les DNS sont bien configurés

**Statuts Resend possibles** :
- ✅ `delivered` : Email reçu
- ⏳ `pending` : En cours d'envoi
- ⚠️ `bounced` : Email invalide
- 🚫 `rejected` : Bloqué par le destinataire

### Problème : "Rate Limit Exceeded"

Si vous atteignez la limite :

**Solution court terme** :
- Attendre 1 mois (reset automatique)
- Cibler moins de destinataires

**Solution long terme** :
- Passer au plan payant Resend ($20/mois = 50 000 emails)

---

## 💰 Coûts

### Plan Gratuit (Actuel)

```
0€/mois
- 3000 emails/mois
- 1 domaine personnalisé
- Support email
```

**✅ Recommandé pour** :
- MVP / Test
- Petits festivals (<100 bénévoles)

### Plan Pro (Si Besoin Plus Tard)

```
20$/mois (~19€)
- 50 000 emails/mois
- Domaines illimités
- Support prioritaire
- Analytics avancées
```

**✅ Recommandé pour** :
- Festivals moyens/grands (100-500 bénévoles)
- Newsletter régulière

---

## 📝 Checklist de Configuration

Avant de marquer comme terminé, vérifiez :

### Configuration Resend
- [ ] Compte Resend créé
- [ ] Clé API générée et sauvegardée
- [ ] (Optionnel) Domaine personnalisé ajouté et vérifié

### Configuration Vercel
- [ ] Variable `RESEND_API_KEY` ajoutée
- [ ] Variable appliquée à tous les environnements
- [ ] Application redéployée

### Tests
- [ ] Envoi de test à vous-même réussi
- [ ] Email reçu (vérifier spams)
- [ ] Logs Vercel confirment l'envoi réel
- [ ] Resend Dashboard montre l'email comme "delivered"

### Documentation
- [ ] Équipe informée de la nouvelle fonctionnalité
- [ ] Process d'envoi d'appels documenté

---

## 📞 Support

### Documentation Resend
- https://resend.com/docs

### Limite de Taux
- https://resend.com/docs/api-reference/introduction#rate-limit

### Statuts des Emails
- https://resend.com/docs/dashboard/emails/email-statuses

---

## 🎉 Félicitations !

Une fois configuré, votre application peut envoyer de **vrais emails** aux bénévoles ! 

**Prochaines étapes** :
1. Tester avec un petit groupe
2. Affiner les messages
3. Former l'équipe à l'utilisation
4. (Optionnel) Configurer un domaine personnalisé

---

**Date de création** : 1er Novembre 2025  
**Version** : 1.0.0  
**Service** : Resend (Plan Gratuit - 3000 emails/mois)


