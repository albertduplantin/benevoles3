import { NotificationPayload, Mission, UserClient } from '@/types';

/**
 * Envoyer une notification à des utilisateurs spécifiques
 */
export async function sendNotification(userIds: string[], payload: NotificationPayload): Promise<boolean> {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIds, payload }),
    });

    if (!response.ok) {
      console.error('Erreur lors de l\'envoi de la notification:', await response.text());
      return false;
    }

    const result = await response.json();
    console.log('Notification envoyée:', result);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    return false;
  }
}

/**
 * Envoyer une notification broadcast
 */
export async function sendBroadcastNotification(
  target: 'all' | 'role' | 'category',
  payload: NotificationPayload,
  targetValue?: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/notifications/broadcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target, targetValue, payload }),
    });

    if (!response.ok) {
      console.error('Erreur lors de l\'envoi du broadcast:', await response.text());
      return false;
    }

    const result = await response.json();
    console.log('Broadcast envoyé:', result);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du broadcast:', error);
    return false;
  }
}

/**
 * Notifier un bénévole qu'il a été affecté à une mission
 */
export async function notifyVolunteerAssignment(
  volunteerId: string,
  mission: Mission,
  volunteer: UserClient
): Promise<boolean> {
  const payload: NotificationPayload = {
    type: 'new_assignment',
    title: '🎯 Nouvelle affectation !',
    body: `Vous avez été affecté(e) à la mission "${mission.title}"`,
    url: `/dashboard/missions/${mission.id}`,
    missionId: mission.id,
  };

  return sendNotification([volunteerId], payload);
}

/**
 * Notifier un bénévole qu'il a été désaffecté d'une mission
 */
export async function notifyVolunteerUnassignment(
  volunteerId: string,
  mission: Mission
): Promise<boolean> {
  const payload: NotificationPayload = {
    type: 'mission_update',
    title: 'ℹ️ Désaffectation',
    body: `Vous avez été retiré(e) de la mission "${mission.title}"`,
    url: '/dashboard',
  };

  return sendNotification([volunteerId], payload);
}

/**
 * Notifier les bénévoles affectés qu'une mission a été modifiée
 */
export async function notifyMissionUpdate(mission: Mission, changeDescription?: string): Promise<boolean> {
  if (!mission.volunteers || mission.volunteers.length === 0) {
    return true; // Pas de bénévoles à notifier
  }

  const body = changeDescription
    ? `La mission "${mission.title}" a été modifiée : ${changeDescription}`
    : `La mission "${mission.title}" a été modifiée`;

  const payload: NotificationPayload = {
    type: 'mission_update',
    title: '⚠️ Modification de mission',
    body: body,
    url: `/dashboard/missions/${mission.id}`,
    missionId: mission.id,
  };

  return sendNotification(mission.volunteers, payload);
}

/**
 * Notifier les bénévoles affectés qu'une mission a été annulée
 */
export async function notifyMissionCancellation(mission: Mission): Promise<boolean> {
  if (!mission.volunteers || mission.volunteers.length === 0) {
    return true; // Pas de bénévoles à notifier
  }

  const payload: NotificationPayload = {
    type: 'mission_cancellation',
    title: '❌ Mission annulée',
    body: `La mission "${mission.title}" a été annulée`,
    url: '/dashboard',
    missionId: mission.id,
  };

  return sendNotification(mission.volunteers, payload);
}

/**
 * Envoyer un rappel 24h avant une mission
 */
export async function sendMissionReminder(mission: Mission): Promise<boolean> {
  if (!mission.volunteers || mission.volunteers.length === 0) {
    return true; // Pas de bénévoles à notifier
  }

  // Formater la date et l'heure
  if (!mission.startDate) {
    // Mission sans date de début (ongoing)
    return true;
  }
  
  const startDate = mission.startDate instanceof Date ? mission.startDate : new Date((mission.startDate as any).seconds * 1000);
  const dateStr = startDate.toLocaleDateString('fr-FR', { 
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const timeStr = startDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const payload: NotificationPayload = {
    type: 'mission_reminder',
    title: '🔔 Rappel de mission',
    body: `N'oubliez pas votre mission "${mission.title}" demain ${dateStr} à ${timeStr}`,
    url: `/dashboard/missions/${mission.id}`,
    missionId: mission.id,
  };

  return sendNotification(mission.volunteers, payload);
}

/**
 * Envoyer un message d'un responsable de catégorie aux bénévoles
 */
export async function sendCategoryMessage(
  categoryId: string,
  title: string,
  message: string,
  volunteerIds: string[]
): Promise<boolean> {
  const payload: NotificationPayload = {
    type: 'category_message',
    title: `💬 ${title}`,
    body: message,
    url: '/dashboard',
    categoryId: categoryId,
  };

  return sendNotification(volunteerIds, payload);
}

/**
 * Envoyer une annonce générale à tous les bénévoles
 */
export async function sendGeneralAnnouncement(title: string, message: string): Promise<boolean> {
  const payload: NotificationPayload = {
    type: 'general_announcement',
    title: `📢 ${title}`,
    body: message,
    url: '/dashboard',
  };

  return sendBroadcastNotification('all', payload);
}

/**
 * Envoyer une annonce à un rôle spécifique
 */
export async function sendRoleAnnouncement(
  role: 'volunteer' | 'category_responsible' | 'admin',
  title: string,
  message: string
): Promise<boolean> {
  const payload: NotificationPayload = {
    type: 'general_announcement',
    title: `📢 ${title}`,
    body: message,
    url: '/dashboard',
  };

  return sendBroadcastNotification('role', payload, role);
}

