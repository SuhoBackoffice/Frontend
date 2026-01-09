'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function ReportDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-12 pb-20 duration-700">
      {/* 1. 상단 타이틀 바 스켈레톤 */}
      <div className="border-muted flex items-center justify-between border-b-2 pb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>

      <div className="space-y-20">
        {/* 2. WorkReportInfoSection 스켈레톤 */}
        <div className="relative space-y-10 pb-10">
          {/* 상태 표시 영역 (우측 상단) */}
          <div className="absolute top-0 right-0 flex flex-col items-end gap-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-14 w-32" />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-72" /> {/* 프로젝트명 */}
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <Skeleton className="border-muted h-3 w-32 border-b pb-2" />
            <div className="space-y-2 py-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        </div>

        {/* 3. Production Lists 스켈레톤 (직선/분기 공통) */}
        <div className="space-y-16">
          {[1, 2].map((section) => (
            <div key={section} className="space-y-6">
              {/* 섹션 헤더 */}
              <div className="border-muted flex items-center gap-3 border-l-4 pl-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              {/* 리스트 아이템들 */}
              <div className="space-y-1">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="border-muted flex flex-col justify-between border-b py-6 md:flex-row md:items-center"
                  >
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-32" /> {/* 시리얼 네임 */}
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-end gap-1 md:mt-0">
                      <Skeleton className="h-10 w-12" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
