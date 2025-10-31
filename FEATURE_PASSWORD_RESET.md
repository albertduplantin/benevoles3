# Fonctionnalité : Récupération de mot de passe

## 📝 Description

Système simple de récupération de mot de passe pour les bénévoles étourdis qui ont oublié leur mot de passe. Utilise Firebase Authentication pour un processus sécurisé et simple.

## ✨ Fonctionnalités

- **Formulaire de récupération** : Interface simple et claire
- **Envoi d'email automatique** : Firebase envoie un email de réinitialisation
- **Messages de confirmation** : Feedback visuel pour l'utilisateur
- **Lien depuis la page de connexion** : Accès facile via "Mot de passe oublié ?"
- **Gestion d'erreurs** : Messages d'erreur en français

## 🎯 Comment ça fonctionne ?

### Pour les bénévoles

1. Sur la page de connexion, cliquer sur **"Mot de passe oublié ?"**
2. Entrer leur adresse email
3. Cliquer sur **"Envoyer le lien de réinitialisation"**
4. Recevoir un email de Firebase avec un lien
5. Cliquer sur le lien dans l'email
6. Choisir un nouveau mot de passe
7. Se reconnecter avec le nouveau mot de passe

### Pour les administrateurs

Aucune action requise ! Le système est complètement automatique grâce à Firebase Authentication.

## 📂 Fichiers créés

### 1. Composant formulaire
**`components/features/auth/reset-password-form.tsx`**
- Formulaire de saisie de l'email
- Validation avec Zod
- Gestion des états (chargement, erreur, succès)
- Interface utilisateur avec feedback visuel
- Écran de confirmation après envoi

### 2. Page de réinitialisation
**`app/auth/reset-password/page.tsx`**
- Route : `/auth/reset-password`
- Métadonnées pour le SEO
- Mise en page centrée

### 3. Fonction dans lib/firebase/auth.ts
La fonction `resetPassword()` existait déjà mais n'était pas utilisée :
```typescript
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error resetting password:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}
```

## 🔗 Intégration

Le lien est déjà présent dans le formulaire de connexion (`components/features/auth/login-form.tsx`), ligne 108-113 :

```tsx
<Link
  href="/auth/reset-password"
  className="text-sm text-primary hover:underline"
>
  Mot de passe oublié ?
</Link>
```

## 🧪 Tests

### Test manuel

1. **Accès à la page** :
   ```
   http://localhost:3000/auth/reset-password
   ```

2. **Test avec un email valide** :
   - Entrer un email existant dans le système
   - Vérifier la réception de l'email
   - Cliquer sur le lien et réinitialiser

3. **Test avec un email invalide** :
   - Entrer un email qui n'existe pas
   - Vérifier que le message d'erreur s'affiche

4. **Test de validation** :
   - Entrer un email mal formaté
   - Vérifier que la validation fonctionne

### Cas d'usage à tester

- ✅ Bénévole qui a oublié son mot de passe
- ✅ Email non trouvé dans le système
- ✅ Email mal formaté
- ✅ Clic sur "Retour à la connexion"
- ✅ Clic sur "Réessayer" si l'email n'est pas reçu
- ✅ Vérification des spams

## 🎨 Interface utilisateur

### Page de saisie de l'email
- Icône mail avec fond de couleur
- Titre : "Mot de passe oublié ?"
- Description explicative
- Champ email avec validation
- Bouton "Envoyer le lien de réinitialisation"
- Bouton "Retour à la connexion"

### Page de confirmation
- Icône check vert
- Titre : "Email envoyé !"
- Email de destination affiché
- Instructions claires sur les étapes suivantes
- Lien pour réessayer
- Bouton "Retour à la connexion"

## 🔒 Sécurité

- **Firebase Authentication** : Utilise le système sécurisé de Firebase
- **Liens temporaires** : Les liens de réinitialisation expirent après un certain temps
- **Pas de stockage** : Aucun token ou mot de passe stocké en clair
- **Rate limiting** : Firebase gère automatiquement les tentatives abusives

## 📧 Configuration de l'email

Les emails sont envoyés automatiquement par Firebase. Pour personnaliser l'apparence et éviter les spams :

**📖 Consultez le guide détaillé** : [`GUIDE_CONFIGURATION_EMAIL_RESET_PASSWORD.md`](./GUIDE_CONFIGURATION_EMAIL_RESET_PASSWORD.md)

Ce guide vous explique comment :
- ✅ Changer le titre en français : "Réinitialisez votre mot de passe Festival films courts"
- ✅ Personnaliser le contenu de l'email
- ✅ Éviter que l'email arrive dans les spams
- ✅ Utiliser un template HTML professionnel

## ⚠️ Note importante

- **Personnalisation** : L'email peut être entièrement personnalisé dans Firebase Console
- **Spams** : Le premier email peut arriver dans les spams, voir le guide de configuration
- **Configuration requise** : Suivre le guide [`GUIDE_CONFIGURATION_EMAIL_RESET_PASSWORD.md`](./GUIDE_CONFIGURATION_EMAIL_RESET_PASSWORD.md)

## 🚀 Améliorations futures possibles

1. **Service email dédié** : SendGrid, Mailgun pour meilleure délivrabilité
2. **Notification admin** : Alerter les admins des réinitialisations
3. **Historique** : Garder une trace des réinitialisations
4. **SMS** : Option de réinitialisation par SMS
5. **Questions de sécurité** : Vérification supplémentaire

## 📱 Mobile

L'interface est entièrement responsive et fonctionne parfaitement sur mobile.

## 🐛 Dépannage

### L'email n'arrive pas
- Vérifier les spams
- Vérifier que l'email existe dans le système
- Vérifier la configuration Firebase

### Erreur "too-many-requests"
- Firebase limite les tentatives
- Attendre quelques minutes avant de réessayer

### Le lien ne fonctionne pas
- Les liens expirent après 1 heure par défaut
- Demander un nouveau lien

## ✅ Checklist de déploiement

- [x] Composant créé
- [x] Page créée
- [x] Lien dans le formulaire de connexion (déjà présent)
- [x] Validation des entrées
- [x] Messages d'erreur en français
- [x] Interface responsive
- [x] Documentation
- [ ] **Configuration Firebase** : Personnaliser le template d'email (voir guide)
- [ ] **Test** : Vérifier que l'email arrive et n'est pas marqué comme spam

## 🎉 Résultat

Les bénévoles peuvent maintenant facilement récupérer leur mot de passe en quelques clics, sans avoir besoin de contacter un administrateur !

