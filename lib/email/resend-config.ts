import { Resend } from 'resend';

// Initialiser Resend avec la clé API
// À ajouter dans .env.local : RESEND_API_KEY=re_xxxxx
const resend = new Resend(process.env.RESEND_API_KEY);

export { resend };

// Email par défaut pour les envois
// Utiliser l'email de test Resend (fonctionne sans configuration)
export const DEFAULT_FROM_EMAIL = 'Festival Dinan <onboarding@resend.dev>';

// Note: Plus tard, vous pourrez configurer votre propre domaine
// En ajoutant et vérifiant votre domaine sur https://resend.com/domains

