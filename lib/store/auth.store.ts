// lib/store/auth.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfoResponse } from '@/types/user/user.types';

interface AuthState {
  isLoggedIn: boolean;
  user: UserInfoResponse | null;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: UserInfoResponse | null) => void;
  logout: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (isHydrated: boolean) => void;
  isSyncing: boolean;
  setIsSyncing: (isSyncing: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      _hasHydrated: false,
      isSyncing: true,
      setHasHydrated: (isHydrated) => set({ _hasHydrated: isHydrated }),
      setIsSyncing: (isSyncing) => set({ isSyncing }),
      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      logout: () => set({ isLoggedIn: false, user: null }),
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
