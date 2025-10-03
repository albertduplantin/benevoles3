import { Resend } from 'resend';

// Initialiser Resend avec la clé API
// À ajouter dans .env.local : RESEND_API_KEY=re_xxxxx
const resend = new Resend(process.env.RESEND_API_KEY);

export { resend };

// Email par défaut pour les envois
export const DEFAULT_FROM_EMAIL = 'Festival Dinan <noreply@votredomaine.fr>';

// Note: Pour l'instant, utilisez votre email vérifié sur Resend
// Plus tard, vous pourrez configurer votre propre domaine

