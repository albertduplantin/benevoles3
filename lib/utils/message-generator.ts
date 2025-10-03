import { MissionClient } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Génère un message d'appel aux bénévoles pour les missions incomplètes
 */
export function generateVolunteerCallMessage(
  incompleteMissions: MissionClient[],
  baseUrl: string
): string {
  if (incompleteMissions.length === 0) {
    return '✅ Toutes les missions sont complètes ! Aucun appel aux bénévoles nécessaire.';
  }

  const header = `🎬 **Festival Films Courts de Dinan 2025** 🎬

🙏 **Appel aux bénévoles !**

Nous avons besoin de votre aide pour faire de ce festival un succès ! Voici les missions qui nécessitent encore des bénévoles :

━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  const missions = incompleteMissions
    .map((mission, index) => {
      const remaining = mission.maxVolunteers - mission.volunteers.length;
      const urgentFlag = mission.isUrgent ? '🔴 URGENT' : '';
      const dateInfo = mission.startDate
        ? `📅 ${format(new Date(mission.startDate), "EEEE d MMMM 'à' HH'h'mm", { locale: fr })}`
        : '📅 Mission ponctuelle';
      const locationInfo = `📍 ${mission.location}`;
      const link = `${baseUrl}/dashboard/missions/${mission.id}`;

      return `
**${index + 1}. ${mission.title}** ${urgentFlag}

${mission.description.length > 150 ? mission.description.substring(0, 150) + '...' : mission.description}

${dateInfo}
${locationInfo}
👥 **${remaining} bénévole${remaining > 1 ? 's' : ''} recherché${remaining > 1 ? 's' : ''}**

🔗 **Inscrivez-vous ici :** ${link}

━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    })
    .join('\n');

  const footer = `
💙 **Pourquoi nous rejoindre ?**
✨ Vivez le festival de l'intérieur
🤝 Rencontrez des passionnés de cinéma
🎟️ Accès privilégié aux projections
☕ Convivialité et bonne ambiance garanties !

📲 **Partagez ce message** à vos amis qui pourraient être intéressés !

Merci pour votre engagement ! 🙌

---
Festival Films Courts de Dinan 2025
19-23 Novembre 2025
`;

  return header + missions + footer;
}

/**
 * Génère une version HTML du message pour email
 */
export function generateVolunteerCallMessageHTML(
  incompleteMissions: MissionClient[],
  baseUrl: string
): string {
  if (incompleteMissions.length === 0) {
    return '<p style="color: green;">✅ Toutes les missions sont complètes ! Aucun appel aux bénévoles nécessaire.</p>';
  }

  const missionsHTML = incompleteMissions
    .map((mission, index) => {
      const remaining = mission.maxVolunteers - mission.volunteers.length;
      const urgentStyle = mission.isUrgent
        ? 'background: #fee2e2; border-left: 4px solid #ef4444; padding-left: 12px;'
        : '';
      const dateInfo = mission.startDate
        ? format(new Date(mission.startDate), "EEEE d MMMM 'à' HH'h'mm", { locale: fr })
        : 'Mission ponctuelle';
      const link = `${baseUrl}/dashboard/missions/${mission.id}`;

      return `
        <div style="margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; ${urgentStyle}">
          <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 18px;">
            ${index + 1}. ${mission.title}
            ${mission.isUrgent ? '<span style="color: #ef4444; font-weight: bold;"> 🔴 URGENT</span>' : ''}
          </h3>
          <p style="margin: 8px 0; color: #4b5563; font-size: 14px;">
            ${mission.description.length > 150 ? mission.description.substring(0, 150) + '...' : mission.description}
          </p>
          <div style="margin: 12px 0; font-size: 14px; color: #6b7280;">
            <p style="margin: 4px 0;">📅 ${dateInfo}</p>
            <p style="margin: 4px 0;">📍 ${mission.location}</p>
            <p style="margin: 4px 0; font-weight: bold; color: #2563eb;">
              👥 ${remaining} bénévole${remaining > 1 ? 's' : ''} recherché${remaining > 1 ? 's' : ''}
            </p>
          </div>
          <a href="${link}" 
             style="display: inline-block; margin-top: 12px; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
            🔗 Je m'inscris !
          </a>
        </div>
      `;
    })
    .join('');

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #111827; font-size: 24px; margin: 0 0 8px 0;">🎬 Festival Films Courts de Dinan 2025 🎬</h1>
        <h2 style="color: #ef4444; font-size: 20px; margin: 0;">🙏 Appel aux bénévoles !</h2>
      </div>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Nous avons besoin de votre aide pour faire de ce festival un succès ! Voici les missions qui nécessitent encore des bénévoles :
      </p>

      ${missionsHTML}

      <div style="margin-top: 32px; padding: 20px; background: #dbeafe; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 12px 0;">💙 Pourquoi nous rejoindre ?</h3>
        <ul style="margin: 0; padding-left: 20px; color: #1e3a8a;">
          <li>✨ Vivez le festival de l'intérieur</li>
          <li>🤝 Rencontrez des passionnés de cinéma</li>
          <li>🎟️ Accès privilégié aux projections</li>
          <li>☕ Convivialité et bonne ambiance garanties !</li>
        </ul>
      </div>

      <p style="text-align: center; margin-top: 24px; color: #6b7280; font-size: 14px;">
        📲 Partagez ce message à vos amis qui pourraient être intéressés !
      </p>

      <p style="text-align: center; margin-top: 24px; font-size: 16px; font-weight: bold;">
        Merci pour votre engagement ! 🙌
      </p>

      <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
        <p style="margin: 4px 0;">Festival Films Courts de Dinan 2025</p>
        <p style="margin: 4px 0;">19-23 Novembre 2025</p>
      </div>
    </div>
  `;
}

/**
 * Filtre les missions incomplètes et publiées
 */
export function getIncompleteMissions(missions: MissionClient[]): MissionClient[] {
  return missions
    .filter(
      (mission) =>
        mission.status === 'published' &&
        mission.volunteers.length < mission.maxVolunteers
    )
    .sort((a, b) => {
      // Trier par urgence puis par places restantes
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      
      const remainingA = a.maxVolunteers - a.volunteers.length;
      const remainingB = b.maxVolunteers - b.volunteers.length;
      return remainingB - remainingA; // Plus de places restantes en premier
    });
}

