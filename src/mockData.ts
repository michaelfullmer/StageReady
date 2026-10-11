import { Gig } from './types';

export const getMockGigs = (city: string): Gig[] => {
  if (!city) return [];
  
  const venues = [
    "The Blue Note", "Jazz Corner", "Acoustic Attic", "The Underground",
    "Neon Lounge", "Harmony Hall", "The Soundbox", "Melody Garden"
  ];
  
  const types: ('Open Mic' | 'Live Set' | 'Audition')[] = ['Open Mic', 'Live Set', 'Audition'];
  
  const descriptions = [
    `A great spot for newcomers in ${city} to test their material.`,
    `Looking for high-energy performers in ${city} for our weekend slot.`,
    `Seeking a lead vocalist for an upcoming production right here in ${city}.`,
    `Intimate setting for acoustic singer-songwriters visiting ${city}.`,
    `Late night jazz session in ${city}, all instruments welcome.`,
    `Monthly showcase of local independent talent from across ${city}.`,
    `Competitive audition for a touring cover band based in ${city}.`,
    `Relaxed atmosphere with a supportive ${city} crowd.`
  ];

  const dates = [
    "Mar 15, 2026", "Mar 18, 2026", "Mar 20, 2026", "Mar 22, 2026",
    "Mar 25, 2026", "Mar 28, 2026", "Apr 01, 2026", "Apr 05, 2026"
  ];

  return Array.from({ length: 8 }).map((_, i) => ({
    id: `gig-${i}`,
    venue: venues[i],
    type: types[i % 3],
    date: dates[i],
    description: descriptions[i],
    isInterested: false
  }));
};
