import { NextRequest, NextResponse } from 'next/server';
import { sendMissionRegistrationEmail } from '@/lib/email/send-notifications';
import { getUserById } from '@/lib/firebase/users';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { MissionClient } from '@/types';

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

    // Récupérer les données du bénévole
    console.log('🔍 Récupération du bénévole...');
    const volunteer = await getUserById(volunteerId);
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

    // Récupérer les données de la mission
    console.log('🔍 Récupération de la mission...');
    const missionDoc = await getDoc(doc(db, COLLECTIONS.MISSIONS, missionId));
    if (!missionDoc.exists()) {
      console.error('❌ Mission non trouvée');
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      );
    }
    console.log('✅ Mission trouvée:', missionDoc.id);

    const missionData = missionDoc.data();
    const mission: MissionClient = {
      id: missionDoc.id,
      title: missionData.title,
      description: missionData.description,
      location: missionData.location,
      startDate: missionData.startDate?.toDate() || null,
      endDate: missionData.endDate?.toDate() || null,
      maxVolunteers: missionData.maxVolunteers,
      volunteers: missionData.volunteers || [],
      responsibles: missionData.responsibles || [],
      pendingResponsibles: missionData.pendingResponsibles || [],
      status: missionData.status,
      type: missionData.type,
      isUrgent: missionData.isUrgent || false,
      isRecurrent: missionData.isRecurrent || false,
      createdBy: missionData.createdBy,
      createdAt: missionData.createdAt?.toDate() || new Date(),
      updatedAt: missionData.updatedAt?.toDate() || null,
    };

    // Envoyer l'email
    console.log('📤 Tentative d\'envoi de l\'email...');
    const result = await sendMissionRegistrationEmail(volunteer, mission);

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

