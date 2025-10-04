# 📧 Configuration EmailJS - Guide Rapide

## ✅ Avantages d'EmailJS

- ✅ **Gratuit** : 200 emails/mois sans carte bancaire
- ✅ **Facile** : Configuration en 5 minutes
- ✅ **Pas de restrictions** : Envoi à n'importe quelle adresse
- ✅ **Templates visuels** : Éditeur de templates intégré

---

## 🚀 Configuration (5 minutes)

### **Étape 1 : Créer un compte EmailJS**

1. Allez sur [https://www.emailjs.com](https://www.emailjs.com)
2. Cliquez sur **"Sign Up"**
3. Créez un compte (gratuit)
4. Confirmez votre email

---

### **Étape 2 : Connecter votre compte email**

1. Dans le dashboard EmailJS → **"Email Services"**
2. Cliquez sur **"Add New Service"**
3. Choisissez **Gmail** (recommandé) ou votre service email
4. Suivez les instructions pour connecter votre compte
5. Notez le **Service ID** (ex: `service_xxxxxx`)

**Note** : Si vous utilisez Gmail, activez l'accès pour les applications moins sécurisées ou utilisez un mot de passe d'application.

---

### **Étape 3 : Créer un template d'email**

1. Dans le dashboard → **"Email Templates"**
2. Cliquez sur **"Create New Template"**
3. Configurez le template :

#### **Template 1 : Confirmation d'inscription**

**Template ID** : `mission_registration`

**Sujet** :
```
🎬 Confirmation d'inscription - {{mission_title}}
```

**Contenu** :
```html
Bonjour {{volunteer_name}},

Votre inscription à la mission suivante a bien été confirmée :

📋 Mission : {{mission_title}}
📍 Lieu : {{mission_location}}
📅 Date : {{mission_date}}
🕐 Heure : {{mission_time}}

Merci pour votre engagement ! 🙌

L'équipe du Festival Films Courts de Dinan 2025
```

4. Cliquez sur **"Save"**
5. Notez le **Template ID**

---

### **Étape 4 : Obtenir vos clés API**

1. Dashboard → **"Account"** → **"General"**
2. Notez votre **Public Key** (ex: `your_public_key`)
3. Générez une **Private Key** (ex: `your_private_key`)

---

### **Étape 5 : Ajouter dans `.env.local`**

```env
# EmailJS
EMAILJS_SERVICE_ID=service_xxxxxx
EMAILJS_TEMPLATE_REGISTRATION=mission_registration
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3001
```

---

## 📝 Exemple de configuration complète

### **.env.local**
```env
# Firebase (déjà configuré)
FIREBASE_ADMIN_PROJECT_ID=benevoles3-a85b4
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@benevoles3-a85b4.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# EmailJS
EMAILJS_SERVICE_ID=service_abc123
EMAILJS_TEMPLATE_REGISTRATION=mission_registration
EMAILJS_PUBLIC_KEY=abcdefghijklmn
EMAILJS_PRIVATE_KEY=xyz123456789
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3001
```

---

## 🎯 Prochaine étape

Une fois configuré, je vais :
1. ✅ Créer un nouveau fichier `lib/email/emailjs-config.ts`
2. ✅ Adapter les fonctions d'envoi
3. ✅ Tester l'envoi d'emails

---

## 🆘 Aide

- Documentation : https://www.emailjs.com/docs/
- Support : https://www.emailjs.com/support/

---

**Prêt à configurer ?** Allez sur https://www.emailjs.com et créez votre compte ! 🚀

