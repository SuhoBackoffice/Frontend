import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectBranchDetailLoading() {
  return (
    <Card className="!gap-2">
      <CardHeader className="grid grid-cols-[auto_1fr] items-center gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardHeader>
      <CardContent>
        <div className="divide-border/50 bg-muted/20 divide-y overflow-hidden rounded-lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
              <div className="w-52 shrink-0 space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex flex-1 items-center gap-3">
                <Skeleton className="h-2 flex-1" />
                <Skeleton className="h-4 w-28 shrink-0" />
              </div>
              <Skeleton className="h-4 w-4 shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
