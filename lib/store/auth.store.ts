import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfoResponse } from '@/types/user/user.types';

interface AuthState {
  isLoggedIn: boolean;
  user: UserInfoResponse | null;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: UserInfoResponse | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      logout: () => set({ isLoggedIn: false, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
