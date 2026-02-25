import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectStraightDetailLoading() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-28" />
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {[5, 3].map((count, sectionIdx) => (
          <div key={sectionIdx} className="space-y-3">
            <Skeleton className="h-4 w-16" />
            <div className="space-y-2">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border px-4 py-3">
                  <Skeleton className="h-4 w-44 shrink-0" />
                  <Skeleton className="h-2 flex-1 rounded-full" />
                  <Skeleton className="h-4 w-36 shrink-0" />
                  <Skeleton className="h-4 w-4 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
