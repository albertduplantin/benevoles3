import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

/**
 * API de test pour déboguer l'envoi d'emails avec Resend
 * POST /api/test-resend
 */
export async function POST(req: NextRequest) {
  console.log('🧪 === DÉBUT TEST RESEND ===');
  
  try {
    // 1. Vérifier la clé API
    console.log('🔑 Vérification RESEND_API_KEY...');
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY n\'est PAS définie !');
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY non configurée',
        details: 'La variable d\'environnement RESEND_API_KEY n\'est pas définie sur Vercel',
      }, { status: 500 });
    }
    
    console.log('✅ RESEND_API_KEY est définie');
    console.log(`📏 Longueur de la clé: ${apiKey.length} caractères`);
    console.log(`🔤 Début de la clé: ${apiKey.substring(0, 8)}...`);
    
    // 2. Initialiser Resend
    console.log('🚀 Initialisation de Resend...');
    const resend = new Resend(apiKey);
    console.log('✅ Resend initialisé');
    
    // 3. Préparer l'email de test
    const testEmail = {
      from: 'Festival Films Courts <noreply@updates.resend.dev>',
      to: 'topinambour124@gmail.com',
      subject: '🧪 Test Resend - Appel Bénévoles Fonctionnel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">🎉 Test Resend Réussi !</h1>
          
          <p>Bravo ! Si vous recevez cet email, cela signifie que :</p>
          
          <ul>
            <li>✅ La clé API Resend est correctement configurée</li>
            <li>✅ L'intégration Resend fonctionne</li>
            <li>✅ Les emails peuvent être envoyés depuis votre application</li>
          </ul>
          
          <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">📧 Détails de l'envoi :</p>
            <p style="margin: 5px 0;">De : Festival Films Courts</p>
            <p style="margin: 5px 0;">À : topinambour124@gmail.com</p>
            <p style="margin: 5px 0;">Date : ${new Date().toLocaleString('fr-FR')}</p>
          </div>
          
          <p>Vous pouvez maintenant utiliser la fonctionnalité d'appel aux bénévoles en toute confiance !</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Ceci est un email de test automatique envoyé depuis votre application Festival Films Courts - Bénévoles.
          </p>
        </div>
      `,
      text: `
🎉 Test Resend Réussi !

Bravo ! Si vous recevez cet email, cela signifie que :
- ✅ La clé API Resend est correctement configurée
- ✅ L'intégration Resend fonctionne
- ✅ Les emails peuvent être envoyés depuis votre application

📧 Détails de l'envoi :
De : Festival Films Courts
À : topinambour124@gmail.com
Date : ${new Date().toLocaleString('fr-FR')}

Vous pouvez maintenant utiliser la fonctionnalité d'appel aux bénévoles en toute confiance !
      `,
    };
    
    console.log('📧 Email de test préparé :');
    console.log(`   From: ${testEmail.from}`);
    console.log(`   To: ${testEmail.to}`);
    console.log(`   Subject: ${testEmail.subject}`);
    
    // 4. Envoyer l'email
    console.log('📤 Envoi de l\'email via Resend...');
    const result = await resend.emails.send(testEmail);
    
    console.log('✅ Resend a répondu !');
    console.log('📋 Résultat de Resend:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.error('❌ Erreur retournée par Resend:', result.error);
      return NextResponse.json({
        success: false,
        error: 'Erreur Resend',
        details: result.error,
        resendResponse: result,
      }, { status: 500 });
    }
    
    console.log('🎉 Email envoyé avec succès !');
    console.log(`📬 ID de l'email: ${result.data?.id}`);
    console.log('🧪 === FIN TEST RESEND (SUCCÈS) ===');
    
    return NextResponse.json({
      success: true,
      message: '✅ Email de test envoyé avec succès !',
      emailId: result.data?.id,
      to: testEmail.to,
      subject: testEmail.subject,
      resendResponse: result,
      instructions: [
        '1. Vérifiez votre boîte email (topinambour124@gmail.com)',
        '2. Vérifiez aussi les SPAMS (très important !)',
        '3. Si vous recevez l\'email, tout fonctionne !',
        '4. Consultez aussi le Dashboard Resend: https://resend.com/emails',
      ],
    });
    
  } catch (error: any) {
    console.error('💥 ERREUR CRITIQUE lors du test Resend:');
    console.error('Type:', error.constructor.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('🧪 === FIN TEST RESEND (ERREUR) ===');
    
    return NextResponse.json({
      success: false,
      error: 'Erreur lors du test',
      errorType: error.constructor.name,
      errorMessage: error.message,
      details: error.toString(),
    }, { status: 500 });
  }
}

