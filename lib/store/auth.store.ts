import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginResponse } from '@/types/auth/auth.types';

interface AuthState {
  isLoggedIn: boolean;
  user: LoginResponse | null;
  _hasHydrated: boolean;

  login: (user: LoginResponse) => void;
  logout: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      _hasHydrated: false,

      login: (user) =>
        set({
          isLoggedIn: true,
          user,
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
        }),

      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
