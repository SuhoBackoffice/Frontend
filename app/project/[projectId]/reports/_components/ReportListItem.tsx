import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronRight, User2, FileText, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReportListItem({ report, projectId }: any) {
  const statusMap: any = {
    PENDING: { label: '대기', color: 'text-amber-600', dot: 'bg-amber-500' },
    APPROVED: { label: '승인', color: 'text-emerald-600', dot: 'bg-emerald-500' },
    REJECTED: { label: '반려', color: 'text-rose-600', dot: 'bg-rose-500' },
  };

  const currentStatus = statusMap[report.status] || {
    label: '알 수 없음',
    color: 'text-slate-400',
    dot: 'bg-slate-400',
  };

  return (
    <Link
      href={`/project/${projectId}/reports/${report.workReportId}`}
      className="group relative flex items-start gap-8 py-8 transition-all"
    >
      {/* 좌측 날짜 인덱스: 실제 타임라인 느낌 */}
      <div className="flex min-w-[100px] flex-col items-end pt-1">
        <span className="text-primary/60 mb-1 text-[10px] font-black tracking-widest uppercase">
          {format(new Date(report.workDate), 'yyyy . MM', { locale: ko })}
        </span>
        <span className="text-4xl leading-none font-black tracking-tighter text-slate-900 tabular-nums">
          {format(new Date(report.workDate), 'dd')}
        </span>
      </div>

      {/* 중앙 세로 구분선 (타임라인) */}
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            'z-10 h-3 w-3 rounded-full border-2 border-white ring-4 ring-slate-50',
            currentStatus.dot
          )}
        />
        <div className="absolute top-3 h-full w-[2px] bg-slate-100 group-last:bg-transparent" />
      </div>

      {/* 우측 보고서 카드: 종이 서류 느낌 */}
      <div className="group-hover:border-primary/30 flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'rounded border border-current px-2 py-0.5 text-[11px] font-black tracking-wider uppercase',
                currentStatus.color
              )}
            >
              {currentStatus.label}
            </span>
            <div className="flex items-center text-[11px] font-bold text-slate-400">
              <User2 className="mr-1 h-3 w-3" />
              {report.reportUserName}
            </div>
          </div>
          <FileText className="group-hover:text-primary h-4 w-4 text-slate-300 transition-colors" />
        </div>

        <h3 className="mb-2 line-clamp-1 text-lg leading-snug font-extrabold text-slate-800">
          {report.workSummary || '작성된 업무 요약이 없습니다.'}
        </h3>

        <div className="flex items-center justify-between border-t border-slate-50 pt-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase">
            <CalendarDays className="h-3 w-3" />
            Report ID: #{report.workReportId.toString().padStart(4, '0')}
          </div>
          <span className="text-primary flex items-center gap-1 text-xs font-bold opacity-0 transition-all group-hover:opacity-100">
            자세히 보기 <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
