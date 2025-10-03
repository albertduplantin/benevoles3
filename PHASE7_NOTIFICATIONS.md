# Phase 7 : Système de Notifications Email ✅

## 📧 Vue d'ensemble

Système complet de notifications par email pour communiquer avec les bénévoles du festival, intégré avec **Resend** et respectant les préférences RGPD.

---

## 🎯 Fonctionnalités implémentées

### ✅ 1. Configuration Resend

**Fichier** : `lib/email/resend-config.ts`

- ✅ Intégration Resend API
- ✅ Configuration de l'email expéditeur
- ✅ Gestion de la clé API via variable d'environnement

**Variables d'environnement requises** :
```env
RESEND_API_KEY=re_xxxxx
NEXT_PUBLIC_APP_BASE_URL=https://votre-domaine.com
```

---

### ✅ 2. Templates d'emails

**Créés avec React Email** :

#### **A. Confirmation d'inscription à une mission**

**Fichier** : `lib/email/templates/mission-registration.tsx`

**Contenu** :
- ✅ Message de confirmation personnalisé
- ✅ Détails de la mission (titre, lieu, date, heure)
- ✅ Bouton CTA vers les détails de la mission
- ✅ Design responsive et moderne

**Quand envoyé ?** :
→ Automatiquement après l'inscription d'un bénévole à une mission

---

#### **B. Rappel 24h avant une mission**

**Fichier** : `lib/email/templates/mission-reminder.tsx`

**Contenu** :
- ✅ Alerte visuelle (style rouge/urgent)
- ✅ Détails de la mission
- ✅ Nom et téléphone du responsable
- ✅ Conseils pratiques (arriver 10 min avant, etc.)
- ✅ Bouton CTA vers les contacts

**Quand envoyé ?** :
→ À implémenter avec un cron job (voir section suivante)

---

#### **C. Annonces personnalisées (admin)**

**Fichier** : `lib/email/templates/custom-announcement.tsx`

**Contenu** :
- ✅ Sujet personnalisé
- ✅ Message libre (multi-lignes)
- ✅ Bouton CTA optionnel
- ✅ Design cohérent avec les autres emails

**Quand envoyé ?** :
→ Manuellement par un administrateur via l'interface web

---

### ✅ 3. Fonctions d'envoi

**Fichier** : `lib/email/send-notifications.ts`

#### **A. `sendMissionRegistrationEmail()`**

**Signature** :
```typescript
sendMissionRegistrationEmail(
  volunteer: UserClient,
  mission: MissionClient
): Promise<{ success: boolean; error?: string }>
```

**Fonctionnement** :
- ✅ Vérifie les préférences de notification (RGPD)
- ✅ Génère l'email avec React Email
- ✅ Envoie via Resend
- ✅ Retourne le statut de l'envoi

---

#### **B. `sendMissionReminderEmail()`**

**Signature** :
```typescript
sendMissionReminderEmail(
  volunteer: UserClient,
  mission: MissionClient,
  responsible?: UserClient
): Promise<{ success: boolean; error?: string }>
```

**Fonctionnement** :
- ✅ Vérifie les préférences de notification
- ✅ Inclut les infos du responsable si disponible
- ✅ Envoie via Resend

---

#### **C. `sendBulkEmails()`**

**Signature** :
```typescript
sendBulkEmails(
  volunteers: UserClient[],
  subject: string,
  htmlContent: string
): Promise<{ sent: number; failed: number; errors: string[] }>
```

**Fonctionnement** :
- ✅ Envoie à plusieurs bénévoles en batch
- ✅ Pause de 100ms entre chaque envoi (rate limiting)
- ✅ Retourne statistiques détaillées

---

### ✅ 4. Routes API

#### **A. `/api/notifications/registration` (POST)**

**Fichier** : `app/api/notifications/registration/route.ts`

**Payload** :
```json
{
  "volunteerId": "uid_du_benevole",
  "missionId": "id_de_la_mission"
}
```

**Fonctionnement** :
- ✅ Récupère les données du bénévole et de la mission
- ✅ Appelle `sendMissionRegistrationEmail()`
- ✅ Retourne le statut de l'envoi

**Appelée par** :
→ `lib/firebase/registrations.ts` lors de l'inscription

---

#### **B. `/api/notifications/custom` (POST)**

**Fichier** : `app/api/notifications/custom/route.ts`

**Payload** :
```json
{
  "subject": "Sujet de l'email",
  "message": "Contenu du message",
  "ctaText": "Texte du bouton (optionnel)",
  "ctaUrl": "https://lien.com (optionnel)",
  "targetAll": true,
  "sentBy": "uid_de_l_admin"
}
```

**Fonctionnement** :
- ✅ Récupère tous les bénévoles ou une sélection
- ✅ Filtre selon les préférences de notification
- ✅ Génère l'email custom
- ✅ Envoie en batch
- ✅ Crée un log de notification
- ✅ Retourne statistiques détaillées

---

### ✅ 5. Interface admin

**Page** : `/dashboard/admin/notifications`

**Fichier** : `app/dashboard/admin/notifications/page.tsx`

**Fonctionnalités** :

#### **Statistiques en temps réel** :
- ✅ Total des bénévoles inscrits
- ✅ Nombre de bénévoles avec email activé
- ✅ Nombre de bénévoles avec email désactivé

#### **Formulaire d'envoi** :
- ✅ Champ sujet (obligatoire)
- ✅ Champ message multi-lignes (obligatoire)
- ✅ Bouton CTA optionnel (texte + URL)
- ✅ Toggle "Envoyer à tous les bénévoles"
- ✅ Preview du nombre de destinataires
- ✅ Bouton d'envoi avec loader

#### **Feedback** :
- ✅ Toast de confirmation
- ✅ Compteur d'emails envoyés/ignorés
- ✅ Avertissement RGPD

**Accès** :
→ Via le header, menu "Notifications" (réservé aux admins)

---

### ✅ 6. Système de logs

**Fichier** : `lib/firebase/notification-logs.ts`

**Collection Firestore** : `notificationLogs`

**Structure d'un log** :
```typescript
{
  id: string;
  type: 'registration' | 'reminder' | 'custom' | 'responsibility_approved' | 'responsibility_rejected';
  subject: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  errors?: string[];
  sentBy: string; // UID de l'admin ou 'system'
  createdAt: Date;
}
```

**Fonctions** :
- ✅ `createNotificationLog()` : Crée un nouveau log
- ✅ `getRecentNotificationLogs()` : Récupère les derniers logs

**Firestore Rules** :
- ✅ Lecture : Admin uniquement
- ✅ Création : Ouverte (pour l'API)
- ✅ Modification/Suppression : Interdite (immutabilité)

---

### ✅ 7. Respect des préférences RGPD

**Vérifications automatiques** :
- ✅ `consents.communications` doit être `true`
- ✅ `notificationPreferences.email` doit être `true`

**Comportement** :
- ❌ Si désactivé → Email **non envoyé**
- ✅ Si activé → Email envoyé
- 📊 Comptage des "skipped" dans les statistiques

**Gestion utilisateur** :
→ Via `/dashboard/profile`, switches interactifs

---

## 🚀 Déclencheurs automatiques

### ✅ Inscription à une mission

**Implémenté** :
- ✅ `lib/firebase/registrations.ts` → appelle `/api/notifications/registration`
- ✅ Envoi **asynchrone** (ne bloque pas l'inscription)
- ✅ Si l'email échoue, l'inscription est quand même réussie

---

### ⏳ Rappel 24h avant (À implémenter)

**Option 1 : Vercel Cron Jobs** (recommandé)

1. Créer `/app/api/cron/send-reminders/route.ts`
2. Ajouter dans `vercel.json` :
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/send-reminders",
         "schedule": "0 10 * * *"
       }
     ]
   }
   ```
3. Logique :
   - Récupérer toutes les missions dans 24h
   - Pour chaque mission, récupérer les bénévoles inscrits
   - Envoyer un email de rappel à chacun

**Option 2 : Firebase Cloud Functions**

1. Créer une fonction déclenchée par Cloud Scheduler
2. Même logique que ci-dessus

**Option 3 : Service externe (Zapier, Make.com)**

---

## 📊 Statistiques et monitoring

### **Via l'interface admin** :
- ✅ Compteur d'emails envoyés
- ✅ Compteur d'emails ignorés (RGPD)
- ✅ Liste des erreurs éventuelles

### **Via les logs Firestore** :
- ✅ Historique complet des envois
- ✅ Filtrage par type, date, admin
- ✅ Analyse des échecs

### **Via Resend Dashboard** :
- ✅ Statistiques globales (ouvertures, clics)
- ✅ Monitoring des bounces
- ✅ Statut des emails

---

## 🧪 Tests

### **Test 1 : Inscription à une mission**

1. ✅ Connectez-vous en tant que bénévole
2. ✅ Activez les notifications email dans votre profil
3. ✅ Inscrivez-vous à une mission
4. ✅ Vérifiez votre boîte email
5. ✅ Vous devriez recevoir l'email de confirmation

---

### **Test 2 : Notification personnalisée (admin)**

1. ✅ Connectez-vous en tant qu'admin
2. ✅ Allez dans "Notifications" (menu header)
3. ✅ Remplissez le formulaire :
   - Sujet : "Test notification"
   - Message : "Ceci est un test"
   - CTA : "Voir le site" → `https://example.com`
4. ✅ Cliquez sur "Envoyer"
5. ✅ Vérifiez le toast de confirmation
6. ✅ Vérifiez votre boîte email

---

### **Test 3 : Respect RGPD**

1. ✅ Connectez-vous en tant que bénévole
2. ✅ Allez dans "Mon Profil"
3. ✅ **Désactivez** "Notifications par email"
4. ✅ Inscrivez-vous à une mission
5. ✅ Vous **ne devriez PAS** recevoir d'email
6. ✅ L'inscription doit quand même être réussie

---

### **Test 4 : Envoi multiple (admin)**

1. ✅ Créez plusieurs comptes de test
2. ✅ Activez les notifications email pour 2 comptes
3. ✅ Désactivez pour 1 compte
4. ✅ Envoyez une notification personnalisée
5. ✅ Vérifiez les statistiques : 2 envoyés, 1 ignoré

---

## 🔧 Configuration de production

### **1. Configurer Resend**

1. ✅ Créez un compte sur [https://resend.com](https://resend.com)
2. ✅ Vérifiez votre email
3. ✅ Obtenez votre clé API
4. ✅ (Optionnel) Configurez votre domaine pour `noreply@votre-domaine.fr`

### **2. Variables d'environnement (Vercel)**

Ajoutez dans **Settings → Environment Variables** :

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_BASE_URL=https://benevoles3.vercel.app
```

### **3. Déployer Firestore Rules**

```bash
firebase deploy --only firestore:rules
```

### **4. Tester en production**

- ✅ Inscrivez-vous à une mission
- ✅ Envoyez une notification test
- ✅ Vérifiez les logs Resend

---

## 📈 Limites et quotas

### **Plan gratuit Resend** :
- ✅ **3000 emails/mois**
- ✅ **100 emails/jour**
- ✅ Support email

### **Si vous dépassez** :
- Passer au plan payant ($20/mois pour 50k emails)
- Ou utiliser un autre service

### **Optimisations** :
- ✅ Rate limiting : 100ms entre chaque email
- ✅ Filtrage RGPD : N'envoie qu'aux opt-in
- ✅ Logs : Traçabilité complète

---

## 📝 Améliorations futures

### **À court terme** :
1. ⏳ Implémenter les rappels 24h (cron job)
2. ⏳ Interface admin pour consulter les logs
3. ⏳ Template pour acceptation/refus responsabilité

### **À moyen terme** :
1. ⏳ Envoi de SMS (Twilio)
2. ⏳ Notifications in-app (temps réel)
3. ⏳ Statistiques avancées (taux d'ouverture)

### **À long terme** :
1. ⏳ Newsletter automatique
2. ⏳ Segmentation des bénévoles
3. ⏳ A/B testing des emails

---

## 🆘 Dépannage

### **"Resend API key is required"**
→ Vérifiez que `RESEND_API_KEY` est bien défini dans `.env.local` (local) ou Vercel (prod)

### **"Email address is not verified"**
→ Allez dans le dashboard Resend → Domains → Vérifiez votre email

### **"Rate limit exceeded"**
→ Vous avez dépassé 100 emails/jour (plan gratuit)

### **Les emails vont dans les spams**
→ Configurez SPF/DKIM en ajoutant votre domaine dans Resend

### **L'email n'est pas envoyé après inscription**
→ Vérifiez :
1. Les préférences de notification du bénévole
2. Les logs de la console navigateur
3. Les logs Resend

---

## 📚 Fichiers créés/modifiés

### **Nouveaux fichiers** :
- ✅ `lib/email/resend-config.ts`
- ✅ `lib/email/send-notifications.ts`
- ✅ `lib/email/templates/mission-registration.tsx`
- ✅ `lib/email/templates/mission-reminder.tsx`
- ✅ `lib/email/templates/custom-announcement.tsx`
- ✅ `app/api/notifications/registration/route.ts`
- ✅ `app/api/notifications/custom/route.ts`
- ✅ `app/dashboard/admin/notifications/page.tsx`
- ✅ `lib/firebase/notification-logs.ts`
- ✅ `RESEND_SETUP.md`
- ✅ `PHASE7_NOTIFICATIONS.md`

### **Fichiers modifiés** :
- ✅ `lib/firebase/registrations.ts` (ajout appel API)
- ✅ `components/layouts/header.tsx` (ajout lien Notifications)
- ✅ `firestore.rules` (ajout rules notificationLogs)
- ✅ `package.json` (ajout dépendances Resend)

---

## ✅ Phase 7 : Terminée !

**Statut** : 🎉 **COMPLET**

**Prochaine étape** :
→ Tester en production avec vos vrais bénévoles !

---

**Besoin d'aide ?**
- Documentation Resend : https://resend.com/docs
- React Email : https://react.email

