import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="animate-fade-in-up">
        <Ghost className="text-muted-foreground mb-4 h-16 w-16" />
        <h1 className="mb-2 text-4xl font-bold">페이지를 찾을 수 없어요</h1>
        <p className="text-muted-foreground mb-6">
          요청하신 페이지가 존재하지 않거나, 이동되었을 수 있어요.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
