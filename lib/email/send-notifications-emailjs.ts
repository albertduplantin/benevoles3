import { sendEmailJS, EMAILJS_TEMPLATE_REGISTRATION } from './emailjs-config';
import { UserClient, MissionClient } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Envoie un email de confirmation d'inscription à une mission via EmailJS
 */
export async function sendMissionRegistrationEmailJS(
  volunteer: UserClient,
  mission: MissionClient
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('========================================');
    console.log('📧 ENVOI EMAIL VIA EMAILJS');
    console.log('========================================');
    
    // Vérifier les préférences de notification
    if (!volunteer.consents.communications || !volunteer.notificationPreferences?.email) {
      console.log(`❌ Notification email désactivée pour ${volunteer.email}`);
      return { success: false, error: 'Notifications désactivées par l\'utilisateur' };
    }

    const missionDate = mission.startDate
      ? format(new Date(mission.startDate), 'EEEE d MMMM yyyy', { locale: fr })
      : 'Date non définie';
    
    const missionTime = mission.startDate
      ? format(new Date(mission.startDate), 'HH:mm', { locale: fr })
      : '';

    const missionUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/dashboard/missions/${mission.id}`;

    // Paramètres pour le template EmailJS
    const templateParams = {
      volunteer_name: volunteer.firstName,
      mission_title: mission.title,
      mission_location: mission.location,
      mission_date: missionDate,
      mission_time: missionTime,
      mission_url: missionUrl,
      to_name: `${volunteer.firstName} ${volunteer.lastName}`,
    };

    console.log('📤 Template params:', templateParams);

    const result = await sendEmailJS(
      EMAILJS_TEMPLATE_REGISTRATION,
      templateParams,
      volunteer.email
    );

    if (!result.success) {
      console.error('❌ Échec envoi EmailJS:', result.error);
      console.log('========================================');
      return { success: false, error: result.error };
    }

    console.log('✅ Email envoyé avec succès via EmailJS !');
    console.log('========================================');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error in sendMissionRegistrationEmailJS:', error);
    console.log('========================================');
    return { success: false, error: error.message };
  }
}

/**
 * Envoie un email personnalisé à plusieurs bénévoles via EmailJS
 */
export async function sendBulkEmailsJS(
  volunteers: UserClient[],
  subject: string,
  message: string
): Promise<{ sent: number; failed: number; errors: string[] }> {
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  // Créer un template dynamique (vous pouvez créer un template spécifique sur EmailJS)
  const templateId = 'custom_announcement'; // À créer sur EmailJS

  for (const volunteer of volunteers) {
    try {
      // Vérifier les préférences
      if (!volunteer.consents.communications || !volunteer.notificationPreferences?.email) {
        failed++;
        errors.push(`${volunteer.email}: Notifications désactivées`);
        continue;
      }

      const templateParams = {
        to_name: `${volunteer.firstName} ${volunteer.lastName}`,
        subject,
        message,
      };

      const result = await sendEmailJS(templateId, templateParams, volunteer.email);

      if (!result.success) {
        failed++;
        errors.push(`${volunteer.email}: ${result.error}`);
      } else {
        sent++;
      }

      // Petite pause pour éviter de surcharger
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error: any) {
      failed++;
      errors.push(`${volunteer.email}: ${error.message}`);
    }
  }

  return { sent, failed, errors };
}

