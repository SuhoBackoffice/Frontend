import { Loader2, ShieldCheck } from 'lucide-react';

export default function AuthLoadingScreen() {
  return (
    <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <ShieldCheck className="text-primary h-16 w-16" />
        <div className="text-center">
          <h3 className="text-xl font-semibold tracking-tight">안전하게 페이지를 불러오는 중...</h3>
          <p className="text-muted-foreground text-sm">
            접근 권한을 확인하고 있어요. 잠시만 기다려주세요.
          </p>
        </div>
        <Loader2 className="text-muted-foreground mt-4 h-8 w-8 animate-spin" />
      </div>
    </div>
  );
}
