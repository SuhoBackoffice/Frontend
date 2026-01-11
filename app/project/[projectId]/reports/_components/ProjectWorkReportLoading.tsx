import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectWorkReportLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-8 md:flex-row md:items-start">
      {/* 1. 사이드바 스켈레톤 (필터 영역) */}
      <aside className="w-full shrink-0 space-y-4 md:w-48">
        <Skeleton className="mb-4 ml-3 h-3 w-20" /> {/* "Status Filter" 텍스트 대용 */}
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </aside>

      {/* 2. 메인 리스트 스켈레톤 */}
      <div className="flex-1">
        <div className="bg-card overflow-hidden rounded-3xl border shadow-sm">
          <div className="divide-border divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-6 p-5">
                {/* 왼쪽 날짜 영역 스켈레톤 */}
                <div className="flex min-w-[80px] flex-col items-center space-y-2 border-r pr-6">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-8 w-10" />
                </div>

                {/* 중간 내용 영역 스켈레톤 */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-12 rounded-md" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                </div>

                {/* 오른쪽 아이콘 영역 */}
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
