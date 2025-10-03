# Configuration de Resend pour les Notifications Email

## 📧 Mise en place de Resend

### 1. Créer un compte Resend

1. Allez sur [https://resend.com](https://resend.com)
2. Créez un compte gratuitement
3. **Plan gratuit** : 3000 emails/mois, 100 emails/jour

### 2. Obtenir votre clé API

1. Une fois connecté, allez dans **"API Keys"**
2. Cliquez sur **"Create API Key"**
3. Donnez un nom (ex: "Festival Benevoles Production")
4. Copiez la clé API (format : `re_xxxxxxxxxxxxxx`)

### 3. Ajouter la clé dans votre projet

#### **En local** :

Créez ou modifiez le fichier `.env.local` à la racine du projet :

```env
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# URL de l'application (pour les liens dans les emails)
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
```

#### **Sur Vercel (production)** :

1. Allez dans votre projet Vercel
2. **Settings** → **Environment Variables**
3. Ajoutez :
   - `RESEND_API_KEY` = `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`
   - `NEXT_PUBLIC_APP_BASE_URL` = `https://benevoles3.vercel.app`
4. Redéployez l'application

### 4. Vérifier votre email (important !)

Par défaut, Resend n'autorise l'envoi **qu'aux emails vérifiés** :

1. Dans Resend, allez dans **"Domains"**
2. Cliquez sur **"Add email"** 
3. Ajoutez votre email de test
4. Confirmez via l'email reçu

### 5. (Optionnel) Configurer votre domaine

Pour utiliser votre propre domaine (ex: `noreply@festival-dinan.fr`) :

1. Dans Resend, allez dans **"Domains"**
2. Ajoutez votre domaine
3. Configurez les enregistrements DNS (SPF, DKIM)
4. Attendez la vérification (quelques heures)
5. Modifiez `DEFAULT_FROM_EMAIL` dans `lib/email/resend-config.ts`

---

## 🧪 Tester l'envoi d'emails

### Test manuel dans votre application :

1. Inscrivez-vous à une mission
2. Vérifiez votre boîte email
3. Vous devriez recevoir un email de confirmation

### Test via l'API :

```bash
curl -X POST http://localhost:3000/api/notifications/registration \
  -H "Content-Type: application/json" \
  -d '{
    "volunteerId": "USER_ID",
    "missionId": "MISSION_ID"
  }'
```

---

## 📊 Fonctionnalités implémentées

### ✅ Emails automatiques :

1. **Confirmation d'inscription** → Envoyé dès qu'un bénévole s'inscrit
2. **Rappel 24h avant** → (À implémenter avec un cron job)

### ✅ Respect des préférences :

- Vérifie `consents.communications`
- Vérifie `notificationPreferences.email`
- N'envoie **pas** si désactivé

---

## 🚨 Limites et Quotas

### Plan gratuit Resend :

- ✅ **3000 emails/mois**
- ✅ **100 emails/jour**
- ✅ Support email

### Si vous dépassez :

1. Passez au plan payant ($20/mois pour 50k emails)
2. Ou utilisez un autre service (SendGrid, Mailgun, etc.)

---

## 🔧 Troubleshooting

### "Resend API key is required"

→ Vérifiez que `RESEND_API_KEY` est bien défini dans `.env.local`

### "Email address is not verified"

→ Vérifiez votre email dans le dashboard Resend

### "Rate limit exceeded"

→ Vous avez dépassé les 100 emails/jour (plan gratuit)

### Les emails vont dans les spams

→ Configurez votre propre domaine avec SPF/DKIM

---

## 📝 Prochaines étapes

1. ✅ Configuration Resend
2. ⏳ Implémenter les rappels automatiques (cron job)
3. ⏳ Interface admin pour notifications manuelles
4. ⏳ Logs des emails envoyés
5. ⏳ Templates d'emails supplémentaires

---

## 🆘 Besoin d'aide ?

Documentation Resend : https://resend.com/docs

