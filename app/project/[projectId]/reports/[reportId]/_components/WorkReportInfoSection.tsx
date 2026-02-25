'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FileText, User2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GetWorkReportDetailResponse } from '@/types/work/report.types';
import { STATUS_STYLE, StatusType } from '@/lib/constants/status-style';
import { useAuthStore } from '@/lib/store/auth.store';
import ReportActionDialog from './ReportActionDialog';

interface Props {
  report: GetWorkReportDetailResponse;
  reportId: number;
  projectId: number;
}

export const WorkReportInfoSection = ({ report, reportId, projectId }: Props) => {
  const { user } = useAuthStore();

  const style = STATUS_STYLE[report.status as StatusType] || {
    container: 'bg-muted border-border',
    surface: 'bg-muted/50',
    text: 'text-muted-foreground',
    badge: 'bg-muted-foreground',
    label: '알 수 없음',
  };

  const canReview = user?.role === 'STAFF' || user?.role === 'ADMIN';
  const isPending = report.status === 'PENDING';

  return (
    <div
      className={cn(
        'bg-card overflow-hidden rounded-2xl border shadow-sm transition-colors',
        style.surface,
        style.container
      )}
    >
      {/* 상단 헤더 행 */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="flex items-center gap-2 text-xl font-black tracking-tight">
          <FileText className="h-5 w-5" /> REPORT DETAIL
        </h1>
        {canReview && isPending && (
          <div className="flex flex-col items-end gap-1">
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Review Action
            </span>
            <ReportActionDialog reportId={reportId} projectId={projectId} />
          </div>
        )}
      </div>

      {/* 프로젝트 정보 행 */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="space-y-1">
          <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
            Project Info
          </p>
          <h2 className="text-foreground text-3xl font-black">{report.projectName}</h2>

          <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm font-bold">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {report.region}
            </span>
            <span className="flex items-center gap-1.5">
              <User2 className="h-4 w-4" /> {report.reportUserName}
            </span>
            <span className="text-border hidden sm:inline">|</span>
            <span className="whitespace-nowrap">
              {format(new Date(report.workDate), 'yyyy. MM. dd', { locale: ko })}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <span
            className={cn(
              'rounded-full px-4 py-1 text-[11px] font-black text-white shadow-sm',
              style.badge
            )}
          >
            {style.label}
          </span>
          <p
            className={cn(
              'text-[10px] font-extrabold tracking-tight uppercase opacity-80',
              style.text
            )}
          >
            Current Status
          </p>
        </div>
      </div>
    </div>
  );
};
