'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth.store';
import { getUserInfo } from '@/lib/api/user/user.api';

export function useSyncAuth() {
  const { setUser, logout, setIsSyncing } = useAuthStore();

  useEffect(() => {
    const syncAuth = async () => {
      setIsSyncing(true); // <-- 추가: 동기화 시작
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
        setIsSyncing(false); // <-- 추가: 동기화 종료 (성공/실패 무관)
      }
    };

    const handleSync = () => {
      syncAuth();
    };

    handleSync();

    window.addEventListener('visibilitychange', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('visibilitychange', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);
}
