'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const testEmail = async () => {
    setLoading(true);
    setStatus('Envoi en cours...');
    setDebugInfo(null);
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('✅ Email envoyé avec succès ! Vérifiez votre boîte email.');
        setDebugInfo(data);
      } else {
        setStatus(`❌ Erreur : ${data.error}`);
        setDebugInfo(data);
      }
    } catch (error: any) {
      setStatus(`❌ Erreur réseau : ${error.message}`);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnv = async () => {
    try {
      const response = await fetch('/api/debug-env');
      const data = await response.json();
      setDebugInfo(data);
      
      if (data.hasResendKey) {
        setStatus('✅ Configuration OK - Clé API Resend détectée');
      } else {
        setStatus('❌ RESEND_API_KEY non trouvée dans .env.local');
      }
    } catch (error: any) {
      setStatus(`❌ Erreur : ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Test de Configuration Email</CardTitle>
          <CardDescription>
            Vérifiez que les emails fonctionnent correctement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Vérifier configuration */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Étape 1 : Vérifier la configuration</h3>
            <Button onClick={checkEnv} variant="outline">
              Vérifier les variables d'environnement
            </Button>
          </div>

          {/* Envoyer email test */}
          <div className="pt-4">
            <h3 className="font-semibold mb-2">Étape 2 : Envoyer un email de test</h3>
            <div className="space-y-3">
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
                {loading ? 'Envoi en cours...' : 'Envoyer un email de test'}
              </Button>
            </div>
          </div>

          {/* Résultat */}
          {status && (
            <div className={`p-4 rounded ${
              status.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              <p className="font-semibold">{status}</p>
            </div>
          )}

          {/* Debug info */}
          {debugInfo && (
            <div className="p-4 bg-gray-100 rounded">
              <h4 className="font-semibold mb-2">Informations de débogage :</h4>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="border-t pt-4 text-sm text-gray-600">
            <h4 className="font-semibold mb-2">📝 Instructions :</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Créez un compte sur <a href="https://resend.com" target="_blank" className="text-blue-600 underline">resend.com</a></li>
              <li>Obtenez votre clé API</li>
              <li>Ajoutez <code className="bg-gray-200 px-1">RESEND_API_KEY=re_xxxxx</code> dans <code className="bg-gray-200 px-1">.env.local</code></li>
              <li>Redémarrez le serveur (<code className="bg-gray-200 px-1">npm run dev</code>)</li>
              <li>Vérifiez votre email sur Resend (Domains)</li>
              <li>Testez ici !</li>
            </ol>
          </div>

          {/* Lien vers doc */}
          <div className="border-t pt-4">
            <a 
              href="/DEBUG_EMAILS.md" 
              target="_blank"
              className="text-blue-600 underline text-sm"
            >
              📚 Voir le guide complet de débogage
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

