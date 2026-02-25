import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3.5">
      {/* 아이콘 */}
      <Skeleton className="h-14 w-14 shrink-0 rounded-md" />

      {/* 시리얼 + 길이 + 범례 + 바 */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32" />
        {/* 범례 스켈레톤 */}
        <div className="flex gap-3">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-10" />
        </div>
        {/* 바 스켈레톤 */}
        <Skeleton className="h-2.5 w-full rounded-full" />
      </div>

      {/* 생산 가능 강조 박스 */}
      <div className="shrink-0 rounded-xl bg-muted/40 px-5 py-3 text-center">
        <Skeleton className="mx-auto mb-1 h-3 w-20" />
        <Skeleton className="mx-auto h-9 w-12" />
        <Skeleton className="mx-auto mt-0.5 h-3 w-4" />
      </div>

      {/* 화살표 */}
      <Skeleton className="size-4 shrink-0 rounded" />
    </div>
  );
}

export default function ProjectStraightCapacityMainLoading() {
  return (
    <div className="flex flex-col gap-4">
      {/* Card 1 스켈레톤 */}
      <Card className="gap-0 py-0">
        <CardContent className="flex items-center justify-between gap-3 px-5 py-4">
          <Skeleton className="h-5 w-44" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-44 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Card 2 스켈레톤 */}
      <Card className="gap-0 py-0">
        <CardContent className="px-2 py-2">
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
