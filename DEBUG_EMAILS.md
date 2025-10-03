# 🔍 Guide de Débogage - Emails

## Checklist rapide

Suivez ces étapes dans l'ordre pour identifier le problème :

---

## ✅ Étape 1 : Vérifier la configuration Resend

### **A. Vérifier que la clé API existe**

1. Ouvrez votre fichier `.env.local` (à la racine du projet)
2. Vérifiez que cette ligne existe :
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

⚠️ **Si le fichier n'existe pas ou si la ligne est absente** :
```bash
# Créez le fichier .env.local et ajoutez :
RESEND_API_KEY=votre_cle_resend
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
```

3. **Redémarrez le serveur Next.js** :
   ```bash
   # Arrêtez le serveur (Ctrl+C)
   npm run dev
   ```

### **B. Tester la clé API Resend**

1. Allez sur [https://resend.com/emails](https://resend.com/emails)
2. Connectez-vous
3. Vérifiez que votre clé API est valide
4. ⚠️ **Important** : Vérifiez votre email dans "Domains" → Ajoutez et vérifiez votre email

---

## ✅ Étape 2 : Tester l'envoi manuellement (TEST SIMPLE)

### **Créer une page de test**

Créez le fichier `app/test-email/page.tsx` :

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testEmail = async () => {
    setLoading(true);
    setStatus('Envoi en cours...');
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('✅ Email envoyé avec succès ! Vérifiez votre boîte.');
      } else {
        setStatus(`❌ Erreur : ${data.error}`);
      }
    } catch (error: any) {
      setStatus(`❌ Erreur réseau : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Test Email</h1>
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button 
          onClick={testEmail} 
          disabled={loading || !email}
          className="w-full"
        >
          {loading ? 'Envoi...' : 'Envoyer un email de test'}
        </Button>
        {status && (
          <div className="p-4 bg-gray-100 rounded">
            <pre className="text-sm whitespace-pre-wrap">{status}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
```

### **Créer l'API de test**

Créez le fichier `app/api/test-email/route.ts` :

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email/resend-config';

export async function POST(request: NextRequest) {
  try {
    const { to } = await request.json();
    
    console.log('🔍 DEBUG - Tentative d\'envoi email à:', to);
    console.log('🔍 DEBUG - RESEND_API_KEY existe:', !!process.env.RESEND_API_KEY);
    console.log('🔍 DEBUG - RESEND_API_KEY commence par:', process.env.RESEND_API_KEY?.substring(0, 5));
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY non définie dans .env.local' },
        { status: 500 }
      );
    }
    
    const { data, error } = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>', // Email de test Resend
      to,
      subject: '🎬 Test Email - Festival Dinan',
      html: '<h1>Test réussi !</h1><p>Cet email a été envoyé depuis votre application.</p>',
    });
    
    if (error) {
      console.error('❌ Erreur Resend:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('✅ Email envoyé avec succès:', data);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Erreur catch:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### **Tester**

1. Redémarrez le serveur : `npm run dev`
2. Allez sur : `http://localhost:3000/test-email`
3. Entrez votre email
4. Cliquez sur "Envoyer un email de test"
5. **Regardez la console du terminal** (où tourne `npm run dev`)
6. Vérifiez votre boîte email

---

## ✅ Étape 3 : Déboguer l'inscription à une mission

### **Ouvrir la console du navigateur**

1. Inscrivez-vous à une mission
2. **Ouvrez la console du navigateur** (F12 → Console)
3. Cherchez les messages :
   - `Failed to send registration email: ...`
   - Erreurs réseau

### **Vérifier les logs du serveur**

Dans le terminal où tourne `npm run dev`, cherchez :
```
Error sending email: ...
Error in sendMissionRegistrationEmail: ...
```

---

## ✅ Étape 4 : Vérifier les préférences utilisateur

### **Problème potentiel : Notifications désactivées**

1. Allez dans "Mon Profil"
2. Vérifiez que :
   - ✅ "Communications" est **activé**
   - ✅ "Notifications par email" est **activé**

**Si désactivé** → L'email ne sera **pas envoyé** (c'est normal, respect RGPD)

---

## ✅ Étape 5 : Vérifier l'email expéditeur

### **Problème : Email non vérifié sur Resend**

Par défaut, Resend utilise `onboarding@resend.dev` pour les tests.

**Solution** :

1. Modifiez `lib/email/resend-config.ts` :
   ```typescript
   // Temporairement pour les tests, utilisez l'email de test Resend
   export const DEFAULT_FROM_EMAIL = 'Test <onboarding@resend.dev>';
   ```

2. Plus tard, une fois votre domaine configuré :
   ```typescript
   export const DEFAULT_FROM_EMAIL = 'Festival Dinan <noreply@votre-domaine.fr>';
   ```

---

## ✅ Étape 6 : Vérifier les erreurs courantes

### **A. "Email address is not verified"**

**Solution** :
1. Allez sur Resend → Domains
2. Ajoutez votre email de test
3. Vérifiez-le via l'email reçu

### **B. "API key is invalid"**

**Solution** :
1. Regénérez une nouvelle clé API sur Resend
2. Remplacez dans `.env.local`
3. Redémarrez le serveur

### **C. "Rate limit exceeded"**

**Solution** :
- Attendez (max 100 emails/jour en gratuit)
- Ou passez au plan payant

### **D. Variable d'environnement non chargée**

**Vérifier** :

Créez `app/api/debug-env/route.ts` :
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasResendKey: !!process.env.RESEND_API_KEY,
    resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 5),
    baseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL,
  });
}
```

Allez sur : `http://localhost:3000/api/debug-env`

**Résultat attendu** :
```json
{
  "hasResendKey": true,
  "resendKeyPrefix": "re_xx",
  "baseUrl": "http://localhost:3000"
}
```

---

## ✅ Étape 7 : Vérifier avec curl (avancé)

### **Test direct de l'API**

```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "votre-email@example.com"}'
```

**Résultat attendu** :
```json
{"success": true, "data": {"id": "xxx"}}
```

---

## 🎯 Résumé - Checklist finale

| Étape | Vérification | ✅/❌ |
|-------|-------------|-------|
| 1 | `.env.local` existe avec `RESEND_API_KEY` | |
| 2 | Serveur redémarré après modification `.env.local` | |
| 3 | Email vérifié sur Resend (Domains) | |
| 4 | Page `/test-email` fonctionne | |
| 5 | Console navigateur sans erreur | |
| 6 | Console serveur sans erreur | |
| 7 | Préférences email activées dans profil | |
| 8 | `/api/debug-env` montre `hasResendKey: true` | |

---

## 🆘 Si rien ne fonctionne

**Envoyez-moi les informations suivantes** :

1. ✅ Résultat de `/api/debug-env`
2. ✅ Logs de la console navigateur (F12)
3. ✅ Logs du terminal serveur
4. ✅ Message d'erreur exact de `/test-email`
5. ✅ Screenshot de vos préférences Resend (Domains)

---

## 🚀 Solution rapide (si urgence)

**Utiliser l'email de test Resend** :

1. Modifiez `lib/email/resend-config.ts` :
   ```typescript
   export const DEFAULT_FROM_EMAIL = 'onboarding@resend.dev';
   ```

2. Inscrivez-vous à une mission
3. Vérifiez votre boîte email

**Cela devrait fonctionner immédiatement sans configuration !**

---

## 📝 Prochaine étape

Une fois le test réussi :
1. ✅ Configurez votre propre domaine sur Resend
2. ✅ Changez `DEFAULT_FROM_EMAIL`
3. ✅ Supprimez les pages de test

