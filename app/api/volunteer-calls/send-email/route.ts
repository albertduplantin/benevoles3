import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase/admin';

export const runtime = 'nodejs';

/**
 * API pour envoyer un appel à bénévoles par email
 * POST /api/volunteer-calls/send-email
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      recipientType, // 'all' | 'by_category' | 'without_mission' | 'custom'
      categoryIds, // Pour 'by_category'
      userIds, // Pour 'custom'
      subject,
      htmlContent,
      textContent,
      missionIds, // IDs des missions concernées
    } = body;

    // Validation
    if (!subject || !htmlContent) {
      return NextResponse.json(
        { error: 'subject et htmlContent sont requis' },
        { status: 400 }
      );
    }

    // Récupérer les destinataires selon le type
    const db = admin.firestore();
    let recipients: Array<{ email: string; firstName: string; uid: string }> = [];

    switch (recipientType) {
      case 'all':
        // Tous les bénévoles
        const allUsersSnapshot = await db.collection('users').get();
        recipients = allUsersSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              email: data.email,
              firstName: data.firstName,
              uid: doc.id,
            };
          })
          .filter(u => u.email); // Seulement ceux avec email
        break;

      case 'by_category':
        // Bénévoles ayant une préférence pour ces catégories
        if (!categoryIds || categoryIds.length === 0) {
          return NextResponse.json(
            { error: 'categoryIds requis pour by_category' },
            { status: 400 }
          );
        }
        
        const categoryUsersSnapshot = await db.collection('users')
          .where('preferences.preferredCategories', 'array-contains-any', categoryIds)
          .get();
        
        recipients = categoryUsersSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              email: data.email,
              firstName: data.firstName,
              uid: doc.id,
            };
          })
          .filter(u => u.email);
        break;

      case 'without_mission':
        // Bénévoles sans mission assignée
        const missionsSnapshot = await db.collection('missions')
          .where('status', '==', 'published')
          .get();
        
        const allAssignedUserIds = new Set<string>();
        missionsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          (data.volunteers || []).forEach((uid: string) => allAssignedUserIds.add(uid));
        });

        const allUsersSnapshot2 = await db.collection('users').get();
        recipients = allUsersSnapshot2.docs
          .map(doc => {
            const data = doc.data();
            return {
              email: data.email,
              firstName: data.firstName,
              uid: doc.id,
            };
          })
          .filter(u => u.email && !allAssignedUserIds.has(u.uid));
        break;

      case 'custom':
        // Liste personnalisée d'utilisateurs
        if (!userIds || userIds.length === 0) {
          return NextResponse.json(
            { error: 'userIds requis pour custom' },
            { status: 400 }
          );
        }

        const customUsersPromises = userIds.map((uid: string) => 
          db.collection('users').doc(uid).get()
        );
        const customUsersDocs = await Promise.all(customUsersPromises);
        
        recipients = customUsersDocs
          .filter(doc => doc.exists)
          .map(doc => {
            const data = doc.data()!;
            return {
              email: data.email,
              firstName: data.firstName,
              uid: doc.id,
            };
          })
          .filter(u => u.email);
        break;

      default:
        return NextResponse.json(
          { error: 'recipientType invalide' },
          { status: 400 }
        );
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'Aucun destinataire trouvé' },
        { status: 400 }
      );
    }

    // Enregistrer l'appel dans Firestore pour historique
    const callDoc = await db.collection('volunteer-calls').add({
      subject,
      recipientType,
      categoryIds: categoryIds || [],
      userIds: userIds || [],
      missionIds: missionIds || [],
      recipientCount: recipients.length,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'sending',
    });

    // Envoyer les emails (en arrière-plan)
    // Note: Dans un environnement de production, utilisez un service comme SendGrid, Mailgun, ou Resend
    // Pour l'instant, on simule l'envoi et on log
    console.log(`📧 Envoi d'appel à ${recipients.length} bénévoles`);
    console.log(`Sujet: ${subject}`);
    console.log(`Destinataires:`, recipients.map(r => `${r.firstName} <${r.email}>`).join(', '));

    // TODO: Intégrer avec un vrai service d'email
    // Exemple avec SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // 
    // const messages = recipients.map(r => ({
    //   to: r.email,
    //   from: 'noreply@benevoles3.vercel.app',
    //   subject: subject,
    //   html: htmlContent.replace('{{firstName}}', r.firstName),
    //   text: textContent,
    // }));
    // 
    // await sgMail.send(messages);

    // Mettre à jour le statut
    await db.collection('volunteer-calls').doc(callDoc.id).update({
      status: 'sent',
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      callId: callDoc.id,
      recipientCount: recipients.length,
      recipients: recipients.map(r => ({
        email: r.email,
        firstName: r.firstName,
      })),
      message: `Email envoyé à ${recipients.length} bénévole(s)`,
    });

  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'appel:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'envoi' },
      { status: 500 }
    );
  }
}

