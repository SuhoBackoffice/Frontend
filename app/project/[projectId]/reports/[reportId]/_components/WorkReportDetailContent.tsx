'use client';

import { use } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ApiResponse } from '@/types/api.types';
import { GetWorkReportDetailResponse } from '@/types/work/report.types';
import { WorkReportInfoSection } from './WorkReportInfoSection';
import { StraightReportList } from './StraightReportList';
import { BranchReportList } from './BranchReportList';

interface ProjectWorkReportDetailProps {
  promiseData: Promise<ApiResponse<GetWorkReportDetailResponse>>;
  reportId: number;
  projectId: number;
}

export default function WorkReportDetailContent({
  promiseData,
  reportId,
  projectId,
}: ProjectWorkReportDetailProps) {
  const response = use(promiseData);
  const report = response.data;

  if (!report) return null;

  return (
    <div className="animate-in fade-in mx-auto space-y-4 duration-500">
      <WorkReportInfoSection report={report} reportId={reportId} projectId={projectId} />

      <StraightReportList reports={report.straightReports} />
      <BranchReportList reports={report.branchReports} />

      {!report.straightReports?.length && !report.branchReports?.length && (
        <div className="bg-card flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center shadow-sm">
          <p className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
            No Production Data Available
          </p>
        </div>
      )}

      {/* 반려 사유 */}
      {report.status === 'REJECTED' && (
        <div className="flex items-start gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6">
          <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-rose-500" />
          <div>
            <p className="mb-1 text-lg font-black text-rose-700 dark:text-rose-300">반려 사유</p>
            <p className="font-medium text-rose-600 dark:text-rose-400">{report.rejectReason}</p>
          </div>
        </div>
      )}
    </div>
  );
}
