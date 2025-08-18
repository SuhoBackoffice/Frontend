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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      _hasHydrated: false,
      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      logout: () => set({ isLoggedIn: false, user: null }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ _hasHydrated: true });
      },
    }
  )
);
