# 🚧 MODE PREVIEW UNIQUEMENT - Appel Bénévoles V2

## ⚠️ ATTENTION

Les modifications du générateur d'appel aux bénévoles (V2) sont actuellement en **MODE PREVIEW UNIQUEMENT**.

---

## 📋 Ce qui a été créé

### ✅ Fichiers créés
1. `app/api/volunteer-calls/send-email/route.ts` - API d'envoi d'emails
2. `components/features/admin/volunteer-call-modal-v2.tsx` - Nouveau modal amélioré
3. `FEATURE_VOLUNTEER_CALL_V2.md` - Documentation complète
4. `MIGRATION_GUIDE_VOLUNTEER_CALL_V2.md` - Guide de migration

### ✅ Fichiers modifiés
1. `lib/utils/volunteer-call-generator.ts` - Support de la personnalisation

---

## 🔒 Ce qui N'A PAS été fait

### ❌ Pas intégré au dashboard
- L'ancien composant (`VolunteerCallModal`) est toujours utilisé dans `app/dashboard/overview/page.tsx`
- Le nouveau composant (`VolunteerCallModalV2`) existe mais n'est **PAS utilisé**

### ❌ Pas déployé
- Aucun commit Git
- Aucun push vers le dépôt
- Aucun déploiement Vercel

### ❌ Emails simulés
- L'API d'envoi existe mais les emails sont **seulement loggés** dans la console
- Aucun service d'email (SendGrid/Resend) n'est configuré

---

## 🧪 Comment Tester en Mode Preview

### Option 1 : Test Local (Recommandé)

1. **Démarrer le serveur de développement**
```bash
cd benevoles3
npm run dev
```

2. **Modifier temporairement le dashboard**

Éditer `app/dashboard/overview/page.tsx` :

```tsx
// Ligne ~40 : Ajouter l'import
import { VolunteerCallModalV2 } from '@/components/features/admin/volunteer-call-modal-v2';

// Ligne ~643 : Remplacer
<VolunteerCallModal missions={allMissions} />
// par
<VolunteerCallModalV2 missions={allMissions} />
```

3. **Ouvrir dans le navigateur**
```
http://localhost:3000/dashboard/overview
```

4. **Tester les fonctionnalités**
- Sélection des missions
- Filtres
- Personnalisation
- Sélection des destinataires
- Copie des messages
- "Envoi" d'email (simulé, voir console)

5. **Vérifier la console pour voir les logs d'envoi**
```
Outils Développeur > Console
```

### Option 2 : Test sur Page Dédiée

Créer une page de test temporaire :

```tsx
// app/test-volunteer-call/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { VolunteerCallModalV2 } from '@/components/features/admin/volunteer-call-modal-v2';
import { getAllMissions } from '@/lib/firebase/missions';
import { MissionClient } from '@/types';

export default function TestVolunteerCallPage() {
  const [missions, setMissions] = useState<MissionClient[]>([]);

  useEffect(() => {
    getAllMissions().then(setMissions);
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test - Appel Bénévoles V2</h1>
      <VolunteerCallModalV2 missions={missions} />
    </div>
  );
}
```

Puis ouvrir : `http://localhost:3000/test-volunteer-call`

---

## 🚀 Pour Activer en Production

### Étape 1 : Tester en local
Suivre les instructions ci-dessus.

### Étape 2 : Configurer l'envoi d'email (optionnel)

Si vous voulez l'envoi réel d'emails :

**A. Choisir un service**
- SendGrid (gratuit jusqu'à 100/jour)
- Resend (moderne et simple)
- Mailgun (gratuit jusqu'à 5000/mois)

**B. Ajouter la clé API**
```bash
# .env.local
SENDGRID_API_KEY=SG.xxx
# ou
RESEND_API_KEY=re_xxx
```

**C. Modifier l'API**
Décommenter le code d'envoi dans `app/api/volunteer-calls/send-email/route.ts`

### Étape 3 : Intégrer au dashboard

Modifier `app/dashboard/overview/page.tsx` :
```tsx
import { VolunteerCallModalV2 } from '@/components/features/admin/volunteer-call-modal-v2';
// ...
<VolunteerCallModalV2 missions={allMissions} />
```

### Étape 4 : Commit et déployer

```bash
git add .
git commit -m "feat: Amélioration générateur appel bénévoles (V2) - sélection, personnalisation, envoi direct"
git push origin main
```

Vercel déploiera automatiquement.

---

## 📊 Comparaison Mode Preview vs Production

| Action | Mode Preview | Production |
|--------|-------------|-----------|
| Code créé | ✅ Oui | ✅ Oui |
| Intégré au dashboard | ❌ Non | ✅ Oui |
| Emails envoyés | ❌ Simulés | ✅ Réels* |
| Accessible aux users | ❌ Non | ✅ Oui |
| Historique Firestore | ✅ Oui | ✅ Oui |
| Testé | ✅ Localement | ✅ En production |

\* *Si service d'email configuré*

---

## 🎯 Checklist Avant Production

### Tests
- [ ] Modal s'ouvre correctement
- [ ] Sélection de missions fonctionne
- [ ] Filtres fonctionnent
- [ ] Personnalisation fonctionne
- [ ] Sélection de destinataires fonctionne
- [ ] Copie de message fonctionne
- [ ] API d'envoi retourne une réponse
- [ ] Historique enregistré dans Firestore
- [ ] Mobile responsive
- [ ] Accessible pour les responsables de catégorie

### Configuration
- [ ] Service d'email choisi (optionnel)
- [ ] Variables d'environnement ajoutées (optionnel)
- [ ] Code d'envoi activé dans l'API (optionnel)

### Déploiement
- [ ] Code revu
- [ ] Tests locaux passés
- [ ] Commit créé avec message descriptif
- [ ] Push vers le dépôt
- [ ] Déploiement Vercel vérifié

---

## ⚠️ Limitations Actuelles

1. **Emails simulés** : L'envoi n'est pas réel, seulement loggé
2. **Pas dans le dashboard** : L'ancien composant est toujours utilisé
3. **Pas déployé** : Seulement en local

---

## 💡 Recommandations

### Pour un Test Rapide
1. Lancer `npm run dev`
2. Modifier temporairement `app/dashboard/overview/page.tsx`
3. Tester toutes les fonctionnalités
4. Annuler les modifications si pas prêt à déployer

### Pour une Mise en Production
1. Tester en local d'abord
2. Valider avec quelques utilisateurs
3. Configurer l'envoi d'email si souhaité
4. Commit et déployer
5. Surveiller les logs et retours utilisateurs

---

## 📞 Support

En cas de problème :
1. Vérifier les logs de la console
2. Vérifier les logs Vercel (si déployé)
3. Consulter `FEATURE_VOLUNTEER_CALL_V2.md` pour la doc complète
4. Consulter `MIGRATION_GUIDE_VOLUNTEER_CALL_V2.md` pour le guide de migration

---

**Date** : 1er Novembre 2025  
**Statut** : 🚧 PREVIEW MODE ONLY  
**Action requise** : Tests locaux avant activation production


