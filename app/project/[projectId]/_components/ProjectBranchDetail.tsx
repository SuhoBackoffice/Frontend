'use client';

import { useState, use, useTransition, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, X, ChevronRight, GitBranch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ApiResponse, ApiError } from '@/types/api.types';
import { ProjectInfoBranchResponse } from '@/types/project/project.types';
import { getProjectBranchDetail } from '@/lib/api/project/project.api';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface ProjectBranchProps {
  promiseData: Promise<ApiResponse<ProjectInfoBranchResponse[]>>;
  projectId: number;
}

export default function ProjectBranchDetail({ promiseData, projectId }: ProjectBranchProps) {
  const initialData = use(promiseData).data!;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(initialData);
  const [keywordInput, setKeywordInput] = useState('');
  const isFirstRender = useRef(true);

  const debouncedKeyword = useDebounce(keywordInput, 500);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    startTransition(async () => {
      try {
        const result = await getProjectBranchDetail(projectId, debouncedKeyword || undefined);
        setData(result.data!);
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.';
        toast.error(message);
      }
    });
  }, [debouncedKeyword, projectId]);

  return (
    <Card className="!gap-2">
      <CardHeader className="grid grid-cols-[auto_1fr] items-center gap-4">
        {/* 왼쪽 */}
        <div className="flex items-center gap-3">
          <CardTitle className="text-2xl font-bold">분기 레일</CardTitle>
          <Badge variant="secondary" className="text-sm font-medium">
            총 {data.length}종
          </Badge>
        </div>

        {/* 오른쪽 */}
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="키워드 검색..."
            className="h-9 w-full pr-8"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
          <div className="absolute top-1/2 right-2.5 -translate-y-1/2">
            {isPending ? (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            ) : keywordInput ? (
              <button
                onClick={() => setKeywordInput('')}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            등록된 분기 레일이 없습니다.
          </p>
        ) : (
          <div className="divide-border/50 bg-muted/20 divide-y overflow-hidden rounded-lg">
            {data.map((branch) => (
              <BranchItem
                key={branch.projectBranchId}
                branch={branch}
                onClick={() =>
                  router.push(`/project/${projectId}/branch/${branch.projectBranchId}`)
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface BranchItemProps {
  branch: ProjectInfoBranchResponse;
  onClick: () => void;
}

function BranchItem({ branch, onClick }: BranchItemProps) {
  const progress =
    branch.totalQuantity > 0 ? (branch.completedQuantity / branch.totalQuantity) * 100 : 0;
  const isDone = branch.completedQuantity >= branch.totalQuantity && branch.totalQuantity > 0;

  return (
    <button
      onClick={onClick}
      className="group hover:bg-accent/60 flex w-full items-center gap-4 px-4 py-3 text-left transition-colors"
    >
      <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
        <GitBranch className="h-4 w-4" />
      </div>

      <div className="w-52 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{branch.branchSerial}</span>
          <span className="text-muted-foreground text-xs">{branch.branchName}</span>
        </div>
      </div>

      <div className="flex flex-1 items-center gap-3">
        <Progress value={progress} className="h-2 flex-1" />
        <div className="flex w-36 shrink-0 items-baseline gap-1">
          <span className={`text-base font-bold ${isDone ? 'text-primary' : 'text-foreground'}`}>
            {branch.completedQuantity}
          </span>
          <span className="text-muted-foreground text-xs">/ {branch.totalQuantity}개 생산 완료</span>
        </div>
      </div>

      <ChevronRight className="text-muted-foreground group-hover:text-primary h-4 w-4 shrink-0 transition-colors" />
    </button>
  );
}
