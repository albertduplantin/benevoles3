import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email/resend-config';

export async function POST(request: NextRequest) {
  try {
    const { to } = await request.json();
    
    console.log('========================================');
    console.log('🔍 DEBUG EMAIL TEST');
    console.log('========================================');
    console.log('📧 Destinataire:', to);
    console.log('🔑 RESEND_API_KEY existe:', !!process.env.RESEND_API_KEY);
    console.log('🔑 RESEND_API_KEY commence par:', process.env.RESEND_API_KEY?.substring(0, 5));
    console.log('🌐 NEXT_PUBLIC_APP_BASE_URL:', process.env.NEXT_PUBLIC_APP_BASE_URL);
    console.log('========================================');
    
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY non définie !');
      return NextResponse.json(
        { 
          error: 'RESEND_API_KEY non définie dans .env.local',
          help: 'Créez un fichier .env.local avec : RESEND_API_KEY=re_xxxxx'
        },
        { status: 500 }
      );
    }
    
    if (!to) {
      return NextResponse.json(
        { error: 'Email destinataire requis' },
        { status: 400 }
      );
    }
    
    console.log('📤 Tentative d\'envoi via Resend...');
    
    const { data, error } = await resend.emails.send({
      from: 'Test Festival <onboarding@resend.dev>', // Email de test Resend
      to,
      subject: '🎬 Test Email - Festival Films Courts Dinan',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">✅ Test réussi !</h1>
          <p>Cet email a été envoyé depuis votre application Festival Bénévoles.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <h2>Configuration détectée :</h2>
          <ul>
            <li>✅ RESEND_API_KEY configurée</li>
            <li>✅ Email envoyé à : <strong>${to}</strong></li>
            <li>✅ Serveur Next.js fonctionnel</li>
          </ul>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Si vous voyez cet email, votre système de notifications fonctionne parfaitement ! 🎉
          </p>
        </div>
      `,
    });
    
    if (error) {
      console.error('❌ Erreur Resend:', error);
      return NextResponse.json({ 
        error: error.message,
        details: error,
        help: 'Vérifiez que votre email est vérifié sur Resend (Dashboard → Domains)'
      }, { status: 500 });
    }
    
    console.log('✅ Email envoyé avec succès !');
    console.log('📨 ID:', data?.id);
    console.log('========================================');
    
    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Email envoyé ! Vérifiez votre boîte (et les spams).'
    });
  } catch (error: any) {
    console.error('❌ Erreur catch:', error);
    console.error('Stack:', error.stack);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack,
      help: 'Vérifiez les logs du serveur pour plus de détails'
    }, { status: 500 });
  }
}

