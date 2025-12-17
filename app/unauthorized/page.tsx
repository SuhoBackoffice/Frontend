'use client';

import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <LogIn className="text-muted-foreground h-16 w-16" />

      <h1 className="text-2xl font-bold">로그인이 필요합니다</h1>

      <p className="text-muted-foreground">로그인 후 다시 시도해 주세요.</p>

      <Button onClick={() => router.back()}>돌아가기</Button>
    </div>
  );
}
