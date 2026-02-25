'use client';

import { useState, use, useTransition, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, X, ChevronRight, ArrowRight, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ApiResponse, ApiError } from '@/types/api.types';
import { ProjectInfoStraightResponse, StraightListItem } from '@/types/project/project.types';
import { getProjectStraightDetail } from '@/lib/api/project/project.api';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface ProjectStraightProps {
  promiseData: Promise<ApiResponse<ProjectInfoStraightResponse>>;
  projectId: number;
}

export default function ProjectStraightDetail({ promiseData, projectId }: ProjectStraightProps) {
  const initialData = use(promiseData).data!;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(initialData);
  const [lengthInput, setLengthInput] = useState('');
  const isFirstRender = useRef(true);

  const debouncedLength = useDebounce(lengthInput, 500);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    startTransition(async () => {
      try {
        const result = await getProjectStraightDetail(projectId, debouncedLength || undefined);
        setData(result.data!);
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.';
        toast.error(message);
      }
    });
  }, [debouncedLength, projectId]);

  const total = data.normalStraightList.length + data.loopStraightList.length;

  return (
    <Card className="!gap-2">
      <CardHeader className="grid grid-cols-[auto_1fr] items-center gap-4">
        {/* 왼쪽 */}
        <div className="flex items-center gap-3">
          <CardTitle className="text-2xl font-bold">직선 레일</CardTitle>
          <Badge variant="secondary" className="text-sm font-medium">
            총 {total}종
          </Badge>
        </div>

        {/* 오른쪽 */}
        <div className="relative w-full">
          <Input
            type="number"
            placeholder="길이(mm) 검색..."
            className="h-9 w-full pr-8"
            value={lengthInput}
            onChange={(e) => setLengthInput(e.target.value)}
          />
          <div className="absolute top-1/2 right-2.5 -translate-y-1/2">
            {isPending ? (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            ) : lengthInput ? (
              <button
                onClick={() => setLengthInput('')}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 일반 레일 */}
        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              일반 레일
            </span>
            <Badge variant="outline" className="text-xs">
              {data.normalStraightList.length}
            </Badge>
          </div>
          {data.normalStraightList.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              등록된 일반 레일이 없습니다.
            </p>
          ) : (
            <div className="divide-border/50 bg-muted/20 divide-y overflow-hidden rounded-lg">
              {data.normalStraightList.map((rail) => (
                <RailItem
                  key={rail.straightRailId}
                  rail={rail}
                  isLoop={false}
                  onClick={() =>
                    router.push(`/project/${projectId}/straight/${rail.straightRailId}`)
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* 루프 레일 */}
        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              루프 레일
            </span>
            <Badge variant="outline" className="text-xs">
              {data.loopStraightList.length}
            </Badge>
          </div>
          {data.loopStraightList.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              등록된 루프 레일이 없습니다.
            </p>
          ) : (
            <div className="divide-border/50 bg-muted/20 divide-y overflow-hidden rounded-lg">
              {data.loopStraightList.map((rail) => (
                <RailItem
                  key={rail.straightRailId}
                  rail={rail}
                  isLoop={true}
                  onClick={() =>
                    router.push(`/project/${projectId}/straight/${rail.straightRailId}`)
                  }
                />
              ))}
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}

interface RailItemProps {
  rail: StraightListItem;
  isLoop: boolean;
  onClick: () => void;
}

function RailItem({ rail, isLoop, onClick }: RailItemProps) {
  const progress = rail.totalQuantity > 0 ? (rail.completedQuantity / rail.totalQuantity) * 100 : 0;
  const isDone = rail.completedQuantity >= rail.totalQuantity && rail.totalQuantity > 0;
  const Icon = isLoop ? RefreshCw : ArrowRight;

  return (
    <button
      onClick={onClick}
      className="group hover:bg-accent/60 flex w-full items-center gap-4 px-4 py-3 text-left transition-colors"
    >
      <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
        <Icon className="h-4 w-4" />
      </div>

      <div className="w-52 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{rail.serial}</span>
          {isLoop && rail.holePosition != null && rail.holePosition > 0 && (
            <span className="text-muted-foreground text-xs">가공: {rail.holePosition}mm</span>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-center gap-3">
        <Progress value={progress} className="h-2 flex-1" />
        <div className="flex w-36 shrink-0 items-baseline gap-1">
          <span className={`text-base font-bold ${isDone ? 'text-primary' : 'text-foreground'}`}>
            {rail.completedQuantity}
          </span>
          <span className="text-muted-foreground text-xs">/ {rail.totalQuantity}개 생산 완료</span>
        </div>
      </div>

      <ChevronRight className="text-muted-foreground group-hover:text-primary h-4 w-4 shrink-0 transition-colors" />
    </button>
  );
}
