# 🚀 Déploiement Preview - Appel Bénévoles V2

## ✅ Déploiement Effectué

**Date** : 1er Novembre 2025  
**Branche** : `feature/volunteer-call-v2-preview`  
**Commit** : `23ec0bc`  
**Statut** : 🟢 Preview en cours de déploiement sur Vercel

---

## 📦 Ce qui a été déployé

### Nouveaux Fichiers
1. ✅ `app/dashboard/volunteer-call/page.tsx` - Page complète dédiée
2. ✅ `app/api/volunteer-calls/send-email/route.ts` - API d'envoi email
3. ✅ `components/features/admin/volunteer-call-modal-v2.tsx` - Modal V2 (non utilisé, page préférée)
4. ✅ `components/ui/separator.tsx` - Composant UI
5. ✅ `FEATURE_VOLUNTEER_CALL_V2.md` - Documentation complète
6. ✅ `MIGRATION_GUIDE_VOLUNTEER_CALL_V2.md` - Guide de migration
7. ✅ `PREVIEW_MODE_ONLY.md` - Instructions preview

### Fichiers Modifiés
1. ✅ `app/dashboard/overview/page.tsx` - Boutons au lieu de modals
2. ✅ `lib/utils/volunteer-call-generator.ts` - Support personnalisation
3. ✅ `package.json` + `package-lock.json` - Dépendance separator

---

## 🌐 Accès au Preview Vercel

### URL Preview
Vercel va générer une URL de preview automatiquement. Vous la trouverez :

1. **Sur GitHub** :
   - Allez sur : https://github.com/albertduplantin/benevoles3/pull/new/feature/volunteer-call-v2-preview
   - Créez la Pull Request (optionnel)
   - Vercel postera un commentaire avec le lien preview

2. **Sur Vercel Dashboard** :
   - Allez sur : https://vercel.com/albertduplantins-projects/benevoles3
   - Cherchez le déploiement de la branche `feature/volunteer-call-v2-preview`
   - Cliquez sur "Visit" pour accéder au preview

3. **Format de l'URL** (approximatif) :
   ```
   https://benevoles3-[hash]-albertduplantins-projects.vercel.app
   ```

---

## 🧪 Comment Tester le Preview

### 1. Attendre le Déploiement
- ⏱️ Le déploiement prend environ 2-3 minutes
- Vérifiez sur le dashboard Vercel que le build est réussi (✓)

### 2. Accéder au Preview
- Utilisez l'URL générée par Vercel
- Connectez-vous avec vos identifiants

### 3. Tester la Nouvelle Fonctionnalité

#### Pour les Admins
1. Allez sur `/dashboard/overview`
2. Dans la carte "Communication", cliquez sur **"Générer un appel aux bénévoles"**
3. Vous serez redirigé vers `/dashboard/volunteer-call`

#### Pour les Responsables de Catégorie
1. Même chose, le bouton est aussi disponible dans leur section

#### Page Directe
Vous pouvez aussi accéder directement à :
```
https://[votre-preview-url]/dashboard/volunteer-call
```

### 4. Fonctionnalités à Tester

#### ✅ Sélection des Missions
- [ ] Cocher/décocher des missions individuellement
- [ ] Utiliser les filtres (catégorie, urgence, date)
- [ ] Boutons "Tout sélectionner" / "Tout désélectionner"
- [ ] Vérifier que les stats se mettent à jour en temps réel

#### ✅ Personnalisation
- [ ] Modifier le nom du festival
- [ ] Modifier les dates
- [ ] Ajouter un message d'introduction personnalisé
- [ ] Vérifier l'aperçu en temps réel

#### ✅ Destinataires
- [ ] Tester "Tous les bénévoles"
- [ ] Tester "Par catégories préférées" (sélectionner des catégories)
- [ ] Tester "Sans mission assignée"
- [ ] Tester "Liste personnalisée" (sélectionner des bénévoles)
- [ ] Vérifier que le compteur de destinataires est correct

#### ✅ Aperçu
- [ ] Onglet "WhatsApp / SMS" - Copier le texte
- [ ] Onglet "Email (HTML)" - Copier le HTML
- [ ] Vérifier que le message est correct

#### ✅ Envoi (Simulé)
- [ ] Cliquer sur "Envoyer par Email"
- [ ] Vérifier le toast de succès
- [ ] **IMPORTANT** : Les emails sont simulés (console.log)
  - Ouvrez la console du navigateur (F12)
  - Vous devriez voir des logs comme "📧 Envoi d'appel à X bénévoles"

#### ✅ Responsive
- [ ] Tester sur mobile (responsive)
- [ ] Tester sur tablette
- [ ] Tester sur desktop

---

## ⚠️ Limitations du Preview

### 1. Emails Simulés
Les emails ne sont **PAS envoyés réellement**.

**Pourquoi ?**
- Aucun service d'email n'est configuré (SendGrid/Resend)
- L'API log simplement dans la console serveur

**Pour voir les logs** :
- Sur Vercel Dashboard → Déploiement → "Functions" → Logs

### 2. Historique Firestore
Les appels sont **enregistrés** dans Firestore dans la collection `volunteer-calls`, mais aucun email n'est envoyé.

---

## 🔧 Pour Activer l'Envoi Réel (Production)

Si vous voulez activer l'envoi réel d'emails :

### Option 1 : SendGrid (Recommandé)

1. **Créer un compte SendGrid** :
   - https://sendgrid.com/
   - Plan gratuit : 100 emails/jour

2. **Obtenir une clé API** :
   - Dashboard → Settings → API Keys
   - Créer une clé avec permission "Mail Send"

3. **Ajouter la clé sur Vercel** :
   - Vercel Dashboard → Settings → Environment Variables
   - Ajouter : `SENDGRID_API_KEY=SG.xxx`
   - Appliquer à : Production, Preview, Development

4. **Installer SendGrid** :
   ```bash
   npm install @sendgrid/mail
   ```

5. **Modifier l'API** :
   Dans `app/api/volunteer-calls/send-email/route.ts`, décommenter le code SendGrid (lignes commentées TODO)

### Option 2 : Resend (Moderne)

1. **Créer un compte Resend** :
   - https://resend.com/
   - Plan gratuit : 3000 emails/mois

2. **Obtenir une clé API**

3. **Ajouter sur Vercel** :
   - `RESEND_API_KEY=re_xxx`

4. **Installer Resend** :
   ```bash
   npm install resend
   ```

5. **Modifier l'API** (voir doc dans le code)

---

## 📊 Comparaison Preview vs Production

| Fonctionnalité | Preview | Production (avec email configuré) |
|----------------|---------|-----------------------------------|
| Page dédiée | ✅ Oui | ✅ Oui |
| Sélection missions | ✅ Oui | ✅ Oui |
| Personnalisation | ✅ Oui | ✅ Oui |
| Choix destinataires | ✅ Oui | ✅ Oui |
| Copie message | ✅ Oui | ✅ Oui |
| Envoi email | ❌ Simulé | ✅ Réel |
| Historique Firestore | ✅ Oui | ✅ Oui |

---

## 🔄 Rollback (Revenir en Arrière)

Si vous voulez désactiver cette fonctionnalité après test :

### Option 1 : Changer de Branche sur Vercel
- Vercel Dashboard → Settings → Git
- Changer la branche de production vers `main` ou une autre

### Option 2 : Revenir au Code Précédent
```bash
git checkout main
git branch -D feature/volunteer-call-v2-preview
```

### Option 3 : Modifier le Code
Dans `app/dashboard/overview/page.tsx` :
- Décommenter l'import du `VolunteerCallModal`
- Remplacer le bouton par `<VolunteerCallModal missions={allMissions} />`

---

## 🐛 En Cas de Problème

### Le Build Échoue sur Vercel
1. Vérifiez les logs de build sur Vercel
2. Vérifiez que toutes les variables d'environnement sont définies

### La Page ne S'Affiche Pas
1. Vérifiez que vous êtes connecté
2. Vérifiez que vous êtes admin ou responsable de catégorie
3. Consultez la console du navigateur (F12) pour les erreurs

### Les Missions ne S'Affichent Pas
1. Vérifiez que des missions incomplètes existent dans Firestore
2. Vérifiez les permissions Firestore

### Le Bouton ne Redirige Pas
1. Vérifiez la console du navigateur
2. Vérifiez que la route `/dashboard/volunteer-call` existe

---

## 📞 Support

**Documentation Complète** :
- `FEATURE_VOLUNTEER_CALL_V2.md` - Fonctionnalités détaillées
- `MIGRATION_GUIDE_VOLUNTEER_CALL_V2.md` - Guide de migration
- `PREVIEW_MODE_ONLY.md` - Instructions preview

**Logs Vercel** :
- https://vercel.com/albertduplantins-projects/benevoles3

**GitHub** :
- https://github.com/albertduplantin/benevoles3

---

## ✅ Checklist de Test Preview

Avant de valider pour production, testez :

### Interface
- [ ] Page s'affiche correctement
- [ ] Design responsive (mobile, tablette, desktop)
- [ ] Tous les boutons fonctionnent
- [ ] Les transitions sont fluides

### Fonctionnalités
- [ ] Sélection de missions fonctionne
- [ ] Filtres fonctionnent
- [ ] Personnalisation fonctionne
- [ ] Sélection de destinataires fonctionne
- [ ] Copie de message fonctionne
- [ ] Simulation d'envoi fonctionne

### Permissions
- [ ] Admins peuvent accéder
- [ ] Responsables de catégorie peuvent accéder
- [ ] Bénévoles simples ne peuvent PAS accéder

### Performance
- [ ] Page se charge rapidement
- [ ] Pas de lag lors de la sélection
- [ ] Aperçu se met à jour rapidement

---

**Date de déploiement** : 1er Novembre 2025  
**Statut** : 🚀 Preview Déployé  
**Prochaine étape** : Tests et validation


