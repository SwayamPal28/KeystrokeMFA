import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  token: string | null;
  lastActivity: number;
  setToken: (token: string) => void;
  clearSession: () => void;
  updateActivity: () => void;
}

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      lastActivity: Date.now(),
      setToken: (token) => set({ token, lastActivity: Date.now() }),
      clearSession: () => set({ token: null, lastActivity: Date.now() }),
      updateActivity: () => set({ lastActivity: Date.now() }),
    }),
    {
      name: 'session-storage',
    }
  )
);

// Session timeout checker
setInterval(() => {
  const { lastActivity, token, clearSession } = useSessionStore.getState();
  if (token && Date.now() - lastActivity > TIMEOUT_DURATION) {
    clearSession();
    window.location.href = '/login';
  }
}, 60000); // Check every minute