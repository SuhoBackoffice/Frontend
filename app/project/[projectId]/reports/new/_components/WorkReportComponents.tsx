'use client';

import { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

import { getReportableBranchList, getReportableStraightList } from '@/lib/api/work/report.api';
import { createWorkReportAction } from '@/lib/action/report.action';
import BasicInfoSection from './BasicInfoSection';
import RailReportSection from './RailReportSection';

export default function WorkReportComponents({ projectId }: { projectId: number }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errors, setErrors] = useState<any>(null);

  const [workSummary, setWorkSummary] = useState('');
  const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0]);
  const [availStraights, setAvailStraights] = useState<any[]>([]);
  const [availBranches, setAvailBranches] = useState<any[]>([]);
  const [straightReports, setStraightReports] = useState<any[]>([]);
  const [branchReports, setBranchReports] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([getReportableStraightList(projectId), getReportableBranchList(projectId)]).then(
      ([resS, resB]) => {
        if (resS.isSuccess) setAvailStraights(resS.data!);
        if (resB.isSuccess) setAvailBranches(resB.data!);
      }
    );
  }, [projectId]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setErrors(null);
    setIsSubmitting(true);

    const payload = {
      workSummary,
      workDate,
      straightReportList: straightReports,
      branchReportList: branchReports,
    };

    try {
      const result = await createWorkReportAction(projectId, payload);

      if (result.success) {
        const reportId = result.data!.workReportId;
        console.log(reportId);
        toast.success('업무 보고가 완료되었습니다.');
        router.push(`/project/${projectId}/reports/${reportId}`);
      } else {
        toast.error(result.message || '입력값을 다시 확인해주세요.');
        if (result.errors) {
          setErrors(result.errors);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (e) {
      toast.error('서버와의 통신에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
    }
  };

  const getReportSummary = () => {
    const summary: string[] = [];

    if (straightReports.length > 0) {
      const details = straightReports.map((r) => {
        const info = availStraights.find((a) => a.projectStraightId === r.projectStraightId);
        return `${info?.straightSerial} (${r.projectStraightSerialIdList.length}개)`;
      });
      summary.push(`직선 레일: ${details.join(', ')}`);
    }

    if (branchReports.length > 0) {
      const details = branchReports.map((r) => {
        const info = availBranches.find((a) => a.projectBranchId === r.projectBranchId);
        return `${info?.branchSerial} (${r.projectBranchSerialIdList.length}개)`;
      });
      summary.push(`분기 레일: ${details.join(', ')}`);
    }

    return summary;
  };

  return (
    <div className="animate-in fade-in space-y- mx-auto pb-32 duration-500">
      <BasicInfoSection
        workDate={workDate}
        setWorkDate={setWorkDate}
        workSummary={workSummary}
        setWorkSummary={setWorkSummary}
        errors={errors}
      />

      <RailReportSection
        title="직선 레일 보고"
        type="straight"
        projectId={projectId}
        availableRails={availStraights}
        reports={straightReports}
        setReports={setStraightReports}
        errors={errors}
      />

      <RailReportSection
        title="분기 레일 보고"
        type="branch"
        projectId={projectId}
        availableRails={availBranches}
        reports={branchReports}
        setReports={setBranchReports}
        errors={errors}
      />

      <div className="sticky bottom-8 z-20 flex justify-end px-4 drop-shadow-lg">
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button
              size="lg"
              disabled={
                isSubmitting || (straightReports.length === 0 && branchReports.length === 0)
              }
              className={cn(
                'shadow-primary/20 h-14 px-10 text-lg font-bold shadow-2xl transition-all hover:scale-105 active:scale-95'
              )}
            >
              <CheckCircle2 className="mr-2 h-6 w-6" />
              보고서 제출하기
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold">
                보고서를 제출하시겠습니까?
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="text-muted-foreground space-y-2 text-base">
                  <div className="bg-muted/50 my-4 rounded-xl border border-dashed p-4">
                    <p className="text-foreground mb-2 text-sm font-bold">보고 항목 요약</p>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      {getReportSummary().map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <p>제출 후 관리자의 승인이 필요합니다.</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel className="h-11 rounded-xl font-semibold">취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="bg-primary hover:bg-primary/90 h-11 rounded-xl font-bold"
              >
                확인 및 제출
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
