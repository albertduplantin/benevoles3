# 🚀 Déploiement Preview en cours

## ✅ Commit créé

**Branche** : `fix/notification-button`  
**Commit** : `3d06da1`  
**Message** : fix: notification toggle button and FCM token management

### Fichiers modifiés (7)

#### Code fixes
1. ✅ `hooks/useNotifications.ts` - Chargement automatique des tokens + fonction robuste
2. ✅ `lib/firebase/messaging.ts` - Meilleure gestion d'erreur VAPID
3. ✅ `lib/firebase/config.ts` - Persistence multi-tabs
4. ✅ `components/features/pwa/service-worker-register.tsx` - Suppression enregistrement double

#### Documentation
5. ✅ `FIREBASE_VAPID_FIX.md` - Guide correction clé VAPID
6. ✅ `NOTIFICATIONS_TODO.md` - Checklist complète
7. ✅ `NOTIFICATION_BUTTON_FIX.md` - Détails du bug corrigé

---

## 🔗 Liens importants

### GitHub
**Pull Request** : https://github.com/albertduplantin/benevoles3/pull/new/fix/notification-button

### Vercel
Vercel devrait automatiquement détecter la nouvelle branche et créer un **Preview Deployment**.

Pour voir le déploiement :
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **benevoles3**
3. Onglet **Deployments**
4. Cherchez le déploiement de la branche `fix/notification-button`

Ou recevez une notification par email/Slack de Vercel avec le lien direct.

---

## ⏱️ Temps de déploiement estimé

**Preview Deployment** : ~2-3 minutes

Une fois déployé, vous recevrez :
- 📧 Email de Vercel avec le lien de preview
- 🔗 URL de preview : `https://benevoles3-[hash].vercel.app`

---

## 🧪 Tests à effectuer sur le Preview

### 1. Vérifier la page de debug

```
https://benevoles3-[hash].vercel.app/dashboard/debug-notifications
```

**Checklist** :
- [ ] Support des notifications ✅
- [ ] Permission accordée ✅
- [ ] Service Worker enregistré ✅
- [ ] Clé VAPID configurée ✅
- [ ] Token FCM actuel ✅
- [ ] **Tokens enregistrés dans Firestore (devrait passer de 0 à 1)** ✅

---

### 2. Tester le bouton Activer/Désactiver

```
https://benevoles3-[hash].vercel.app/dashboard/profile/notifications
```

**Checklist** :
- [ ] Cliquer sur "Activer" → Toast vert "Notifications activées" ✅
- [ ] Vérifier que le bouton devient rouge "Désactiver" ✅
- [ ] Cliquer sur "Désactiver" → Toast vert "Notifications désactivées" ✅
- [ ] Vérifier que le bouton devient bleu "Activer" ✅
- [ ] **Pas d'erreur dans la console DevTools (F12)** ✅

---

### 3. Console DevTools (F12)

**Onglet Console - Vérifications** :

✅ **Attendu (messages verts)** :
```
✅ Service Worker enregistré
✅ Token FCM obtenu: [token]
✅ Firestore persistence enabled (multi-tab)
```

❌ **Ne devrait PLUS apparaître** :
```
❌ InvalidCharacterError: Failed to execute 'atob'
❌ Service Worker registration failed
⚠️ Firestore persistence error
```

---

## 🔄 Après validation

### Si tout fonctionne ✅

```bash
# Merger la Pull Request sur GitHub
# Ou en ligne de commande :
cd D:\Documents\aiprojets\benevoles3\benevoles3
git checkout main
git merge fix/notification-button
git push origin main
```

Le merge vers `main` déclenchera automatiquement un **déploiement en Production**.

---

### Si problèmes détectés ❌

1. Identifier le problème (console, comportement)
2. Créer un nouveau commit sur la branche `fix/notification-button`
3. Push → Vercel mettra à jour le preview automatiquement

```bash
# Faire les corrections
git add [fichiers]
git commit -m "fix: [description]"
git push
```

---

## 📊 Monitoring

### Logs Vercel en temps réel

```bash
# Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# Se connecter
vercel login

# Voir les logs du dernier déploiement
vercel logs benevoles3 --follow
```

### Logs dans la console Vercel

1. https://vercel.com/albertduplantin/benevoles3
2. Cliquez sur le déploiement
3. Onglet **Logs** pour voir les erreurs serveur
4. Onglet **Functions** pour voir les Cloud Functions

---

## 🎯 Prochaines étapes

1. ⏳ **Attendre** ~2-3 min que Vercel déploie
2. 📧 **Ouvrir** l'email de Vercel ou aller sur le dashboard
3. 🔗 **Copier** l'URL du preview deployment
4. 🧪 **Tester** selon la checklist ci-dessus
5. ✅ **Valider** que tout fonctionne
6. 🔀 **Merger** la PR vers main

---

## 💡 Notes

- Le preview deployment est **temporaire** (30 jours)
- Il utilise la **même base de données** Firebase que la production
- Les tokens créés en preview seront **réels**
- Testez avec votre compte personnel de préférence

---

✅ **Déploiement lancé avec succès !**

Vous devriez recevoir un email de Vercel d'ici 2-3 minutes avec le lien du preview.

