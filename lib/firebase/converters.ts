import { Timestamp } from 'firebase/firestore';
import {
  User,
  UserClient,
  Mission,
  MissionClient,
  VolunteerRequest,
  VolunteerRequestClient,
} from '@/types';

/**
 * Convert Firestore Timestamps to JavaScript Dates
 */

export function convertUserToClient(user: User): UserClient {
  return {
    ...user,
    createdAt:
      user.createdAt instanceof Timestamp
        ? user.createdAt.toDate()
        : user.createdAt,
    updatedAt:
      user.updatedAt instanceof Timestamp
        ? user.updatedAt.toDate()
        : user.updatedAt,
    consents: {
      ...user.consents,
      consentDate:
        user.consents.consentDate instanceof Timestamp
          ? user.consents.consentDate.toDate()
          : user.consents.consentDate,
    },
  };
}

export function convertMissionToClient(mission: Mission): MissionClient {
  return {
    ...mission,
    startDate:
      mission.startDate instanceof Timestamp
        ? mission.startDate.toDate()
        : mission.startDate,
    endDate:
      mission.endDate instanceof Timestamp
        ? mission.endDate.toDate()
        : mission.endDate,
    createdAt:
      mission.createdAt instanceof Timestamp
        ? mission.createdAt.toDate()
        : mission.createdAt,
    updatedAt:
      mission.updatedAt instanceof Timestamp
        ? mission.updatedAt.toDate()
        : mission.updatedAt,
  };
}

export function convertVolunteerRequestToClient(
  request: VolunteerRequest
): VolunteerRequestClient {
  return {
    ...request,
    requestedAt:
      request.requestedAt instanceof Timestamp
        ? request.requestedAt.toDate()
        : request.requestedAt,
    processedAt:
      request.processedAt instanceof Timestamp
        ? request.processedAt.toDate()
        : request.processedAt,
  };
}

