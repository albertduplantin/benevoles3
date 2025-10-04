import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/components';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/email/resend-config';
import { CustomAnnouncementEmail } from '@/lib/email/templates/custom-announcement';
import { getAllVolunteersAdmin } from '@/lib/firebase/users-admin';
import { createNotificationLog } from '@/lib/firebase/notification-logs';
import { UserClient } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { 
      subject, 
      message, 
      ctaText, 
      ctaUrl, 
      targetAll, 
      targetVolunteerIds,
      sentBy // UID de l'admin qui envoie
    } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    let recipients: UserClient[] = [];

    if (targetAll) {
      // Envoyer à tous les bénévoles
      recipients = await getAllVolunteersAdmin();
    } else if (targetVolunteerIds && Array.isArray(targetVolunteerIds)) {
      // Envoyer uniquement aux bénévoles spécifiés
      const allVolunteers = await getAllVolunteersAdmin();
      recipients = allVolunteers.filter(v => targetVolunteerIds.includes(v.uid));
    } else {
      return NextResponse.json(
        { error: 'Either targetAll or targetVolunteerIds must be provided' },
        { status: 400 }
      );
    }

    // Filtrer selon les préférences de notification
    const eligibleRecipients = recipients.filter(
      v => v.consents.communications && v.notificationPreferences?.email
    );

    if (eligibleRecipients.length === 0) {
      return NextResponse.json(
        { 
          success: true, 
          sent: 0, 
          skipped: recipients.length,
          message: 'Aucun destinataire éligible (notifications désactivées)' 
        },
        { status: 200 }
      );
    }

    // Générer l'email
    const emailHtml = await render(
      CustomAnnouncementEmail({
        subject,
        message,
        ctaText,
        ctaUrl,
      })
    );

    // Envoyer les emails
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const volunteer of eligibleRecipients) {
      try {
        const { error } = await resend.emails.send({
          from: DEFAULT_FROM_EMAIL,
          to: volunteer.email,
          subject,
          html: String(emailHtml),
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

    // Logger l'envoi
    try {
      await createNotificationLog({
        type: 'custom',
        subject,
        recipientCount: eligibleRecipients.length,
        sentCount: sent,
        failedCount: failed,
        errors: errors.length > 0 ? errors : undefined,
        sentBy: sentBy || 'unknown',
      });
    } catch (logError) {
      console.error('Failed to log notification:', logError);
      // Ne pas faire échouer l'envoi si le log échoue
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      skipped: recipients.length - eligibleRecipients.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Error sending custom notification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send notification' },
      { status: 500 }
    );
  }
}

