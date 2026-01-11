import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { User2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GetWorkReportDetailResponse } from '@/types/work/report.types';
import { STATUS_STYLE, StatusType } from '@/lib/constants/status-style';

interface Props {
  report: GetWorkReportDetailResponse;
}

export const WorkReportInfoSection = ({ report }: Props) => {
  const style = STATUS_STYLE[report.status as StatusType] || {
    container: 'bg-slate-100 border-slate-200',
    surface: 'bg-slate-50',
    text: 'text-slate-500',
    badge: 'bg-slate-500',
    label: '알 수 없음',
  };

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
