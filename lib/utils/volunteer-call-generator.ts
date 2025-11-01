import { MissionClient } from '@/types';

interface MessageOptions {
  customIntro?: string;
  festivalName?: string;
  festivalDates?: string;
}

/**
 * Générer un message d'appel aux bénévoles pour les missions incomplètes
 */
export function generateVolunteerCallMessage(
  incompleteMissions: MissionClient[],
  options?: MessageOptions
): string {
  if (incompleteMissions.length === 0) {
    return "Toutes les missions sont complètes ! Aucun appel nécessaire pour le moment.";
  }

  const totalPlacesNeeded = incompleteMissions.reduce(
    (sum, mission) => sum + (mission.maxVolunteers - mission.volunteers.length),
    0
  );

  const festivalName = options?.festivalName || 'Festival Films Courts de Dinan';
  const festivalDates = options?.festivalDates || '19-23 novembre 2025';

  let message = options?.customIntro || `Bonjour à tous,\n\n`;
  message += `Nous avons encore besoin de ${totalPlacesNeeded} bénévole${totalPlacesNeeded > 1 ? 's' : ''} pour compléter nos missions du ${festivalName} (${festivalDates}).\n\n`;
  message += `Voici les missions qui ont besoin de vous :\n\n`;

  incompleteMissions.forEach((mission, index) => {
    const placesRemaining = mission.maxVolunteers - mission.volunteers.length;
    const dateStr = mission.startDate
      ? new Date(mission.startDate).toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Date à définir';

    message += `${index + 1}. ${mission.title}\n`;
    message += `   Date : ${dateStr}\n`;
    message += `   Lieu : ${mission.location}\n`;
    message += `   Places disponibles : ${placesRemaining}/${mission.maxVolunteers}\n`;
    
    if (mission.isUrgent) {
      message += `   [URGENT]\n`;
    }
    
    message += `   👉 S'inscrire : https://benevoles3.vercel.app/dashboard/missions/${mission.id}\n`;
    message += `\n`;
  });

  message += `Pour vous inscrire, rendez-vous sur :\n`;
  message += `https://benevoles3.vercel.app\n\n`;
  message += `Merci pour votre engagement !\n`;
  message += `L'équipe du Festival Films Courts de Dinan`;

  return message;
}

/**
 * Générer un message HTML pour email
 */
export function generateVolunteerCallHTML(
  incompleteMissions: MissionClient[],
  options?: MessageOptions
): string {
  if (incompleteMissions.length === 0) {
    return "<p>Toutes les missions sont complètes !</p>";
  }

  const totalPlacesNeeded = incompleteMissions.reduce(
    (sum, mission) => sum + (mission.maxVolunteers - mission.volunteers.length),
    0
  );

  const festivalName = options?.festivalName || 'Festival Films Courts de Dinan';
  const festivalDates = options?.festivalDates || '19-23 novembre 2025';
  const customIntro = options?.customIntro 
    ? `<p>${options.customIntro.replace(/\n/g, '<br>')}</p>` 
    : `<p>Bonjour à tous,</p>`;

  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">🎬 Appel aux Bénévoles</h2>
      ${customIntro}
      <p>Nous avons encore besoin de <strong>${totalPlacesNeeded} bénévole${totalPlacesNeeded > 1 ? 's' : ''}</strong> pour compléter nos missions du ${festivalName} (${festivalDates}).</p>
      
      <h3 style="color: #1d4ed8;">Missions disponibles :</h3>
  `;

  incompleteMissions.forEach((mission, index) => {
    const placesRemaining = mission.maxVolunteers - mission.volunteers.length;
    const dateStr = mission.startDate
      ? new Date(mission.startDate).toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Date à définir';

    const urgentBadge = mission.isUrgent
      ? '<span style="background: #ef4444; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px;">URGENT</span>'
      : '';

    html += `
      <div style="background: #f3f4f6; padding: 16px; margin: 16px 0; border-radius: 8px; border-left: 4px solid #2563eb;">
        <h4 style="margin: 0 0 8px 0; color: #1f2937;">${index + 1}. ${mission.title} ${urgentBadge}</h4>
        <p style="margin: 4px 0; color: #4b5563;">📅 ${dateStr}</p>
        <p style="margin: 4px 0; color: #4b5563;">📍 ${mission.location}</p>
        <p style="margin: 4px 0; color: #2563eb; font-weight: bold;">
          ${placesRemaining} place${placesRemaining > 1 ? 's' : ''} disponible${placesRemaining > 1 ? 's' : ''} (sur ${mission.maxVolunteers})
        </p>
        <a href="https://benevoles3.vercel.app/dashboard/missions/${mission.id}" 
           style="display: inline-block; margin-top: 8px; background: #2563eb; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">
          👉 S'inscrire à cette mission
        </a>
      </div>
    `;
  });

  html += `
      <div style="margin-top: 24px; padding: 16px; background: #eff6ff; border-radius: 8px;">
        <p style="margin: 0 0 12px 0; font-weight: bold;">Pour vous inscrire :</p>
        <a href="https://benevoles3.vercel.app" 
           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Accéder à la plateforme
        </a>
      </div>
      
      <p style="margin-top: 24px; color: #6b7280;">Merci pour votre engagement !<br>L'équipe du Festival Films Courts de Dinan</p>
    </div>
  `;

  return html;
}

/**
 * Obtenir les missions incomplètes
 */
export function getIncompleteMissions(missions: MissionClient[]): MissionClient[] {
  return missions.filter(
    (mission) =>
      mission.status === 'published' && mission.volunteers.length < mission.maxVolunteers
  );
}

/**
 * Obtenir les statistiques pour l'appel
 */
export function getVolunteerCallStats(missions: MissionClient[]) {
  const incomplete = getIncompleteMissions(missions);
  const totalPlacesNeeded = incomplete.reduce(
    (sum, mission) => sum + (mission.maxVolunteers - mission.volunteers.length),
    0
  );
  const urgentMissions = incomplete.filter((m) => m.isUrgent);

  return {
    incompleteMissions: incomplete.length,
    totalPlacesNeeded,
    urgentMissions: urgentMissions.length,
  };
}

