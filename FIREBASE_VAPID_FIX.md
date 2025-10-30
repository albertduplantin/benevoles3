# 🔧 Correction de l'erreur Token FCM (InvalidCharacterError)

## Problème identifié

L'erreur `InvalidCharacterError: Failed to execute 'atob'` indique que la clé VAPID configurée est invalide.

## Solution étape par étape

### 1. Régénérer une clé VAPID propre

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **benevoles3-a85b4**
3. Cliquez sur l'icône ⚙️ → **Paramètres du projet**
4. Onglet **Cloud Messaging**
5. Section **Web Push certificates**
6. Si une clé existe déjà :
   - Notez-la quelque part (ou supprimez-la si elle ne marche pas)
7. Cliquez sur **Générer une nouvelle paire de clés**
8. **Copiez EXACTEMENT la clé** (commence par `B` et fait ~90 caractères)

### 2. Mettre à jour .env.local

Ouvrez `benevoles3/.env.local` et remplacez la ligne :

```bash
NEXT_PUBLIC_FIREBASE_VAPID_KEY=votre_ancienne_cle
```

Par la nouvelle clé (sans espaces, sans guillemets) :

```bash
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BKj8x...votre_nouvelle_cle_complete...xyz
```

### 3. Mettre à jour sur Vercel (si déployé)

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **benevoles3**
3. **Settings** → **Environment Variables**
4. Trouvez `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
5. Cliquez **Edit** et collez la MÊME clé que dans .env.local
6. Sauvegardez et redéployez

### 4. Nettoyer le cache et redémarrer

```bash
# Dans votre terminal (PowerShell)
cd D:\Documents\aiprojets\benevoles3\benevoles3

# Arrêter le serveur dev (Ctrl+C)

# Nettoyer le cache Next.js
Remove-Item -Recurse -Force .next

# Redémarrer
npm run dev
```

### 5. Tester dans le navigateur

1. Ouvrez votre app en **navigation privée** (pour avoir un cache propre)
2. Allez sur `/dashboard/debug-notifications`
3. Vérifiez que "Clé VAPID configurée" est ✅ vert
4. Vérifiez que "Token FCM actuel" obtient bien un token

### 6. Désinscrire/réinscrire le Service Worker (si nécessaire)

Si l'erreur persiste :

1. Ouvrez DevTools (F12)
2. Onglet **Application** → **Service Workers**
3. Cliquez **Unregister** sur tous les SW
4. Onglet **Application** → **Storage** → **Clear site data**
5. Rechargez la page (F5)

---

## Vérification

Une fois corrigé, vous devriez voir dans la console :

```
✅ Service Worker enregistré
✅ Token FCM obtenu: eXyZ123...
```

Et plus d'erreur `InvalidCharacterError`.



