'use client';

import { use } from 'react';
import { FileText, User2, MapPin, Package, AlertTriangle, ClipboardList } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import ReportActionDialog from './ReportActionDialog';
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
  const { user } = useAuthStore();

  if (!report) return null;

  console.log(user);
  const canReview = user?.role === 'STAFF' || user?.role === 'ADMIN';
  const isPending = report.status === 'PENDING';

  return (
    <div className="animate-in fade-in mx-auto space-y-2 duration-500">
      <div className="flex items-center justify-between pb-2">
        <h1 className="flex items-center gap-2 text-xl font-black tracking-tight">
          <FileText className="h-5 w-5" /> REPORT DETAIL
        </h1>
        {canReview && isPending && (
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Review Action
            </span>
            <ReportActionDialog reportId={reportId} projectId={projectId} />
          </div>
        )}
      </div>

      <div className="space-y-8">
        <WorkReportInfoSection report={report} />

        <div className="space-y-8">
          <StraightReportList reports={report.straightReports} />
          <BranchReportList reports={report.branchReports} />

          {!report.straightReports?.length && !report.branchReports?.length && (
            <div className="py-20 text-center text-sm font-bold tracking-widest text-slate-300 uppercase">
              No Production Data Available
            </div>
          )}
        </div>

        {/* 반려 사유 */}
        {report.status === 'REJECTED' && (
          <div className="flex items-start gap-4 border-l-4 border-rose-500 bg-rose-50 p-8">
            <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-rose-500" />
            <div>
              <p className="mb-1 text-lg font-black text-rose-900">반려 사유</p>
              <p className="font-medium text-rose-800">{report.rejectReason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
