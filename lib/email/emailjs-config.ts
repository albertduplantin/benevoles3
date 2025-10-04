import emailjs from '@emailjs/nodejs';

// Configuration EmailJS
export const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || '';
export const EMAILJS_TEMPLATE_REGISTRATION = process.env.EMAILJS_TEMPLATE_REGISTRATION || 'mission_registration';
export const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || '';
export const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || '';

/**
 * Envoyer un email via EmailJS
 */
export async function sendEmailJS(
  templateId: string,
  templateParams: Record<string, any>,
  recipientEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('📧 Envoi email via EmailJS...');
    console.log('Service ID:', EMAILJS_SERVICE_ID);
    console.log('Template ID:', templateId);
    console.log('To:', recipientEmail);

    if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
      throw new Error('EmailJS non configuré. Vérifiez vos variables d\'environnement.');
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      {
        ...templateParams,
        to_email: recipientEmail,
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    );

    console.log('✅ Email envoyé avec succès:', response);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur EmailJS:', error);
    return { success: false, error: error.message || error.text || 'Erreur inconnue' };
  }
}

