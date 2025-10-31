# 🚀 Configuration Rapide - Email de Réinitialisation

## ⚡ À faire MAINTENANT (5 minutes)

### 1️⃣ Ouvrir Firebase Console

**Lien direct** : https://console.firebase.google.com/project/benevoles3-a85b4/authentication/emails

Ou manuellement :
1. https://console.firebase.google.com
2. Projet : `benevoles3-a85b4`
3. Authentication → Templates

---

### 2️⃣ Modifier le Template "Réinitialisation du mot de passe"

Cliquez sur ✏️ (éditer) à côté de "Réinitialisation du mot de passe"

---

### 3️⃣ Remplir les Champs

#### 📧 Nom de l'expéditeur
```
Festival Films Courts - Bénévoles
```

#### 📝 Objet de l'email
```
Réinitialisez votre mot de passe Festival films courts
```

#### 📄 Corps de l'email (Version Simple)

Copiez-collez ce texte :

```
Bonjour,

Vous avez demandé à réinitialiser votre mot de passe pour votre compte bénévole du Festival Films Courts.

Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :

%LINK%

Ce lien est valable pendant 1 heure.

Vous n'avez pas demandé cette réinitialisation ?
Ignorez cet email, votre mot de passe restera inchangé.

Cordialement,
L'équipe du Festival Films Courts

---
Si le lien ne fonctionne pas, copiez-collez cette adresse dans votre navigateur :
%LINK%
```

⚠️ **IMPORTANT** : Ne supprimez pas `%LINK%` ! Firebase le remplacera automatiquement.

---

### 4️⃣ Sauvegarder

Cliquez sur **"Enregistrer"** en bas de la page.

---

## ✅ C'est fait !

Testez maintenant : https://benevoles3-in22msc2n-albertduplantins-projects.vercel.app/auth/reset-password

---

## 🎨 Vous voulez un email plus beau ?

**Consultez le guide complet** : [`GUIDE_CONFIGURATION_EMAIL_RESET_PASSWORD.md`](./GUIDE_CONFIGURATION_EMAIL_RESET_PASSWORD.md)

Il contient un template HTML professionnel avec :
- Design moderne avec dégradé violet
- Bouton stylisé
- Mise en page responsive
- Icônes et couleurs

---

## 🛡️ Problème de Spam ?

Si l'email va encore dans les spams après configuration :

### Solution Rapide

1. **Marquez comme "Non spam"** dans votre boîte email
2. **Ajoutez à vos contacts** : `noreply@benevoles3-a85b4.firebaseapp.com`
3. **Créez un filtre Gmail** :
   - Recherchez : `from:noreply@benevoles3-a85b4.firebaseapp.com`
   - Créez un filtre : "Ne jamais envoyer dans les spams"

### Solution Complète

Voir la section "Éviter les spams" dans : [`GUIDE_CONFIGURATION_EMAIL_RESET_PASSWORD.md`](./GUIDE_CONFIGURATION_EMAIL_RESET_PASSWORD.md)

---

## 📞 Besoin d'aide ?

- Guide détaillé : [`GUIDE_CONFIGURATION_EMAIL_RESET_PASSWORD.md`](./GUIDE_CONFIGURATION_EMAIL_RESET_PASSWORD.md)
- Documentation Firebase : https://firebase.google.com/docs/auth/custom-email-handler

---

**Temps total** : ⏱️ 5 minutes

**C'est parti ! 🚀**

