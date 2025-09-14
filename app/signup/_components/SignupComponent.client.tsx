'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Info, Loader2, Mail, UserPlus } from 'lucide-react';
import { postSignupAction, SignupFormState } from '@/lib/action/user.action';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: SignupFormState = {
  success: false,
  message: '',
};

export default function SignupComponent() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(postSignupAction, initialState);
  const [loginId, setLoginId] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!state) return;

    if (!state.success && state.message) {
      toast.error(state.message);
      if (state.formData) {
        setLoginId(state.formData.loginId ?? '');
        setUsername(state.formData.username ?? '');
      }
    }

    if (state.success && state.message) {
      toast.success(state.message);
      router.push('/');
    }
  }, [state, router]);

  const fe = state?.errors ?? {};

  return (
    <div className="mx-auto max-w-xl py-10">
      <div className="mb-8 text-center">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold tracking-tight">
          <UserPlus className="h-6 w-6" />
          회원가입
        </h1>
      </div>

      <section aria-labelledby="signup-info" className="mb-8">
        <Alert>
          <Info className="h-4 w-4" />

          {/* shadcn Alert 패턴에 맞춰 타이틀/설명 배치 */}
          <AlertTitle id="signup-info">안내</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>기본 권한(일반 사용자)으로 회원가입됩니다.</p>
            <p>관리자 권한이 필요하다면 아래 이메일로 문의해주세요.</p>

            <address className="not-italic">
              <Button
                asChild
                variant="link"
                className="h-auto px-0 font-medium underline-offset-4 hover:underline"
              >
                <a
                  href={
                    'mailto:ksu9801@gmail.com' +
                    '?subject=' +
                    encodeURIComponent('[관리자 권한 요청]') +
                    '&body=' +
                    encodeURIComponent('안녕하세요. 관리자 권한 요청드립니다.\n\n이름: \n사유: ')
                  }
                  aria-label="이메일로 문의하기: ksu9801@gmail.com"
                >
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    ksu9801@gmail.com
                  </span>
                </a>
              </Button>
            </address>
          </AlertDescription>
        </Alert>
      </section>

      <form action={formAction} noValidate className="space-y-6">
        {/* 로그인 아이디 */}
        <div className="space-y-2">
          <Label htmlFor="loginId">로그인 아이디</Label>
          <Input
            id="loginId"
            name="loginId"
            placeholder="아이디"
            autoComplete="username"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            aria-invalid={!!fe.loginId?.length}
            disabled={isPending}
          />
          {fe.loginId?.length ? <p className="text-destructive text-sm">{fe.loginId[0]}</p> : null}
        </div>

        {/* 이름 */}
        <div className="space-y-2">
          <Label htmlFor="username">이름</Label>
          <Input
            id="username"
            name="username"
            placeholder="이름"
            autoComplete="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-invalid={!!fe.username?.length}
            disabled={isPending}
          />
          {fe.username?.length ? (
            <p className="text-destructive text-sm">{fe.username[0]}</p>
          ) : null}
        </div>

        {/* 비밀번호 */}
        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호"
            autoComplete="new-password"
            aria-invalid={!!fe.password?.length}
            disabled={isPending}
          />
          {fe.password?.length ? (
            <p className="text-destructive text-sm">{fe.password[0]}</p>
          ) : null}
        </div>

        {/* 비밀번호 확인 */}
        <div className="space-y-2">
          <Label htmlFor="passwordCheck">비밀번호 확인</Label>
          <Input
            id="passwordCheck"
            name="passwordCheck"
            type="password"
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            aria-invalid={!!fe.passwordCheck?.length}
            disabled={isPending}
          />
          {fe.passwordCheck?.length ? (
            <p className="text-destructive text-sm">{fe.passwordCheck[0]}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          회원가입
        </Button>
      </form>
    </div>
  );
}
