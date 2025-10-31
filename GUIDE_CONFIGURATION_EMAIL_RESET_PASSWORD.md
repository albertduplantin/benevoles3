# 📧 Guide : Configuration de l'Email de Réinitialisation de Mot de Passe

## ⚠️ IMPORTANT : Limitations Firebase

**Firebase limite la personnalisation** des emails d'authentification pour éviter le spam.

### Ce que vous POUVEZ personnaliser :
- ✅ **Nom de l'expéditeur**
- ✅ **Objet de l'email**
- ✅ **Adresse de réponse** (optionnel)

### Ce que vous NE POUVEZ PAS faire :
- ❌ Modifier le corps HTML complet de l'email
- ❌ Changer le design/layout
- ❌ Ajouter votre propre template HTML personnalisé

**C'est une limitation de Firebase, pas un bug !**

---

## 🎯 Objectifs Réalistes

- ✅ Personnaliser le nom de l'expéditeur (professionnel)
- ✅ Personnaliser l'objet en français
- ✅ Minimiser le risque de spam
- ✅ Informer les utilisateurs sur où trouver l'email

---

## 📝 Problème Actuel

**Titre actuel** : `Reset your password for project-834828718841`
- ❌ En anglais
- ❌ Nom de projet technique peu compréhensible

**Titre souhaité** : `Réinitialisez votre mot de passe Festival films courts`
- ✅ En français
- ✅ Nom explicite
- ✅ Professionnel

---

## 🔧 Solution : Configuration Firebase (La Seule Possible)

### Étape 1 : Accéder aux Templates d'Emails

1. **Allez sur Firebase Console** : https://console.firebase.google.com
2. **Sélectionnez votre projet** : `benevoles3-a85b4`
3. **Dans le menu latéral**, cliquez sur **Authentication**
4. **Cliquez sur l'onglet "Templates"** (en haut)

### Étape 2 : Configurer le Template de Réinitialisation

1. **Trouvez** : **"Réinitialisation du mot de passe"** (ou "Password reset")
2. **Cliquez sur l'icône crayon** ✏️ pour éditer

### Étape 3 : Personnaliser les Champs Disponibles

⚠️ **Note** : Firebase affichera un avertissement disant "Pour éviter le spam, le message ne peut pas être modifié". C'est normal !

#### 📌 Champ "Nom de l'expéditeur" ✅
```
Festival Films Courts
```

#### 📌 Champ "Objet de l'email" (Subject) ✅
```
Réinitialisez votre mot de passe Festival films courts
```

#### 📌 Champ "Adresse de réponse" (optionnel) ✅
```
support@votredomaine.fr
```
(Laissez vide si vous n'avez pas d'adresse email de support)

#### 📌 Champ "Corps de l'email" ❌
**Vous ne pouvez PAS modifier ce champ** - Firebase utilisera son template par défaut pour éviter le spam.

### Étape 4 : Sauvegarder

1. **Cliquez sur "Enregistrer"**
2. ✅ C'est fait ! (Oui, c'est tout ce qu'on peut faire 😅)

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

## 🚫 Solution Alternative : Template HTML Personnalisé

### ❌ Impossible avec Firebase Authentication

Firebase **ne permet pas** de modifier le template HTML des emails d'authentification.

**Pourquoi ?**
- Pour éviter que leur service soit utilisé pour envoyer du spam
- Pour maintenir la sécurité et la réputation de leurs serveurs email
- C'est une limitation volontaire de Firebase

### ✅ Solutions de Contournement

Si vous avez **absolument besoin** d'un email personnalisé :

#### Option 1 : Service Email Dédié (Recommandé pour production)

Utilisez un service externe pour les emails :
- **SendGrid** (Gratuit jusqu'à 100 emails/jour)
- **Mailgun** (Gratuit jusqu'à 5000 emails/mois)  
- **Amazon SES** (Très peu cher)
- **Resend** (Moderne et simple)

**Avantages** :
- ✅ Contrôle total du design HTML
- ✅ Meilleure délivrabilité
- ✅ Analytics détaillées
- ✅ Domaine personnalisé

**Inconvénients** :
- ❌ Configuration plus complexe
- ❌ Coût (même si faible)
- ❌ Nécessite un backend custom

#### Option 2 : Accepter les Limitations Firebase (Recommandé pour MVP)

**Pour un festival de bénévoles, Firebase suffit largement !**

Concentrez-vous sur :
- ✅ Nom d'expéditeur clair
- ✅ Objet explicite en français
- ✅ Instructions claires dans l'interface
- ✅ Aide pour trouver l'email (vérifier spams)

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

