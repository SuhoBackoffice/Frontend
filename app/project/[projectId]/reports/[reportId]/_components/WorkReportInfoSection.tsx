import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { User2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GetWorkReportDetailResponse } from '@/types/work/report.types';

interface Props {
  report: GetWorkReportDetailResponse;
}

export const WorkReportInfoSection = ({ report }: Props) => {
  const statusStyle = {
    PENDING: {
      container: 'bg-amber-500/10 border-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-500',
      label: '승인 대기',
    },
    APPROVED: {
      container: 'bg-emerald-500/10 border-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-600',
      label: '승인 완료',
    },
    REJECTED: {
      container: 'bg-rose-500/10 border-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      badge: 'bg-rose-600',
      label: '반려',
    },
  };

  const style = statusStyle[report.status];

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl border p-6 transition-colors',
        style.container
      )}
    >
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
  );
};
