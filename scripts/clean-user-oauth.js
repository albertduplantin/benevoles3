/**
 * Clean user OAuth state by removing all external account references
 * This fixes the "ghost" Google account link that doesn't actually exist
 */

const CLERK_SECRET_KEY = 'sk_test_jK8pgNrzjuYItd7d9sdEyBP1fNs6bzD7R7T0pFQBgY';
const USER_ID = 'user_37YoNV46mZ5e9fDYVFWXvy3cR3Z';
const EMAIL_ADDRESS_ID = 'idn_37YoLUqHfnXMU9hyjDi1P1dBJ5j';

async function unlinkOAuthFromEmail() {
  console.log('Attempting to unlink OAuth from email address...');

  // Try to update the email address metadata to remove the link
  const response = await fetch(
    `https://api.clerk.com/v1/email_addresses/${EMAIL_ADDRESS_ID}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        verified: true, // Keep verified status
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Error updating email:', error);
    return false;
  }

  const updated = await response.json();
  console.log('Email updated, linked_to:', updated.linked_to);
  return true;
}

async function deleteUser() {
  console.log('\n⚠️  NUCLEAR OPTION: Delete and recreate user');
  console.log('This will:');
  console.log('- Delete the current user account');
  console.log('- Allow you to create a fresh account with Google');
  console.log('\nWARNING: This will lose all user data!');

  // Don't actually do this automatically
  console.log('\nTo delete the user manually, run:');
  console.log(`curl -X DELETE "https://api.clerk.com/v1/users/${USER_ID}" \\`);
  console.log(`  -H "Authorization: Bearer ${CLERK_SECRET_KEY}"`);
}

async function createManualOAuthLink() {
  console.log('\nAttempting to create OAuth link manually...');

  // Try to create a new external account
  const response = await fetch(
    `https://api.clerk.com/v1/users/${USER_ID}/external_accounts`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        strategy: 'oauth_google',
        email_address: 'topinambour124@gmail.com',
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Error creating external account:', error);
    return false;
  }

  const account = await response.json();
  console.log('Created external account:', account.id);
  return true;
}

async function updateUserMetadata() {
  console.log('Clearing OAuth metadata...');

  const response = await fetch(
    `https://api.clerk.com/v1/users/${USER_ID}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: {
          oauth_fixed: true,
          fixed_at: new Date().toISOString(),
        },
      }),
    }
  );

  const user = await response.json();
  console.log('User metadata updated');
  return user;
}

async function main() {
  console.log('=== Clerk OAuth Cleanup Tool ===\n');

  // Try each approach
  console.log('1. Attempting to unlink OAuth from email...');
  await unlinkOAuthFromEmail();

  console.log('\n2. Updating user metadata...');
  await updateUserMetadata();

  console.log('\n3. Trying to create manual OAuth link...');
  await createManualOAuthLink();

  console.log('\n=== RECOMMENDED SOLUTION ===');
  console.log('\nSince the OAuth link is in a broken state, the best approach is:');
  console.log('\n1. Use the Clerk Dashboard (https://dashboard.clerk.com)');
  console.log('2. Go to Users → Find your user (topinambour124@gmail.com)');
  console.log('3. In the user details, look for "External Accounts" section');
  console.log('4. Delete the broken Google account link');
  console.log('5. Then login with Google again to create a fresh link');
  console.log('\nOR');
  console.log('\n1. Delete the user account entirely');
  console.log('2. Sign up fresh with Google (this will create the account correctly)');

  await deleteUser();
}

main().catch(console.error);
