'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { toast } from 'sonner';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[]
) {
  const AuthComponent = (props: P) => {
    const { isLoggedIn, user, _hasHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!_hasHydrated) {
        return;
      }

      if (!isLoggedIn) {
        toast.error('로그인이 필요한 서비스입니다.');
        router.replace('/');
        return;
      }

      if (!user || !allowedRoles.includes(user.role)) {
        toast.error('이 페이지에 접근할 권한이 없습니다.');
        router.back();
        return;
      }
    }, [_hasHydrated, isLoggedIn, user, router]);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
}
