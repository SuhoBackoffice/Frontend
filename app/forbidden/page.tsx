'use client';

import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <ShieldAlert className="text-destructive h-16 w-16" />

      <h1 className="text-2xl font-bold">접근 권한이 없습니다</h1>

      <p className="text-muted-foreground">
        이 페이지를 볼 수 있는 권한이 없습니다.
        <br />
        계정 권한을 확인해 주세요.
      </p>

      <Button onClick={() => router.back()}>이전 페이지로 돌아가기</Button>
    </div>
  );
}
