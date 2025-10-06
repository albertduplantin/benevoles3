import { Timestamp } from 'firebase/firestore';

/**
 * User Roles
 */
export type UserRole = 'volunteer' | 'mission_responsible' | 'admin';

/**
 * Mission Status
 */
export type MissionStatus =
  | 'draft'
  | 'published'
  | 'full'
  | 'cancelled'
  | 'completed';

/**
 * Mission Type
 */
export type MissionType = 'scheduled' | 'ongoing';

/**
 * Volunteer Request Status
 */
export type VolunteerRequestStatus = 'pending' | 'approved' | 'rejected';

/**
 * User Model
 */
export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  consents: {
    dataProcessing: boolean;
    communications: boolean;
    consentDate: Timestamp | Date;
  };
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
  };
}

/**
 * Mission Model
 */
export interface Mission {
  id: string;
  title: string;
  description: string;
  category: string; // Category of the mission
  type: MissionType;
  startDate?: Timestamp | Date; // Optional for ongoing missions
  endDate?: Timestamp | Date; // Optional for ongoing missions
  location: string;
  maxVolunteers: number;
  status: MissionStatus;
  isUrgent: boolean;
  isRecurrent: boolean;
  createdBy: string; // User UID
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  volunteers: string[]; // Array of User UIDs
  responsibles: string[]; // Array of User UIDs
  pendingResponsibles: string[]; // Array of User UIDs with pending requests
}

/**
 * Volunteer Request Model (for becoming mission responsible)
 */
export interface VolunteerRequest {
  id: string;
  missionId: string;
  userId: string;
  status: VolunteerRequestStatus;
  requestedAt: Timestamp | Date;
  processedAt?: Timestamp | Date;
  processedBy?: string; // Admin UID
  message?: string;
}

/**
 * Client-side versions with Date instead of Timestamp
 */
export type UserClient = Omit<User, 'createdAt' | 'updatedAt' | 'consents'> & {
  createdAt: Date;
  updatedAt?: Date;
  consents: {
    dataProcessing: boolean;
    communications: boolean;
    consentDate: Date;
  };
};

export type MissionClient = Omit<
  Mission,
  'startDate' | 'endDate' | 'createdAt' | 'updatedAt'
> & {
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
};

export type VolunteerRequestClient = Omit<
  VolunteerRequest,
  'requestedAt' | 'processedAt'
> & {
  requestedAt: Date;
  processedAt?: Date;
};

