import type { FocusSession } from './types';

const STORAGE_KEY = 'focusHistory';

export function saveSession(session: FocusSession): void {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));

  // 🔔 Dispatch custom event
  window.dispatchEvent(new Event("sessionsUpdated"));
}

export const getSessions = (): FocusSession[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const clearSessions = () => {
  localStorage.removeItem(STORAGE_KEY);
};
