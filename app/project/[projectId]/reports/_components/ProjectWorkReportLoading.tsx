import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectWorkReportLoading() {
  return (
    <div className="bg-card overflow-hidden rounded-2xl border shadow-sm">
      <div className="divide-border divide-y px-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-8 py-8">
            {/* 날짜 영역 */}
            <div className="flex min-w-[100px] flex-col items-end gap-1.5 pt-1">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-10 w-10" />
            </div>

            {/* 타임라인 점 */}
            <div className="pt-1">
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>

            {/* 카드 */}
            <div className="flex-1 rounded-2xl border p-6">
              <div className="mb-3 flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="mb-4 h-6 w-3/4" />
              <div className="border-t pt-3">
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
