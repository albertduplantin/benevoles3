import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase/admin';
import { Resend } from 'resend';

export const runtime = 'nodejs';

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Vérifier que la clé API Resend est configurée
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY non configurée - Envoi simulé');
      console.log(`📧 Simulation d'envoi à ${recipients.length} bénévoles`);
      console.log(`Sujet: ${subject}`);
      console.log(`Destinataires:`, recipients.map(r => `${r.firstName} <${r.email}>`).join(', '));
      
      // Mettre à jour le statut comme "simulé"
      await db.collection('volunteer-calls').doc(callDoc.id).update({
        status: 'simulated',
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
        message: `⚠️ Envoi simulé à ${recipients.length} bénévole(s) (RESEND_API_KEY non configurée)`,
        simulated: true,
      });
    }

    // Envoyer les emails avec Resend
    console.log(`📧 Envoi réel d'emails à ${recipients.length} bénévoles via Resend`);
    
    try {
      // Resend permet d'envoyer en batch (max 100 à la fois)
      const batchSize = 100;
      const batches = [];
      
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        batches.push(batch);
      }

      let totalSent = 0;
      const errors: any[] = [];

      for (const batch of batches) {
        try {
          // Envoyer chaque email individuellement pour personnaliser le prénom
          const sendPromises = batch.map(recipient => 
            resend.emails.send({
              from: 'Festival Films Courts <noreply@updates.resend.dev>', // À remplacer par votre domaine vérifié
              to: recipient.email,
              subject: subject,
              html: htmlContent.replace(/{{firstName}}/g, recipient.firstName),
              text: textContent,
            })
          );

          const results = await Promise.allSettled(sendPromises);
          
          results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              totalSent++;
            } else {
              errors.push({
                email: batch[index].email,
                error: result.reason,
              });
            }
          });
        } catch (batchError) {
          console.error('Erreur lors de l\'envoi d\'un batch:', batchError);
          errors.push({ batch: true, error: batchError });
        }
      }

      console.log(`✅ ${totalSent}/${recipients.length} emails envoyés avec succès`);
      if (errors.length > 0) {
        console.error(`❌ ${errors.length} erreurs d'envoi:`, errors);
      }

      // Mettre à jour le statut
      await db.collection('volunteer-calls').doc(callDoc.id).update({
        status: totalSent > 0 ? 'sent' : 'failed',
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        sentCount: totalSent,
        errorCount: errors.length,
        errors: errors.slice(0, 10), // Garder max 10 erreurs
      });

    } catch (emailError: any) {
      console.error('Erreur lors de l\'envoi des emails:', emailError);
      
      // Mettre à jour le statut comme "failed"
      await db.collection('volunteer-calls').doc(callDoc.id).update({
        status: 'failed',
        error: emailError.message,
      });

      return NextResponse.json(
        { error: `Erreur d'envoi: ${emailError.message}` },
        { status: 500 }
      );
    }

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

