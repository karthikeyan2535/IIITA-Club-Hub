import { Club, Event, ClubMember, EventParticipant, ClubAnnouncement } from "@/types/models";

// Mock data for development - in a real app, this would be fetched from Supabase
const mockClubs: Club[] = [
  {
    id: "1",
    name: "Photography Club",
    description: "Capturing moments and memories around the campus. Learn photography skills and techniques from experienced photographers.",
    vision: "To foster creativity and develop visual storytelling skills among students through the medium of photography.",
    category: "Cultural",
    memberCount: 56,
    eventCount: 2,
    imageUrl: "/lovable-uploads/1f0f78b9-1ab4-4c06-bcd7-77182ba55b56.png",
    leads: ["John Doe", "Jane Smith"],
    ongoingActivities: ["Weekly photo walks", "Monthly photo competitions", "Photography workshops"]
  },
  {
    id: "2",
    name: "Coding Club",
    description: "Enhance your programming skills and participate in hackathons and coding competitions with like-minded tech enthusiasts.",
    vision: "To create a community of coders who collaborate, learn, and build innovative solutions together.",
    category: "Technical",
    memberCount: 87,
    eventCount: 3,
    imageUrl: "/lovable-uploads/aa2e161d-f177-41c6-998b-bfb4cd326b24.png",
    leads: ["Alex Johnson", "Maria Garcia"],
    ongoingActivities: ["Weekly coding challenges", "Open source projects", "Tech talks"]
  },
  {
    id: "3",
    name: "Nirmiti",
    description: "Express your creativity through various forms of visual arts. Join us in painting, sketching, and crafting beautiful artworks.",
    vision: "To provide a platform for artistic expression and promote visual arts in campus life.",
    category: "Cultural",
    memberCount: 45,
    eventCount: 2,
    imageUrl: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3",
    leads: ["Sarah Chen", "Michael Brown"],
    ongoingActivities: ["Art exhibitions", "Craft workshops", "Mural painting projects"]
  },
  {
    id: "4",
    name: "Geneticx",
    description: "IIITA's premier dance club where passion meets rhythm. Learn various dance forms and participate in electrifying performances.",
    vision: "To promote dance as a form of expression and fitness while showcasing diverse dance styles.",
    category: "Cultural",
    memberCount: 62,
    eventCount: 4,
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    leads: ["David Kim", "Priya Patel"],
    ongoingActivities: ["Dance workshops", "Inter-college competitions", "Flash mob events"]
  },
  {
    id: "5",
    name: "Virtuosi",
    description: "Discover the magic of music with IIITA's music club. From classical to contemporary, explore various genres and instruments.",
    vision: "To foster a love for music and provide opportunities for students to showcase their musical talents.",
    category: "Cultural",
    memberCount: 38,
    eventCount: 2,
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    leads: ["Emily Rodriguez", "Raj Sharma"],
    ongoingActivities: ["Band practice sessions", "Open mic nights", "Music theory classes"]
  },
  {
    id: "6",
    name: "Sarasva",
    description: "Dive into the world of literature with IIITA's literature club. Engage in poetry, prose, and creative writing workshops.",
    vision: "To cultivate a passion for literature and provide a platform for creative writing and literary discussions.",
    category: "Cultural",
    memberCount: 42,
    eventCount: 1,
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    leads: ["Sophie Williams", "Amit Kumar"],
    ongoingActivities: ["Book discussions", "Creative writing workshops", "Poetry slams"]
  }
];

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Photography Workshop",
    description: "Learn the fundamentals of photography from professional photographers. This workshop will cover camera basics, composition techniques, and post-processing tips.",
    clubId: "1",
    clubName: "Photography Club",
    date: "Sun, Sep 10",
    time: "2:00 PM - 5:00 PM",
    location: "Lecture Hall 3, IIITA",
    imageUrl: "/lovable-uploads/1f0f78b9-1ab4-4c06-bcd7-77182ba55b56.png",
    rules: [
      "Bring your own camera (DSLR/Mirrorless preferred)",
      "Prior registration required",
      "Limited to 30 participants"
    ],
    eligibility: "Open to all IIITA students",
    maxParticipants: 30,
    registeredParticipants: 18
  },
  {
    id: "2",
    title: "Coding Contest",
    description: "Weekly competitive programming contest to solve algorithmic problems. Test your problem-solving skills and compete with fellow coders.",
    clubId: "2",
    clubName: "Coding Club",
    date: "Thu, Oct 5",
    time: "6:00 PM - 8:00 PM",
    location: "Online (Contest Link will be shared)",
    imageUrl: "/lovable-uploads/aa2e161d-f177-41c6-998b-bfb4cd326b24.png",
    rules: [
      "Individual participation only",
      "No plagiarism",
      "Time limit: 2 hours"
    ],
    eligibility: "Open to all IIITA students with basic programming knowledge",
    maxParticipants: 100,
    registeredParticipants: 45
  },
  {
    id: "3",
    title: "Hackathon 2023",
    description: "A 24-hour coding marathon where teams will build innovative solutions to real-world problems. Showcase your technical skills and creativity.",
    clubId: "2",
    clubName: "Coding Club",
    date: "Sun, Oct 15",
    time: "9:00 AM - 9:00 AM (Next day)",
    location: "Computer Center, IIITA",
    imageUrl: "/lovable-uploads/36e70bac-dc6d-434a-b7d9-032e3ff3704f.png",
    rules: [
      "Team size: 2-4 members",
      "Bring your own laptops",
      "Original work only",
      "Theme will be announced on the day of the event"
    ],
    eligibility: "Open to all undergraduate students",
    maxParticipants: 120,
    registeredParticipants: 80
  },
  {
    id: "4",
    title: "Art Exhibition",
    description: "Annual art exhibition showcasing the best artworks created by Nirmiti members throughout the year.",
    clubId: "3",
    clubName: "Nirmiti",
    date: "Sat, Nov 12",
    time: "10:00 AM - 6:00 PM",
    location: "College Auditorium",
    imageUrl: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3",
    eligibility: "Open to all to attend. Submission requirements for artists available separately.",
    registeredParticipants: 15
  },
  {
    id: "5",
    title: "Dance Competition",
    description: "Annual inter-college dance competition featuring solo and group performances across various dance forms.",
    clubId: "4",
    clubName: "Geneticx",
    date: "Sat, Dec 3",
    time: "5:00 PM - 9:00 PM",
    location: "College Auditorium",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    rules: [
      "Solo performance: 3-5 minutes",
      "Group performance: 5-8 minutes",
      "Props allowed with prior approval",
      "Music track submission required 3 days before event"
    ],
    eligibility: "Open to all college students with valid ID",
    maxParticipants: 50,
    registeredParticipants: 28
  }
];

// Mock club members
const mockClubMembers: Record<string, ClubMember[]> = {
  "1": [
    { id: "1", userId: "u1", name: "John Doe", email: "john@example.com", role: "lead", joinedAt: "2023-01-15" },
    { id: "2", userId: "u2", name: "Jane Smith", email: "jane@example.com", role: "lead", joinedAt: "2023-01-15" },
    { id: "3", userId: "u3", name: "Alex Johnson", email: "alex@example.com", role: "member", joinedAt: "2023-02-20" },
    // More members...
  ],
  // Other clubs...
};

// Mock event participants
const mockEventParticipants: Record<string, EventParticipant[]> = {
  "1": [
    { id: "1", userId: "u3", name: "Alex Johnson", email: "alex@example.com", registeredAt: "2023-08-15", attendance: true },
    { id: "2", userId: "u4", name: "Sara Wilson", email: "sara@example.com", registeredAt: "2023-08-16", attendance: false },
    // More participants...
  ],
  // Other events...
};

// Mock announcements
const mockAnnouncements: Record<string, ClubAnnouncement[]> = {
  "1": [
    { 
      id: "1", 
      title: "Photography Trip Planned", 
      content: "We're organizing a photography trip to the botanical gardens next weekend. Bring your cameras!", 
      createdAt: "2023-08-25", 
      createdBy: "John Doe" 
    },
    { 
      id: "2", 
      title: "New Equipment Available", 
      content: "The club has acquired new lighting equipment for members to use. Contact a lead to borrow.", 
      createdAt: "2023-09-01", 
      createdBy: "Jane Smith" 
    },
  ],
  // Other clubs...
};

// Service functions
export const getClubById = (clubId: string): Promise<Club | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const club = mockClubs.find(club => club.id === clubId) || null;
      resolve(club);
    }, 300);
  });
};

export const getEventById = (eventId: string): Promise<Event | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = mockEvents.find(event => event.id === eventId) || null;
      resolve(event);
    }, 300);
  });
};

export const getClubMembers = (clubId: string): Promise<ClubMember[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockClubMembers[clubId] || []);
    }, 300);
  });
};

export const getEventParticipants = (eventId: string): Promise<EventParticipant[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEventParticipants[eventId] || []);
    }, 300);
  });
};

export const getClubAnnouncements = (clubId: string): Promise<ClubAnnouncement[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAnnouncements[clubId] || []);
    }, 300);
  });
};

export const getClubEvents = (clubId: string): Promise<Event[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const events = mockEvents.filter(event => event.clubId === clubId);
      resolve(events);
    }, 300);
  });
};

// Mock user interactions - in a real app, these would update the database
export const joinClub = (clubId: string, userId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`User ${userId} joined club ${clubId}`);
      resolve(true);
    }, 300);
  });
};

export const leaveClub = (clubId: string, userId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`User ${userId} left club ${clubId}`);
      resolve(true);
    }, 300);
  });
};

export const followClub = (clubId: string, userId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`User ${userId} is now following club ${clubId}`);
      resolve(true);
    }, 300);
  });
};

export const registerForEvent = (eventId: string, userId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`User ${userId} registered for event ${eventId}`);
      resolve(true);
    }, 300);
  });
};

export const unregisterFromEvent = (eventId: string, userId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`User ${userId} unregistered from event ${eventId}`);
      resolve(true);
    }, 300);
  });
};

export const bookmarkEvent = (eventId: string, userId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`User ${userId} bookmarked event ${eventId}`);
      resolve(true);
    }, 300);
  });
};
