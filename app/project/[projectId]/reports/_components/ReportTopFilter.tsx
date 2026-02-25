'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FileStack, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { STATUS_STYLE, StatusType } from '@/lib/constants/status-style';

export default function ReportTopFilter({
  projectId,
  currentStatus,
}: {
  projectId: number;
  currentStatus?: StatusType;
}) {
  const base = `/project/${projectId}/reports`;

  const filters = [
    { label: '전체', value: undefined, icon: FileStack },
    { label: STATUS_STYLE.PENDING.label, value: 'PENDING', icon: Clock },
    { label: STATUS_STYLE.APPROVED.label, value: 'APPROVED', icon: CheckCircle2 },
    { label: STATUS_STYLE.REJECTED.label, value: 'REJECTED', icon: XCircle },
  ];

  return (
    <div className="bg-card scrollbar-hide flex items-center justify-center gap-2 overflow-x-auto rounded-2xl border p-4 shadow-sm">
      {filters.map((f) => {
        const isActive = currentStatus === f.value;
        const style = f.value ? STATUS_STYLE[f.value as StatusType] : null;

        return (
          <Link
            key={f.label}
            href={f.value ? `${base}?status=${f.value}` : base}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all hover:scale-105',
              isActive
                ? style
                  ? `${style.badge} border-transparent text-white shadow-md`
                  : 'bg-foreground text-background border-transparent shadow-md'
                : style
                  ? `${style.surface} ${style.text} border-transparent hover:border-current`
                  : 'text-muted-foreground bg-muted border-transparent hover:bg-muted/70'
            )}
          >
            <f.icon
              className={cn(
                'h-4 w-4',
                isActive ? (style ? 'text-white' : 'text-background') : style ? style.text : 'text-muted-foreground'
              )}
            />
            {f.label}
          </Link>
        );
      })}
    </div>
  );
}
