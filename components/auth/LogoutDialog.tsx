'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth.store';
import { postLogout } from '@/lib/api/auth/auth.api';
import { LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LogoutDialog() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await postLogout();
      logout();
      toast.success(response.message);
      router.push('/');
    } catch {
      toast.error('로그아웃에 실패했습니다.', {
        description: '잠시 후 다시 시도해주시거나, 문제가 지속될 경우 관리자에게 문의해주세요.',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="로그아웃">
          <LogOut className="h-5 w-5 scale-200" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말로 로그아웃 하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            현재 세션이 종료되며, 일부 기능 사용을 위해 다시 로그인해야 할 수 있습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoggingOut}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            로그아웃
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
