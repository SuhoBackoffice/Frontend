'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { loginAction, LoginFormState } from '@/lib/action/auth.action'; // LoginFormState도 import
import { useAuthStore } from '@/lib/store/auth.store';
import { LogIn, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const initialState: LoginFormState = {
  message: '',
  errors: {},
  formData: { loginId: '', password: '' },
  success: false,
};

export function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const [state, formAction, isPending] = useActionState<LoginFormState, FormData>(
    loginAction,
    initialState
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setLoggedIn(true);
      setIsOpen(false);
      router.push('/');
    }
  }, [state.success, state.message, setLoggedIn, setIsOpen, router]);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} aria-label="로그인">
        <LogIn className="h-5 w-5 scale-150" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>로그인</DialogTitle>
            <DialogDescription>수호테크 홈페이지</DialogDescription>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            {state?.message && (
              <Alert
                variant="destructive"
                className={`mb-6 ${state.errors && Object.keys(state.errors).length > 0 ? 'text-destructive border-destructive/50' : ''}`}
              >
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="loginId">아이디</Label>
              <Input id="loginId" name="loginId" defaultValue={state?.formData?.loginId} />
              {state?.errors?.loginId && (
                <p className="text-destructive text-sm">{state.errors.loginId[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                defaultValue={state?.formData?.password}
              />
              {state?.errors?.password && (
                <p className="text-destructive text-sm">{state.errors.password[0]}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              로그인
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
