export interface VocalSession {
  id: string;
  date: string;
  scores: {
    pitchStability: number;
    toneConsistency: number;
    breathControl: number;
    overall: number;
  };
  tip: string;
}

export type GigType = 'Open Mic' | 'Live Set' | 'Audition';

export interface Gig {
  id: string;
  venue: string;
  type: GigType;
  date: string;
  description: string;
  isInterested: boolean;
}

export interface AppState {
  city: string;
  sessions: VocalSession[];
  interestedGigs: string[]; // IDs of gigs the user is interested in
}
