'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth.store';
import { getUserInfo } from '@/lib/api/user/user.api';

export function useSyncAuth() {
  const { setUser, logout, setIsSyncing } = useAuthStore();

  useEffect(() => {
    const syncAuth = async () => {
      setIsSyncing(true);
      try {
        const response = await getUserInfo();
        if (response.data) {
          setUser(response.data);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setIsSyncing(false);
      }
    };

    const handleSync = () => {
      syncAuth();
    };

    handleSync();

    window.addEventListener('visibilitychange', handleSync);
    // window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('visibilitychange', handleSync);
      // window.removeEventListener('focus', handleSync);
    };
  }, []);
}
