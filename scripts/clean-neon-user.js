/**
 * Clean up user data from Neon database
 */

import { db } from '../lib/db/index.js';
import { users } from '../lib/db/schema.js';
import { eq } from 'drizzle-orm';

const USER_ID = 'user_37YoNV46mZ5e9fDYVFWXvy3cR3Z';

async function cleanUser() {
  console.log('Deleting user from Neon database...');

  try {
    await db.delete(users).where(eq(users.id, USER_ID));
    console.log('✓ User deleted from Neon');
  } catch (error) {
    console.log('User not in database or already deleted');
  }
}

cleanUser();
