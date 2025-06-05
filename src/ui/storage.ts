import type { FocusSession } from './types';

const STORAGE_KEY = 'focusHistory';

export const saveSession = (session: FocusSession) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const history: FocusSession[] = raw ? JSON.parse(raw) : [];
  history.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getSessions = (): FocusSession[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const clearSessions = () => {
  localStorage.removeItem(STORAGE_KEY);
};
