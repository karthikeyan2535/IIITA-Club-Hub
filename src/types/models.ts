
// Club Types
export interface ClubMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'member' | 'lead' | 'organizer';
  joinedAt: string;
}

export interface ClubAnnouncement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  vision?: string;
  memberCount: number;
  eventCount: number;
  imageUrl: string;
  leads?: string[];
  ongoingActivities?: string[];
  followers?: number;
}

// Event Types
export interface EventParticipant {
  id: string;
  userId: string;
  name: string;
  email: string;
  registeredAt: string;
  attendance?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  clubId?: string;
  clubName: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  rules?: string[];
  eligibility?: string;
  maxParticipants?: number;
  registeredParticipants?: number;
  results?: string;
  highlights?: string;
}
