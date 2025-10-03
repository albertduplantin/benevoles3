/**
 * Firestore Collection Names
 * Centralized collection name constants to avoid typos
 */

export const COLLECTIONS = {
  USERS: 'users',
  MISSIONS: 'missions',
  VOLUNTEER_REQUESTS: 'volunteerRequests',
  EXPORTS: 'exports',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

