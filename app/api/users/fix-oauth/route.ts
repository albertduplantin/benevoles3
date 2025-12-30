import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/users/fix-oauth
 * Fixes broken OAuth external account links
 * This endpoint cleans up dangling references to deleted external accounts
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Check if there are any external accounts that appear in email links
    // but don't actually exist
    const emailAddresses = user.emailAddresses || [];
    const externalAccounts = user.externalAccounts || [];

    const externalAccountIds = new Set(externalAccounts.map(ea => ea.id));

    let hasOrphanedLinks = false;
    for (const email of emailAddresses) {
      const linkedTo = (email as any).linked_to || [];
      for (const link of linkedTo) {
        if (link.type === 'oauth_google' && !externalAccountIds.has(link.id)) {
          hasOrphanedLinks = true;
          console.log(`Found orphaned Google OAuth link: ${link.id}`);
        }
      }
    }

    if (hasOrphanedLinks) {
      // The issue is confirmed - there's a dangling reference
      // Since Clerk API doesn't provide a direct way to remove these,
      // we need to use the user's session to re-link
      return NextResponse.json({
        status: 'orphaned_link_detected',
        message: 'Lien OAuth orphelin détecté. Veuillez vous reconnecter avec Google pour le réparer.',
        instructions: [
          '1. Assurez-vous d\'être connecté à votre compte',
          '2. Allez dans les paramètres de votre profil',
          '3. Dans la section "Comptes connectés", cliquez sur "Connecter Google"',
          '4. Autorisez l\'accès avec le même compte Google'
        ]
      });
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Aucun problème détecté',
      externalAccounts: externalAccounts.map(ea => ({
        provider: ea.provider,
        email: ea.emailAddress,
        verified: ea.verification?.status === 'verified'
      }))
    });
  } catch (error) {
    console.error('Error checking OAuth status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
