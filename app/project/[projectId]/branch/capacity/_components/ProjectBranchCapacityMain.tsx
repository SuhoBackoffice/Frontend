'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getProjectBranchCapacity,
  getProjectBranchCapacitySortTypes,
} from '@/lib/api/project/project.api';
import type {
  BranchCapacitySortType,
  GetProjectBranchCapacityResponse,
} from '@/types/project/project.types';
import { BranchCapacitySummaryCard } from './BranchCapacitySummaryCard';
import { BranchCapacityDetailDialog } from './BranchCapacityDetailDialog';

interface ProjectBranchCapacityMainProps {
  projectId: number;
}

export default function ProjectBranchCapacityMain({ projectId }: ProjectBranchCapacityMainProps) {
  const [sortTypes, setSortTypes] = useState<BranchCapacitySortType[]>([]);
  const [sort, setSort] = useState<string>('');
  const [dir, setDir] = useState<'ASC' | 'DESC'>('DESC');
  const [list, setList] = useState<GetProjectBranchCapacityResponse[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProjectBranchCapacitySortTypes().then((res) => {
      if (res.data && res.data.length > 0) {
        setSortTypes(res.data);
        setSort(res.data[0].sort);
      }
    });
  }, []);

  const fetchList = useCallback(async () => {
    if (!sort) return;
    setIsLoading(true);
    try {
      const res = await getProjectBranchCapacity({ projectId, sort, dir });
      setList(res.data ?? []);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, sort, dir]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const selectedBranch =
    selectedBranchId != null
      ? (list.find((b) => b.projectBranchId === selectedBranchId) ?? null)
      : null;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Card 1: 타이틀 + 정렬 컨트롤 ── */}
      <Card className="gap-0 py-0">
        <CardHeader className="px-5 pt-5 pb-3">
          <CardTitle className="text-base font-semibold">분기 레일 생산 현황</CardTitle>
          <CardDescription>
            각 분기별 현재 생산 목표와 완료 수량, 그리고 잔여 수량을 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 px-5 pb-5">
          <Select value={sort} onValueChange={(v) => setSort(v)} disabled={sortTypes.length === 0}>
            <SelectTrigger size="sm" className="w-44">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              {sortTypes.map((st) => (
                <SelectItem key={st.sort} value={st.sort}>
                  {st.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDir((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
            className="gap-1.5 px-3"
          >
            {dir === 'DESC' ? (
              <>
                <ArrowDown className="size-3.5" />
                내림차순
              </>
            ) : (
              <>
                <ArrowUp className="size-3.5" />
                오름차순
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ── Card 2: 아이템 리스트 ── */}
      <Card className="gap-0 py-0">
        <CardContent className="px-2 py-2">
          {!isLoading && list.length === 0 ? (
            <div className="flex h-[50vh] items-center justify-center rounded-lg border border-dashed">
              <p className="text-foreground/80 text-base font-semibold">
                생산 현황 데이터가 없습니다.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {list.map((branch) => (
                <BranchCapacitySummaryCard
                  key={branch.projectBranchId}
                  branch={branch}
                  onClick={() => setSelectedBranchId(branch.projectBranchId)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 상세 분석 다이얼로그 ── */}
      {selectedBranchId != null && (
        <BranchCapacityDetailDialog
          projectId={projectId}
          projectBranchId={selectedBranchId}
          branchName={selectedBranch?.name ?? ''}
          isOpen={selectedBranchId != null}
          onClose={() => setSelectedBranchId(null)}
        />
      )}
    </div>
  );
}
