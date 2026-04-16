import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@snowboarding/shared';
import {
  auth,
  onAuthStateChanged,
  firebaseSignOut,
  type FirebaseUser,
} from '../services/firebase';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  syncFirebaseUser: (
    firebaseUser: FirebaseUser,
    profile?: {
      name?: string;
      mobilePhone?: string;
      language?: string;
      skillLevel?: string;
      recaptchaToken?: string;
    },
  ) => Promise<void>;
  initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

      logout: async () => {
        await firebaseSignOut();
        set({ user: null, isAuthenticated: false });
      },

      /**
       * After Firebase Auth login, sync the user to the backend and update the store.
       */
      syncFirebaseUser: async (firebaseUser, profile) => {
        try {
          const data = await api.syncUser(firebaseUser.uid, firebaseUser.email || '', {
            name: profile?.name || firebaseUser.displayName || undefined,
            ...profile,
          });
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Failed to sync user with backend:', error);
          // Still set basic info from Firebase even if backend sync fails
          set({
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'STUDENT',
              language: 'zh-TW',
            },
            isAuthenticated: true,
            isLoading: false,
          });
        }
      },

      /**
       * Initialize Firebase Auth state listener.
       * Returns unsubscribe function.
       */
      initAuthListener: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          set({ isLoading: true });
          if (firebaseUser) {
            // User is signed in — sync with backend if not already authenticated locally
            const currentState = get();
            if (
              !currentState.isAuthenticated ||
              currentState.user?.id !== firebaseUser.uid
            ) {
              await get().syncFirebaseUser(firebaseUser);
            } else {
              set({ isLoading: false });
            }
          } else {
            // User is signed out
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        });
        return unsubscribe;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
