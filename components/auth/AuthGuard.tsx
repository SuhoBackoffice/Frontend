'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { isLoggedIn, user, _hasHydrated, isSyncing } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated || isSyncing) {
      return;
    }

    if (!isLoggedIn) {
      toast.error('로그인이 필요한 서비스입니다.');
      router.replace('/');
      return;
    }

    if (!user || !allowedRoles.includes(user.role)) {
      toast.error('이 페이지에 접근할 권한이 없습니다.');
      router.replace('/');
      return;
    }
  }, [_hasHydrated, isSyncing, isLoggedIn, user, router, allowedRoles]);

  if (!_hasHydrated || isSyncing) {
    return (
      <div className="container mx-auto space-y-6 p-4 md:p-8">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isLoggedIn && user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-8">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
