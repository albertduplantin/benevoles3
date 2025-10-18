import { User, UserRole, UserClient } from '@/types';

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
 * Check if a user is a category responsible
 */
export function isCategoryResponsible(role: UserRole): boolean {
  return role === 'category_responsible' || role === 'admin';
}

/**
 * Check if a user is responsible for a specific category
 */
export function isResponsibleForCategory(
  user: User | UserClient | null,
  categoryId: string
): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'category_responsible' && user.responsibleForCategories) {
    return user.responsibleForCategories.includes(categoryId);
  }
  return false;
}

/**
 * Check if a user can edit a specific mission based on its category
 */
export function canEditMission(
  user: User | UserClient | null,
  missionCategory: string
): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return isResponsibleForCategory(user, missionCategory);
}

/**
 * Check if a user can view volunteer contact details for a mission
 */
export function canViewMissionContacts(
  user: User | UserClient | null,
  missionCategory: string,
  missionVolunteers: string[]
): boolean {
  if (!user) return false;

  // Admin can see all
  if (user.role === 'admin') return true;

  // Category responsibles can see their category mission volunteers
  if (isResponsibleForCategory(user, missionCategory)) {
    return true;
  }

  // Regular volunteers can see other volunteers in the same mission
  if (missionVolunteers.includes(user.uid)) {
    return true;
  }

  return false;
}

/**
 * Check if a user can create missions for a specific category
 */
export function canCreateMissionForCategory(
  user: User | UserClient | null,
  categoryId: string
): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return isResponsibleForCategory(user, categoryId);
}

/**
 * Check if a user can delete a specific mission based on its category
 */
export function canDeleteMission(
  user: User | UserClient | null,
  missionCategory: string
): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return isResponsibleForCategory(user, missionCategory);
}

