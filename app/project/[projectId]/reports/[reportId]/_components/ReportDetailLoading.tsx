'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function ReportDetailLoading() {
  return (
    <div className="animate-pulse space-y-4">
      {/* 1. WorkReportInfoSection (헤더 + 프로젝트 정보 통합 카드) */}
      <div className="bg-card overflow-hidden rounded-2xl border shadow-sm">
        {/* 헤더 행 */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
        {/* 프로젝트 정보 행 */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="space-y-3">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-9 w-64" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
      </div>

      {/* 3. 직선/분기 레일 섹션 */}
      {[1, 2].map((section) => (
        <div key={section} className="bg-card space-y-4 rounded-2xl border p-6 shadow-sm">
          {/* 섹션 헤더 */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* 아이템 */}
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-background flex flex-col gap-3 rounded-lg border px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                </div>
                <div className="flex items-end gap-1">
                  <Skeleton className="h-8 w-10" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
