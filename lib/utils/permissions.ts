import { User, UserRole } from '@/types';

/**
 * Check if a user has a specific role or admin privileges
 */
export function hasPermission(user: User | null, requiredRole: UserRole): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.role === requiredRole;
}

/**
 * Check if a user has admin privileges
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'admin';
}

/**
 * Check if a user is a mission responsible
 */
export function isMissionResponsible(role: UserRole): boolean {
  return role === 'mission_responsible' || role === 'admin';
}

/**
 * Check if a user can edit a specific mission
 */
export function canEditMission(
  userRole: UserRole,
  userId: string,
  missionResponsibles: string[]
): boolean {
  if (userRole === 'admin') return true;
  if (userRole === 'mission_responsible') {
    return missionResponsibles.includes(userId);
  }
  return false;
}

/**
 * Check if a user can view volunteer contact details for a mission
 */
export function canViewMissionContacts(
  userRole: UserRole,
  userId: string,
  missionResponsibles: string[],
  missionVolunteers: string[]
): boolean {
  // Admin can see all
  if (userRole === 'admin') return true;

  // Mission responsibles can see their mission volunteers
  if (
    userRole === 'mission_responsible' &&
    missionResponsibles.includes(userId)
  ) {
    return true;
  }

  // Regular volunteers can see other volunteers in the same mission
  if (missionVolunteers.includes(userId)) {
    return true;
  }

  return false;
}

