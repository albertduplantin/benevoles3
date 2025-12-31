/**
 * Script to fix Google OAuth by removing and re-adding the external account
 * This resolves the "External Account was not found" error
 */

const CLERK_SECRET_KEY = 'sk_test_jK8pgNrzjuYItd7d9sdEyBP1fNs6bzD7R7T0pFQBgY';
const USER_ID = 'user_37YoNV46mZ5e9fDYVFWXvy3cR3Z';
const EXTERNAL_ACCOUNT_ID = 'idn_37YwxYrPPj6W5EOmRzmoTGotvAR';

async function removeGoogleAccount() {
  console.log('Removing Google external account...');

  const response = await fetch(
    `https://api.clerk.com/v1/users/${USER_ID}/external_accounts/${EXTERNAL_ACCOUNT_ID}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Error removing external account:', error);

    // If it says "not found", that's actually good - it means it's already gone
    if (error.errors?.[0]?.code === 'external_account_not_found') {
      console.log('External account already removed (this is expected)');
      return true;
    }
    return false;
  }

  console.log('Successfully removed Google external account');
  return true;
}

async function getUserDetails() {
  console.log('Fetching user details...');

  const response = await fetch(
    `https://api.clerk.com/v1/users/${USER_ID}`,
    {
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
      },
    }
  );

  const user = await response.json();
  console.log('User external accounts:', user.external_accounts?.length || 0);
  console.log('User email addresses:', user.email_addresses?.map(e => e.email_address));

  return user;
}

async function main() {
  console.log('Starting Google OAuth fix...\n');

  // Step 1: Check current state
  await getUserDetails();

  // Step 2: Remove the broken external account
  await removeGoogleAccount();

  // Step 3: Verify it's removed
  console.log('\nVerifying removal...');
  const updatedUser = await getUserDetails();

  console.log('\n✓ Done!');
  console.log('\nNext steps:');
  console.log('1. Go to your application login page');
  console.log('2. Click "Continue with Google"');
  console.log('3. It should now create a fresh Google OAuth connection');
}

main().catch(console.error);
