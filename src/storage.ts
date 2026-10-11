import { AppState, VocalSession } from './types';

const STORAGE_KEY = 'stageready_state_v2';

const defaultState: AppState = {
  city: '',
  sessions: [],
  interestedGigs: []
};

export const loadState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultState;
  try {
    return JSON.parse(saved);
  } catch {
    return defaultState;
  }
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const addSession = (session: VocalSession) => {
  const state = loadState();
  const newSessions = [session, ...state.sessions].slice(0, 10);
  saveState({ ...state, sessions: newSessions });
};

export const updateCity = (city: string) => {
  const state = loadState();
  saveState({ ...state, city });
};

export const toggleGigInterest = (gigId: string) => {
  const state = loadState();
  const isInterested = state.interestedGigs.includes(gigId);
  const newInterested = isInterested
    ? state.interestedGigs.filter(id => id !== gigId)
    : [...state.interestedGigs, gigId];
  saveState({ ...state, interestedGigs: newInterested });
};
