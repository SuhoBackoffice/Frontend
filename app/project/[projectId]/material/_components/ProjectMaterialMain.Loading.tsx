import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectMaterialMainLoading() {
  return (
    <div className="flex flex-col gap-5">
      {/* KPI 카드 스켈레톤 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="gap-0 py-0">
            <div className="flex flex-col gap-3 px-5 pb-5 pt-4">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-3 w-32" />
            </div>
          </Card>
        ))}
      </div>

      {/* 진행률 카드 스켈레톤 */}
      <Card className="gap-0 py-0">
        <CardHeader className="pt-5 pb-0">
          <div className="col-span-full flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-52" />
            </div>
            <Skeleton className="h-7 w-14 shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="pt-4 pb-5">
          <Skeleton className="h-2 w-full" />
          <div className="mt-2 flex items-center justify-between">
            <Skeleton className="h-3 w-4" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-4" />
          </div>
        </CardContent>
      </Card>

      {/* 차트 스켈레톤 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 gap-0 py-0 lg:col-span-4">
          <CardHeader className="pt-5 pb-0">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-44" />
          </CardHeader>
          <CardContent className="pt-4 pb-5">
            <Skeleton className="h-[280px] w-full" />
          </CardContent>
        </Card>

        <Card className="col-span-1 gap-0 py-0 lg:col-span-3">
          <CardHeader className="pt-5 pb-0">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent className="pt-4 pb-5">
            <Skeleton className="h-[248px] w-full" />
            <div className="mt-3 flex items-center justify-center gap-5">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-2.5 w-2.5 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-2.5 w-2.5 rounded-full" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
