'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FileStack, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function ReportTopFilter({ projectId, currentStatus }: any) {
  const base = `/project/${projectId}/reports`;

  const filters = [
    { label: '전체', value: undefined, icon: FileStack },
    { label: '승인 대기', value: 'PENDING', icon: Clock },
    { label: '승인 완료', value: 'APPROVED', icon: CheckCircle2 },
    { label: '반려', value: 'REJECTED', icon: XCircle },
  ];

  return (
    <div className="scrollbar-hide flex items-center justify-center gap-2 overflow-x-auto">
      {filters.map((f) => (
        <Link
          key={f.label}
          href={f.value ? `${base}?status=${f.value}` : base}
          className={cn(
            'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all',
            currentStatus === f.value
              ? 'bg-primary text-primary-foreground border-primary shadow-primary/20 shadow-md'
              : 'text-muted-foreground hover:border-primary/50 hover:text-primary border-slate-200 bg-white'
          )}
        >
          <f.icon className="h-4 w-4" />
          {f.label}
        </Link>
      ))}
    </div>
  );
}
