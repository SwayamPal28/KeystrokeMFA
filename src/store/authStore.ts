import { create } from 'zustand';
import { UserData, KeystrokePattern } from '../types/auth';

interface AuthState {
  users: UserData[];
  currentUser: UserData | null;
  addUser: (userData: UserData) => void;
  addKeystrokePattern: (username: string, pattern: KeystrokePattern) => void;
  getUser: (username: string) => UserData | undefined;
  setCurrentUser: (user: UserData | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  users: [],
  currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'), // Initialize from localStorage
  addUser: (userData) => {
    set((state) => ({
      users: [...state.users, userData],
    }));
  },
  addKeystrokePattern: (username, pattern) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.username === username
          ? {
              ...user,
              keystrokePatterns: [...user.keystrokePatterns, pattern],
            }
          : user
      ),
    }));
  },
  getUser: (username) => {
    return get().users.find((user) => user.username === username);
  },
  setCurrentUser: (user) => {
    set({ currentUser: user });
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user)); // Persist to localStorage
    } else {
      localStorage.removeItem('currentUser'); // Clear storage on logout
    }
  },
}));
