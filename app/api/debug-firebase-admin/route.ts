import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasProjectId = !!process.env.FIREBASE_ADMIN_PROJECT_ID;
    const hasClientEmail = !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const hasPrivateKey = !!process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    
    console.log('========================================');
    console.log('🔍 DEBUG FIREBASE ADMIN SDK');
    console.log('========================================');
    console.log('FIREBASE_ADMIN_PROJECT_ID:', hasProjectId ? '✅' : '❌');
    console.log('FIREBASE_ADMIN_CLIENT_EMAIL:', hasClientEmail ? '✅' : '❌');
    console.log('FIREBASE_ADMIN_PRIVATE_KEY:', hasPrivateKey ? '✅' : '❌');
    
    if (hasProjectId) {
      console.log('Project ID:', process.env.FIREBASE_ADMIN_PROJECT_ID);
    }
    if (hasClientEmail) {
      console.log('Client Email:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
    }
    if (hasPrivateKey) {
      console.log('Private Key (first 50 chars):', process.env.FIREBASE_ADMIN_PRIVATE_KEY?.substring(0, 50));
    }
    console.log('========================================');
    
    return NextResponse.json({
      hasProjectId,
      hasClientEmail,
      hasPrivateKey,
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'NOT_SET',
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 'NOT_SET',
      privateKeyPrefix: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.substring(0, 50) || 'NOT_SET',
      status: hasProjectId && hasClientEmail && hasPrivateKey 
        ? '✅ Configuration complète' 
        : '❌ Configuration incomplète',
    });
  } catch (error: any) {
    console.error('Error checking Firebase Admin:', error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

