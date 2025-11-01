'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2Icon, FlaskConicalIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export function TestResendButton() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    
    console.log('🧪 === DÉBUT TEST RESEND CLIENT ===');
    console.log('⏰ Date/heure:', new Date().toLocaleString('fr-FR'));
    
    try {
      console.log('📤 Envoi de la requête à /api/test-resend...');
      
      const response = await fetch('/api/test-resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Réponse reçue:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('📋 Données de la réponse:', JSON.stringify(data, null, 2));
      
      setResult(data);

      if (data.success) {
        console.log('✅ TEST RÉUSSI !');
        console.log('📬 Email ID:', data.emailId);
        console.log('📧 Destinataire:', data.to);
        console.log('📝 Sujet:', data.subject);
        
        toast.success('✅ Email de test envoyé !', {
          description: 'Vérifiez votre boîte email (et les spams)',
          duration: 10000,
        });
      } else {
        console.error('❌ TEST ÉCHOUÉ');
        console.error('Erreur:', data.error);
        console.error('Détails:', data.details);
        
        toast.error('❌ Erreur lors du test', {
          description: data.error || 'Vérifiez les logs',
          duration: 10000,
        });
      }
      
    } catch (error: any) {
      console.error('💥 ERREUR RÉSEAU:');
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      
      setResult({
        success: false,
        error: 'Erreur réseau',
        details: error.message,
      });
      
      toast.error('❌ Erreur réseau', {
        description: error.message,
      });
    } finally {
      setTesting(false);
      console.log('🧪 === FIN TEST RESEND CLIENT ===');
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <FlaskConicalIcon className="h-5 w-5" />
          Test d'Envoi Email (Debug)
        </CardTitle>
        <CardDescription>
          Testez l'envoi d'email via Resend avec des logs détaillés
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            <strong>Destinataire :</strong> topinambour124@gmail.com
          </p>
          <p className="text-sm text-gray-700">
            <strong>Sujet :</strong> 🧪 Test Resend - Appel Bénévoles Fonctionnel
          </p>
        </div>

        <Button
          onClick={handleTest}
          disabled={testing}
          className="w-full"
          size="lg"
        >
          {testing ? (
            <>
              <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <FlaskConicalIcon className="h-5 w-5 mr-2" />
              Envoyer Email de Test
            </>
          )}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.success ? 'Email envoyé avec succès !' : 'Erreur lors de l\'envoi'}
                </p>
                
                {result.success ? (
                  <div className="mt-2 space-y-1 text-sm text-green-700">
                    <p>📬 ID Email : {result.emailId}</p>
                    <p>📧 Destinataire : {result.to}</p>
                    <p>📝 Sujet : {result.subject}</p>
                    <div className="mt-3 p-3 bg-white rounded border border-green-200">
                      <p className="font-semibold mb-1">Instructions :</p>
                      {result.instructions?.map((instruction: string, index: number) => (
                        <p key={index} className="text-xs">{instruction}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 space-y-1 text-sm text-red-700">
                    <p><strong>Erreur :</strong> {result.error}</p>
                    {result.errorMessage && <p><strong>Message :</strong> {result.errorMessage}</p>}
                    {result.details && (
                      <div className="mt-2 p-2 bg-white rounded border border-red-200">
                        <p className="font-semibold mb-1">Détails :</p>
                        <pre className="text-xs overflow-auto">{JSON.stringify(result.details, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>📋 Logs disponibles dans :</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Console du navigateur (F12 → Console)</li>
            <li>Logs Vercel (Functions → Logs)</li>
            <li>Dashboard Resend (https://resend.com/emails)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

