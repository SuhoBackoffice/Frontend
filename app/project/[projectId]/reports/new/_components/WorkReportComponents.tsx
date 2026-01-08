'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { getReportableBranchList, getReportableStraightList } from '@/lib/api/work/report.api';
import { createWorkReportAction } from '@/lib/action/report.action';
import RailReportSection from './RailReportSection';

import type {
  GetReportableStraightResponse,
  GetReportableBranchResponse,
  StraightWorkReportRequest,
  BranchWorkReportRequest,
} from '@/types/work/report.types';
import BasicInfoSection from './BasicInfoSection';

export default function WorkReportComponents({ projectId }: { projectId: number }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>(null);

  // 1. 기본 정보 상태
  const [workSummary, setWorkSummary] = useState('');
  const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0]);

  // 2. 가용 레일 목록
  const [availStraights, setAvailStraights] = useState<GetReportableStraightResponse[]>([]);
  const [availBranches, setAvailBranches] = useState<GetReportableBranchResponse[]>([]);

  // 3. 보고서 데이터 리스트
  const [straightReports, setStraightReports] = useState<StraightWorkReportRequest[]>([]);
  const [branchReports, setBranchReports] = useState<BranchWorkReportRequest[]>([]);

  // 초기 가용 목록 데이터 로딩
  useEffect(() => {
    Promise.all([getReportableStraightList(projectId), getReportableBranchList(projectId)]).then(
      ([resS, resB]) => {
        if (resS.isSuccess) setAvailStraights(resS.data!);
        if (resB.isSuccess) setAvailBranches(resB.data!);
      }
    );
  }, [projectId]);

  // 제출 핸들러
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setErrors(null);
    setIsSubmitting(true);

    if (straightReports.length === 0 && branchReports.length === 0) {
      toast.error('직선 레일 혹은 분기 레일 항목을 최소 하나 이상 추가해 주세요.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      workSummary,
      workDate,
      straightReportList: straightReports,
      branchReportList: branchReports,
    };

    try {
      const result = await createWorkReportAction(projectId, payload);

      if (result.success) {
        toast.success('업무 보고가 완료되었습니다.');
        router.push(`/project/${projectId}/reports`);
        router.refresh();
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
    }
  };

  return (
    <div className="animate-in fade-in mx-auto space-y-8 pb-32 duration-500">
      {/* 분리된 기본 정보 섹션 */}
      <BasicInfoSection
        workDate={workDate}
        setWorkDate={setWorkDate}
        workSummary={workSummary}
        setWorkSummary={setWorkSummary}
        errors={errors}
      />

      {/* 직선 레일 보고 섹션 */}
      <RailReportSection
        title="직선 레일 보고"
        type="straight"
        projectId={projectId}
        availableRails={availStraights}
        reports={straightReports}
        setReports={setStraightReports}
        errors={errors}
      />

      {/* 분기 레일 보고 섹션 */}
      <RailReportSection
        title="분기 레일 보고"
        type="branch"
        projectId={projectId}
        availableRails={availBranches}
        reports={branchReports}
        setReports={setBranchReports}
        errors={errors}
      />

      {/* 고정 하단 제출 바 */}
      <div className="sticky bottom-8 z-20 flex justify-end px-4 drop-shadow-lg">
        <Button
          size="lg"
          disabled={isSubmitting}
          className={cn(
            'h-14 px-10 text-lg font-bold shadow-2xl transition-all hover:scale-105 active:scale-95',
            'shadow-primary/20'
          )}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">제출 중...</span>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-6 w-6" />
              보고서 제출하기
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
