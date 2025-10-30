# ✅ Checklist de correction des notifications

## État actuel
- ✅ **Notifications locales** : Fonctionnent parfaitement
- ⚠️ **Token FCM** : Erreur `InvalidCharacterError` (clé VAPID invalide)
- ⚠️ **Service Worker** : Enregistrement en double (corrigé dans le code)
- ⚠️ **Firestore Persistence** : Conflit multi-tabs (corrigé dans le code)

---

## 🔧 Actions à faire (par ordre de priorité)

### 1. ⚡ URGENT : Corriger la clé VAPID

**Symptôme** : `InvalidCharacterError: Failed to execute 'atob'`

**Solution** :

```bash
# 1. Aller sur Firebase Console
https://console.firebase.google.com/project/benevoles3-a85b4/settings/cloudmessaging

# 2. Section "Web Push certificates" → Générer une nouvelle paire de clés
# 3. Copier la clé (commence par "B" et fait ~90 caractères)

# 4. Mettre à jour .env.local
NEXT_PUBLIC_FIREBASE_VAPID_KEY=B...votre_nouvelle_cle...

# 5. Nettoyer et redémarrer
Remove-Item -Recurse -Force .next
npm run dev
```

📄 **Guide détaillé** : Voir `FIREBASE_VAPID_FIX.md`

---

### 2. ✅ Redémarrer l'application

Les corrections suivantes ont déjà été appliquées dans le code :

#### a) Service Worker (corrigé automatiquement)
- ✅ Supprimé l'enregistrement en double dans `service-worker-register.tsx`
- ✅ Seul `NotificationProvider` enregistre `firebase-messaging-sw.js`

#### b) Firestore Persistence (corrigé automatiquement)
- ✅ Utilisation de `enableMultiTabIndexedDbPersistence` pour supporter plusieurs onglets
- ✅ Meilleure gestion des erreurs de cache

#### c) Gestion d'erreur FCM (corrigée automatiquement)
- ✅ Messages d'erreur plus clairs dans la console
- ✅ Détection spécifique des problèmes de clé VAPID

**Action requise** : Redémarrer le serveur dev

```bash
# Arrêter le serveur (Ctrl+C dans le terminal)
# Puis redémarrer :
npm run dev
```

---

### 3. 🧪 Tester les corrections

#### Étape 1 : Ouvrir une fenêtre de navigation privée
```
Chrome : Ctrl+Shift+N
Edge : Ctrl+Shift+P
```

#### Étape 2 : Aller sur la page de debug
```
https://benevoles3.vercel.app/dashboard/debug-notifications
```

#### Étape 3 : Vérifier les voyants verts ✅
- [ ] Support des notifications
- [ ] Permission accordée
- [ ] Service Worker enregistré
- [ ] Clé VAPID configurée (sans erreur dans console)
- [ ] Token FCM obtenu (sans erreur `InvalidCharacterError`)
- [ ] Token sauvegardé dans Firestore

#### Étape 4 : Tester les notifications
- [ ] Cliquer sur "Envoyer une notification de test (locale)"
- [ ] Vérifier que la notification s'affiche
- [ ] **Aucune erreur rouge dans la console DevTools (F12)**

---

### 4. 🚀 Déployer sur Vercel (si tout fonctionne en local)

1. **Ajouter la clé VAPID sur Vercel**
   ```
   https://vercel.com/votre-username/benevoles3/settings/environment-variables
   
   Variable : NEXT_PUBLIC_FIREBASE_VAPID_KEY
   Valeur : B...votre_cle_vapid...
   Environnements : Production, Preview, Development
   ```

2. **Redéployer**
   ```bash
   git add .
   git commit -m "fix: correct Firebase VAPID key and SW registration"
   git push
   ```

3. **Vérifier en production**
   - Aller sur `https://benevoles3.vercel.app/dashboard/debug-notifications`
   - Tous les voyants doivent être verts ✅

---

## 📋 Résumé des fichiers modifiés

| Fichier | Changement |
|---------|-----------|
| `lib/firebase/messaging.ts` | ✅ Meilleure gestion d'erreur Token FCM |
| `lib/firebase/config.ts` | ✅ Persistence multi-tabs |
| `components/features/pwa/service-worker-register.tsx` | ✅ Supprimé enregistrement en double |
| `.env.local` | ⚠️ **À FAIRE** : Mettre à jour la clé VAPID |

---

## 🆘 En cas de problème persistant

### Reset complet du cache navigateur
```javascript
// 1. Ouvrir DevTools (F12)
// 2. Onglet Application → Service Workers → Unregister tous
// 3. Onglet Application → Storage → Clear site data
// 4. Fermer tous les onglets de l'app
// 5. Redémarrer le navigateur
// 6. Ouvrir en navigation privée
```

### Vérifier les logs Vercel
```bash
vercel logs benevoles3 --follow
```

### Contacter le support Firebase
Si le problème de clé VAPID persiste après régénération :
- https://firebase.google.com/support

---

## ✨ Après correction

Vous pourrez utiliser :
- ✅ Notifications push FCM en temps réel
- ✅ Notifications en arrière-plan
- ✅ Notifications multi-appareils
- ✅ Envoi depuis l'interface admin
- ✅ Notifications automatiques (nouveaux bénévoles, rappels, etc.)

**Documentation complète** : Voir `NOTIFICATION_PUSH_SETUP.md`



