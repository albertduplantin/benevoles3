# 📧 Guide : Configuration de l'Email de Réinitialisation de Mot de Passe

## 🎯 Objectifs

- ✅ Personnaliser le titre de l'email
- ✅ Personnaliser le contenu en français
- ✅ Éviter que l'email arrive dans les spams
- ✅ Améliorer l'expérience utilisateur

---

## 📝 Problème Actuel

**Titre actuel** : `Reset your password for project-834828718841`
- ❌ En anglais
- ❌ Nom de projet technique peu compréhensible
- ❌ Va dans les spams

**Titre souhaité** : `Réinitialisez votre mot de passe Festival films courts`
- ✅ En français
- ✅ Nom explicite
- ✅ Professionnel

---

## 🔧 Solution 1 : Personnaliser le Template Firebase

### Étape 1 : Accéder aux Templates d'Emails

1. **Allez sur Firebase Console** : https://console.firebase.google.com
2. **Sélectionnez votre projet** : `benevoles3-a85b4`
3. **Dans le menu latéral**, cliquez sur **Authentication**
4. **Cliquez sur l'onglet "Templates"** (en haut)

### Étape 2 : Configurer le Template de Réinitialisation

1. **Trouvez** : **"Réinitialisation du mot de passe"** (ou "Password reset")
2. **Cliquez sur l'icône crayon** ✏️ pour éditer

### Étape 3 : Personnaliser le Contenu

#### 📌 Champ "Nom de l'expéditeur"
```
Festival Films Courts - Bénévoles
```

#### 📌 Champ "Objet de l'email" (Subject)
```
Réinitialisez votre mot de passe Festival films courts
```

#### 📌 Champ "Corps de l'email" (Body)
```html
<p>Bonjour,</p>

<p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte bénévole du <strong>Festival Films Courts</strong>.</p>

<p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>

<p><a href="%LINK%">Réinitialiser mon mot de passe</a></p>

<p>Ce lien est valable pendant 1 heure.</p>

<p><strong>Vous n'avez pas demandé cette réinitialisation ?</strong><br>
Ignorez cet email, votre mot de passe restera inchangé.</p>

<p>Cordialement,<br>
L'équipe du Festival Films Courts</p>

<hr>

<p style="font-size: 12px; color: #666;">
Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br>
%LINK%
</p>
```

⚠️ **Important** : Gardez bien `%LINK%` dans le corps de l'email, Firebase le remplacera automatiquement par le lien de réinitialisation.

### Étape 4 : Sauvegarder

1. **Cliquez sur "Enregistrer"**
2. ✅ Le template est maintenant personnalisé !

---

## 🛡️ Solution 2 : Éviter les Spams

### A. Configurer le Domaine d'Expéditeur (Recommandé)

Firebase permet d'utiliser votre propre domaine pour les emails.

#### Option 1 : Utiliser un domaine personnalisé (Meilleure solution)

1. **Allez dans** : Firebase Console → Authentication → Settings
2. **Trouvez** : "Authorized domains"
3. **Ajoutez votre domaine** : `festivalfilmscourts.fr` (si vous en avez un)

Puis configurez l'envoi SMTP personnalisé :

1. **Projet Firebase** → **Paramètres** → **Cloud Functions**
2. Configurez un service SMTP externe (SendGrid, Mailgun, etc.)

#### Option 2 : Améliorer la réputation du domaine Firebase (Plus simple)

Si vous utilisez le domaine Firebase par défaut, vous pouvez améliorer la délivrabilité :

### B. Configurer SPF, DKIM et DMARC

**⚠️ Attention** : Ceci nécessite un domaine personnalisé.

Si vous avez votre propre domaine (`festivalfilmscourts.fr`), ajoutez ces enregistrements DNS :

```
Type: TXT
Nom: @
Valeur: v=spf1 include:_spf.google.com include:_spf.firebasemail.com ~all
```

### C. Bonnes Pratiques pour Éviter les Spams

#### ✅ À faire :

1. **Nom d'expéditeur clair** : "Festival Films Courts - Bénévoles"
2. **Objet explicite** : "Réinitialisez votre mot de passe Festival films courts"
3. **Contenu en français** : Cohérent avec votre audience
4. **Lien HTTPS** : Firebase utilise automatiquement HTTPS
5. **Signature professionnelle** : Nom de l'organisation

#### ❌ À éviter :

- Majuscules excessives
- Points d'exclamation multiples
- Mots "spam" comme "urgent", "gratuit", etc.
- HTML mal formaté
- Trop d'images

---

## 🚀 Solution 3 : Template Personnalisé Avancé (HTML)

Pour un email encore plus professionnel, utilisez ce template HTML :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Festival Films Courts</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Espace Bénévoles</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">Réinitialisez votre mot de passe</h2>
              
              <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
                Bonjour,
              </p>
              
              <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
                Vous avez demandé à réinitialiser le mot de passe de votre compte bénévole. 
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
              </p>
              
              <!-- Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <a href="%LINK%" style="display: inline-block; padding: 16px 36px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                      Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #666666; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
                <strong>⏱️ Ce lien est valable pendant 1 heure.</strong>
              </p>
              
              <!-- Security Notice -->
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
                <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
                  <strong>🔒 Vous n'avez pas demandé cette réinitialisation ?</strong><br>
                  Ignorez simplement cet email. Votre mot de passe restera inchangé et votre compte est sécurisé.
                </p>
              </div>
              
              <p style="color: #666666; line-height: 1.6; margin: 25px 0 0 0;">
                Cordialement,<br>
                <strong>L'équipe du Festival Films Courts</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
              <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 0;">
                Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br>
                <a href="%LINK%" style="color: #667eea; word-break: break-all;">%LINK%</a>
              </p>
              
              <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 15px 0 0 0;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Comment l'utiliser :

1. Copiez tout le code HTML ci-dessus
2. Collez-le dans le champ "Corps de l'email" de Firebase
3. Assurez-vous que `%LINK%` est bien présent (2 fois)
4. Sauvegardez

---

## 📱 Test de l'Email

### Comment tester :

1. **Allez sur votre preview Vercel** :
   ```
   https://benevoles3-in22msc2n-albertduplantins-projects.vercel.app/auth/reset-password
   ```

2. **Entrez votre email** et envoyez

3. **Vérifiez** :
   - ✅ Le titre est correct
   - ✅ Le contenu est en français
   - ✅ L'email arrive dans la boîte de réception (pas spam)
   - ✅ Le lien fonctionne
   - ✅ Le design est professionnel

### Vérifier si l'email va dans les spams :

1. **Gmail** : Regardez dans "Spams" ou "Indésirables"
2. Si l'email est là, cliquez sur **"Non spam"**
3. Pour les prochains envois, créez un filtre :
   - Recherchez : `from:noreply@benevoles3-a85b4.firebaseapp.com`
   - Créez un filtre : **"Ne jamais envoyer dans les spams"**

---

## 🎯 Checklist de Configuration

- [ ] Template personnalisé dans Firebase
- [ ] Titre en français : "Réinitialisez votre mot de passe Festival films courts"
- [ ] Nom d'expéditeur : "Festival Films Courts - Bénévoles"
- [ ] Corps de l'email en français
- [ ] Design professionnel (HTML)
- [ ] Lien `%LINK%` présent
- [ ] Test effectué
- [ ] Email arrive dans la boîte de réception
- [ ] Domaine autorisé dans Firebase (Vercel)

---

## 💡 Conseils Supplémentaires

### Pour Gmail

Gmail marque souvent les nouveaux expéditeurs comme spam. Pour améliorer :

1. **Demandez aux bénévoles** d'ajouter l'email à leurs contacts :
   - `noreply@benevoles3-a85b4.firebaseapp.com`

2. **Créez une page d'aide** expliquant comment :
   - Vérifier les spams
   - Ajouter l'expéditeur à la liste blanche

### Pour Outlook/Hotmail

1. Assurez-vous que le HTML est bien formaté
2. Évitez les CSS trop complexes
3. Testez avec un compte Outlook

---

## 🚀 Pour Aller Plus Loin

### Solution Professionnelle : Service Email Dédié

Si vous voulez une solution encore plus professionnelle :

1. **SendGrid** (Gratuit jusqu'à 100 emails/jour)
2. **Mailgun** (Gratuit jusqu'à 5000 emails/mois)
3. **Amazon SES** (Très peu cher)

Ces services offrent :
- ✅ Meilleure délivrabilité
- ✅ Analytics détaillées
- ✅ Domaine personnalisé
- ✅ Templates avancés
- ✅ API complète

**Mais ce n'est pas nécessaire pour commencer !** Firebase suffit largement pour un festival de bénévoles.

---

## ✅ Résultat Attendu

Après configuration, vos bénévoles recevront :

**Avant** :
```
De : Firebase
Objet : Reset your password for project-834828718841
```

**Après** :
```
De : Festival Films Courts - Bénévoles
Objet : Réinitialisez votre mot de passe Festival films courts
```

Avec un email professionnel, en français, qui arrive dans la boîte de réception ! 🎉

---

## 🆘 Dépannage

### L'email va toujours dans les spams

1. Vérifiez que le domaine Vercel est autorisé dans Firebase
2. Demandez aux utilisateurs de marquer comme "Non spam"
3. Attendez quelques jours (la réputation se construit progressivement)
4. Envisagez un service email dédié

### Le template ne s'applique pas

1. Videz le cache du navigateur
2. Vérifiez que vous avez bien sauvegardé
3. Testez avec un nouvel email

### Le lien ne fonctionne pas

1. Vérifiez que `%LINK%` est bien dans le template
2. Vérifiez que le domaine est autorisé dans Firebase
3. Vérifiez que le lien n'a pas expiré (1 heure)

---

**Bon courage pour la configuration ! 🚀**

