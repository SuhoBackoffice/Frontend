'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, ShieldCheck, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { updateWorkReportStatusAction } from '@/lib/action/report.action';
import { cn } from '@/lib/utils';

export default function ReportActionDialog({ reportId, projectId }: any) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectMode, setIsRejectMode] = useState(false);

  const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
    if (status === 'REJECTED' && !rejectReason.trim()) {
      toast.error('반려 사유를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const result = await updateWorkReportStatusAction(reportId, { status, rejectReason });
      if (result.success) {
        toast.success(
          status === 'APPROVED' ? '보고서가 승인되었습니다.' : '보고서가 반려되었습니다.'
        );
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      toast.error('처리 중 서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setIsRejectMode(false);
          setRejectReason('');
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="hover:bg-secondary rounded-md border-2 px-6 font-bold transition-all"
        >
          <ShieldCheck className="text-primary mr-2 h-4 w-4" /> 검토 및 처리
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-background max-w-md rounded-xl border p-8 shadow-none">
        <DialogHeader className="mb-6 space-y-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tight">
            보고서 검토 및 처리
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            현재 제출된 업무 보고서를 확인하고 승인 또는 반려를 결정합니다.
          </DialogDescription>
        </DialogHeader>

        {!isRejectMode ? (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className={cn(
                'group flex h-32 flex-col gap-3 rounded-xl border-2 transition-all',
                'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500 hover:bg-emerald-500/10'
              )}
              onClick={() => handleAction('APPROVED')}
              disabled={loading}
            >
              <CheckCircle2 className="h-8 w-8 text-emerald-600 transition-transform group-hover:scale-110 dark:text-emerald-400" />
              <div className="text-center">
                <p className="font-black text-emerald-700 dark:text-emerald-300">승인하기</p>
                <p className="text-[10px] font-bold text-emerald-600/60 uppercase">Approve</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className={cn(
                'group flex h-32 flex-col gap-3 rounded-xl border-2 transition-all',
                'border-rose-500/20 bg-rose-500/5 hover:border-rose-500 hover:bg-rose-500/10'
              )}
              onClick={() => setIsRejectMode(true)}
              disabled={loading}
            >
              <XCircle className="h-8 w-8 text-rose-600 transition-transform group-hover:scale-110 dark:text-rose-400" />
              <div className="text-center">
                <p className="font-black text-rose-700 dark:text-rose-300">반려하기</p>
                <p className="text-[10px] font-bold text-rose-600/60 uppercase">Reject</p>
              </div>
            </Button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
            <div className="space-y-3">
              <label className="text-muted-foreground text-[11px] font-black tracking-widest uppercase">
                반려 사유 (Required)
              </label>
              <Textarea
                placeholder="담당자가 확인할 수 있도록 사유를 구체적으로 작성해 주세요."
                className="border-muted bg-muted/20 min-h-[140px] resize-none rounded-xl border-2 transition-all focus:border-rose-500/50 focus:ring-0"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 rounded-xl font-bold"
                onClick={() => setIsRejectMode(false)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> 뒤로가기
              </Button>
              <Button
                variant="destructive"
                className="flex-[2] rounded-xl font-black tracking-tight"
                onClick={() => handleAction('REJECTED')}
                disabled={loading}
              >
                반려 처리 확정
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
