'use client';

import { Button } from '@/components/ui/button';
import { postLogout } from '@/lib/api/auth/auth.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    logout();
    postLogout().catch();
  }, [logout]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <LogIn className="text-muted-foreground h-16 w-16" />

      <h1 className="text-2xl font-bold">로그인이 필요합니다</h1>
      <p className="text-muted-foreground">세션이 만료되었거나 인증 정보가 올바르지 않습니다.</p>

      <Button onClick={() => router.back()}>돌아가기</Button>
    </div>
  );
}
