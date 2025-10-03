# 🔥 Configuration Firebase Admin SDK - Guide Rapide

## ⚠️ Erreur actuelle

Vous voyez l'erreur : `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**Cause** : Firebase Admin SDK n'est pas configuré correctement.

---

## ✅ Solution Rapide (5 minutes)

### **Étape 1 : Vérifier la configuration actuelle**

Allez sur : `http://localhost:3000/api/debug-firebase-admin`

Vous verrez si les variables d'environnement sont définies.

---

### **Étape 2 : Obtenir les credentials Firebase Admin**

Vous avez **déjà** le fichier : `benevoles3-a85b4-firebase-adminsdk-fbsvc-675562f571.json`

Ce fichier contient toutes les informations nécessaires !

---

### **Étape 3 : Ajouter dans `.env.local`**

Ouvrez le fichier `benevoles3-a85b4-firebase-adminsdk-fbsvc-675562f571.json` et copiez les valeurs :

```json
{
  "project_id": "benevoles3-a85b4",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk-...@benevoles3-a85b4.iam.gserviceaccount.com"
}
```

**Ajoutez dans `.env.local`** :

```env
# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=benevoles3-a85b4
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@benevoles3-a85b4.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVOTRE_CLE_PRIVEE_COMPLETE\n-----END PRIVATE KEY-----\n"
```

⚠️ **IMPORTANT** : 
- La clé privée doit être entre **guillemets doubles**
- Gardez les `\n` dans la clé (ils représentent les sauts de ligne)
- La clé commence par `-----BEGIN PRIVATE KEY-----` et finit par `-----END PRIVATE KEY-----`

---

### **Étape 4 : Redémarrer le serveur**

```bash
# Arrêtez avec Ctrl+C
npm run dev
```

---

### **Étape 5 : Vérifier**

1. Allez sur : `http://localhost:3000/api/debug-firebase-admin`
2. Vous devriez voir :
   ```json
   {
     "hasProjectId": true,
     "hasClientEmail": true,
     "hasPrivateKey": true,
     "status": "✅ Configuration complète"
   }
   ```

---

## 🎯 Exemple complet de `.env.local`

```env
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=benevoles3-a85b4
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@benevoles3-a85b4.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...(votre clé)...-----END PRIVATE KEY-----\n"
```

---

## 🔧 Troubleshooting

### **❌ "Configuration incomplète"**

→ Vérifiez que vous avez bien copié les 3 variables

### **❌ Erreur "invalid_grant"**

→ La clé privée n'est pas correctement formatée
→ Vérifiez les guillemets et les `\n`

### **❌ Le serveur ne redémarre pas**

→ Tuez le processus Node.js et relancez `npm run dev`

---

## 📝 Où trouver les valeurs ?

**Fichier déjà présent** : `benevoles3-a85b4-firebase-adminsdk-fbsvc-675562f571.json`

Ou sur Firebase Console :
1. Allez sur [console.firebase.google.com](https://console.firebase.google.com)
2. Votre projet → Paramètres (icône engrenage) → Comptes de service
3. Cliquez sur "Générer une nouvelle clé privée"
4. Téléchargez le JSON

---

## ✅ Une fois configuré

Testez à nouveau l'inscription à une mission → L'email devrait partir ! 🎉

