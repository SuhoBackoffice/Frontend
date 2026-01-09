import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronRight, User2, FileText, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_STYLE, StatusType } from '@/lib/constants/status-style';

export default function ReportListItem({ report, projectId }: any) {
  const style = STATUS_STYLE[report.status as StatusType] || {
    container: 'bg-slate-100 border-slate-200',
    surface: 'bg-slate-50',
    text: 'text-slate-500',
    badge: 'bg-slate-500',
    label: '알 수 없음',
  };

  return (
    <Link
      href={`/project/${projectId}/reports/${report.workReportId}`}
      className="group relative flex items-start gap-8 py-8 transition-all"
    >
      {/* 좌측 날짜 생략 */}
      <div className="flex min-w-[100px] flex-col items-end pt-1">
        <span className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
          {format(new Date(report.workDate), 'yyyy . MM', { locale: ko })}
        </span>
        <span className="text-4xl leading-none font-black tracking-tighter tabular-nums">
          {format(new Date(report.workDate), 'dd')}
        </span>
      </div>

      {/* 중앙 타임라인 점 */}
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            'z-10 h-3 w-3 rounded-full border-2 border-white ring-4 ring-slate-50 transition-transform group-hover:scale-125',
            style.badge
          )}
        />
        <div className="absolute top-3 h-full w-[2px] bg-slate-100 group-last:bg-transparent" />
      </div>

      <div
        className={cn(
          'flex-1 rounded-2xl border p-6 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md',
          style.surface,
          style.container
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-md border px-2 py-0.5 text-[11px] font-black tracking-wider uppercase',
                style.container
              )}
            >
              {style.label}
            </span>
            <div className="flex items-center text-[11px] font-bold text-slate-400">
              <User2 className="mr-1 h-3 w-3" />
              {report.reportUserName}
            </div>
          </div>
          <FileText className={cn('h-4 w-4 transition-colors')} />
        </div>

        <h3 className="mb-2 line-clamp-1 text-lg leading-snug font-extrabold">
          {report.workSummary || '작성된 업무 요약이 없습니다.'}
        </h3>

        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase">
            <CalendarDays className="h-3 w-3" />
            Report ID: #{report.workReportId.toString().padStart(4, '0')}
          </div>
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-bold opacity-0 transition-all group-hover:opacity-100'
            )}
          >
            자세히 보기 <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
