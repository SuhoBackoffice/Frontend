// ProjectBranchCapacityMain.Loading.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-1 h-4 w-1/2" />
      </CardHeader>
      <CardContent className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        {/* 왼쪽: 이미지 스켈레톤 */}
        <Skeleton className="aspect-square w-full rounded-md" />

        {/* 오른쪽: 차트 및 정보 스켈레톤 */}
        <div className="flex w-full flex-col items-center">
          <Skeleton className="h-48 w-48 rounded-full" />
          <div className="mt-4 w-full space-y-4 text-center">
            <div>
              <Skeleton className="mx-auto mb-1 h-4 w-1/2" />
              <Skeleton className="mx-auto h-8 w-3/4" />
            </div>
            <div>
              <Skeleton className="mx-auto mb-1 h-4 w-1/2" />
              <Skeleton className="mx-auto h-6 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export default function ProjectBranchCapacityMainLoading() {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
