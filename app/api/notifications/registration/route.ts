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

    if (!volunteerId || !missionId) {
      return NextResponse.json(
        { error: 'volunteerId and missionId are required' },
        { status: 400 }
      );
    }

    // Récupérer les données du bénévole
    const volunteer = await getUserById(volunteerId);
    if (!volunteer) {
      return NextResponse.json(
        { error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    // Récupérer les données de la mission
    const missionDoc = await getDoc(doc(db, COLLECTIONS.MISSIONS, missionId));
    if (!missionDoc.exists()) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      );
    }

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
    const result = await sendMissionRegistrationEmail(volunteer, mission);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending registration email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

