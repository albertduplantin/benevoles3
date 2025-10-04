import { render } from '@react-email/components';
import { resend, DEFAULT_FROM_EMAIL } from './resend-config';
import { MissionRegistrationEmail } from './templates/mission-registration';
import { MissionReminderEmail } from './templates/mission-reminder';
import { UserClient, MissionClient } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Envoie un email de confirmation d'inscription à une mission
 */
export async function sendMissionRegistrationEmail(
  volunteer: UserClient,
  mission: MissionClient
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier les préférences de notification
    if (!volunteer.consents.communications || !volunteer.notificationPreferences?.email) {
      console.log(`Notification email désactivée pour ${volunteer.email}`);
      return { success: false, error: 'Notifications désactivées par l\'utilisateur' };
    }

    const missionDate = mission.startDate
      ? format(new Date(mission.startDate), 'EEEE d MMMM yyyy', { locale: fr })
      : 'Date non définie';
    
    const missionTime = mission.startDate
      ? format(new Date(mission.startDate), 'HH:mm', { locale: fr })
      : '';

    const missionUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/dashboard/missions/${mission.id}`;

    const emailHtml = await render(
      MissionRegistrationEmail({
        volunteerName: volunteer.firstName,
        missionTitle: mission.title,
        missionLocation: mission.location,
        missionDate,
        missionTime,
        missionUrl,
      })
    );

    console.log('🔍 Type de emailHtml:', typeof emailHtml);
    console.log('🔍 emailHtml preview:', emailHtml?.substring(0, 100));

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: volunteer.email,
      subject: `Confirmation d'inscription - ${mission.title}`,
      html: String(emailHtml),
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data);
    return { success: true };
  } catch (error: any) {
    console.error('Error in sendMissionRegistrationEmail:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie un email de rappel 24h avant une mission
 */
export async function sendMissionReminderEmail(
  volunteer: UserClient,
  mission: MissionClient,
  responsible?: UserClient
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier les préférences de notification
    if (!volunteer.consents.communications || !volunteer.notificationPreferences?.email) {
      console.log(`Notification email désactivée pour ${volunteer.email}`);
      return { success: false, error: 'Notifications désactivées par l\'utilisateur' };
    }

    const missionDate = mission.startDate
      ? format(new Date(mission.startDate), 'EEEE d MMMM yyyy', { locale: fr })
      : 'Date non définie';
    
    const missionTime = mission.startDate
      ? format(new Date(mission.startDate), 'HH:mm', { locale: fr })
      : '';

    const missionUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/dashboard/missions/${mission.id}`;

    const emailHtml = await render(
      MissionReminderEmail({
        volunteerName: volunteer.firstName,
        missionTitle: mission.title,
        missionLocation: mission.location,
        missionDate,
        missionTime,
        missionUrl,
        responsibleName: responsible ? `${responsible.firstName} ${responsible.lastName}` : undefined,
        responsiblePhone: responsible?.phone,
      })
    );

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: volunteer.email,
      subject: `⏰ Rappel : Mission demain - ${mission.title}`,
      html: String(emailHtml),
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }

    console.log('Reminder email sent successfully:', data);
    return { success: true };
  } catch (error: any) {
    console.error('Error in sendMissionReminderEmail:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie un email à plusieurs bénévoles (batch)
 */
export async function sendBulkEmails(
  volunteers: UserClient[],
  subject: string,
  htmlContent: string
): Promise<{ sent: number; failed: number; errors: string[] }> {
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const volunteer of volunteers) {
    try {
      // Vérifier les préférences
      if (!volunteer.consents.communications || !volunteer.notificationPreferences?.email) {
        failed++;
        errors.push(`${volunteer.email}: Notifications désactivées`);
        continue;
      }

      const { error } = await resend.emails.send({
        from: DEFAULT_FROM_EMAIL,
        to: volunteer.email,
        subject,
        html: htmlContent,
      });

      if (error) {
        failed++;
        errors.push(`${volunteer.email}: ${error.message}`);
      } else {
        sent++;
      }

      // Petite pause pour éviter de surcharger l'API
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error: any) {
      failed++;
      errors.push(`${volunteer.email}: ${error.message}`);
    }
  }

  return { sent, failed, errors };
}

