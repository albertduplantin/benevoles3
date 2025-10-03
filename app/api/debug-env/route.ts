import { NextResponse } from 'next/server';

export async function GET() {
  const hasResendKey = !!process.env.RESEND_API_KEY;
  const resendKeyPrefix = process.env.RESEND_API_KEY?.substring(0, 5);
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
  
  console.log('========================================');
  console.log('🔍 DEBUG ENVIRONNEMENT');
  console.log('========================================');
  console.log('RESEND_API_KEY existe:', hasResendKey);
  console.log('RESEND_API_KEY préfixe:', resendKeyPrefix);
  console.log('NEXT_PUBLIC_APP_BASE_URL:', baseUrl);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('========================================');
  
  return NextResponse.json({
    hasResendKey,
    resendKeyPrefix,
    baseUrl,
    nodeEnv: process.env.NODE_ENV,
    status: hasResendKey ? '✅ Configuration OK' : '❌ RESEND_API_KEY manquante',
    help: hasResendKey 
      ? 'Votre configuration semble correcte !' 
      : 'Créez un fichier .env.local avec RESEND_API_KEY=re_xxxxx puis redémarrez le serveur',
  });
}

