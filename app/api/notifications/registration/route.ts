import { NextRequest, NextResponse } from 'next/server';
import { sendMissionRegistrationEmailJS } from '@/lib/email/send-notifications-emailjs';
import { getUserByIdAdmin } from '@/lib/firebase/users-admin';
import { getMissionByIdAdmin } from '@/lib/firebase/missions-admin';

export async function POST(request: NextRequest) {
  try {
    const { volunteerId, missionId } = await request.json();

    console.log('========================================');
    console.log('📧 NOTIFICATION INSCRIPTION MISSION');
    console.log('========================================');
    console.log('👤 Volunteer ID:', volunteerId);
    console.log('🎯 Mission ID:', missionId);

    if (!volunteerId || !missionId) {
      console.error('❌ Paramètres manquants');
      return NextResponse.json(
        { error: 'volunteerId and missionId are required' },
        { status: 400 }
      );
    }

    // Récupérer les données du bénévole (côté serveur avec Admin SDK)
    console.log('🔍 Récupération du bénévole...');
    const volunteer = await getUserByIdAdmin(volunteerId);
    if (!volunteer) {
      console.error('❌ Bénévole non trouvé');
      return NextResponse.json(
        { error: 'Volunteer not found' },
        { status: 404 }
      );
    }
    console.log('✅ Bénévole trouvé:', volunteer.email);
    console.log('📧 Notifications email activées:', volunteer.notificationPreferences?.email);
    console.log('📢 Communications activées:', volunteer.consents.communications);

    // Récupérer les données de la mission (côté serveur avec Admin SDK)
    console.log('🔍 Récupération de la mission...');
    const mission = await getMissionByIdAdmin(missionId);
    if (!mission) {
      console.error('❌ Mission non trouvée');
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      );
    }
    console.log('✅ Mission trouvée:', mission.title);

    // Envoyer l'email via EmailJS
    console.log('📤 Tentative d\'envoi de l\'email via EmailJS...');
    const result = await sendMissionRegistrationEmailJS(volunteer, mission);

    if (!result.success) {
      console.error('❌ Échec de l\'envoi:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    console.log('✅ Email envoyé avec succès !');
    console.log('========================================');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ ERREUR CATCH:', error);
    console.error('Stack:', error.stack);
    console.log('========================================');
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

