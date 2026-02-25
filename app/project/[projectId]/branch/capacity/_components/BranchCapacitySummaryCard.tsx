import { memo } from 'react';
import Image from 'next/image';
import { ChevronRight, GitBranch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { GetProjectBranchCapacityResponse } from '@/types/project/project.types';

// ── 색상 정의 (한 곳에서 관리) ──────────────────────────────────────────────────
export const BRANCH_BAR_COLORS = {
  completed: { bg: 'bg-blue-500', hex: '#3b82f6', label: '완료' },
  remaining: { bg: 'bg-amber-400', hex: '#fbbf24', label: '잔여' },
} as const;

// ── 범례 컴포넌트 ─────────────────────────────────────────────────────────────
export function BranchBarLegend() {
  return (
    <div className="flex items-center gap-3">
      {Object.values(BRANCH_BAR_COLORS).map((c) => (
        <div key={c.label} className="flex items-center gap-1">
          <span
            className="inline-block h-2 w-2.5 rounded-sm"
            style={{ background: c.hex }}
          />
          <span className="text-muted-foreground text-[10px]">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── 카드 ─────────────────────────────────────────────────────────────────────
interface BranchCapacitySummaryCardProps {
  branch: GetProjectBranchCapacityResponse;
  onClick: () => void;
}

export const BranchCapacitySummaryCard = memo(function BranchCapacitySummaryCard({
  branch,
  onClick,
}: BranchCapacitySummaryCardProps) {
  const isCompleted = branch.remainingQuantity === 0;

  const completedPct =
    branch.totalQuantity > 0
      ? (branch.completedQuantity / branch.totalQuantity) * 100
      : 0;
  const remainingPct =
    branch.totalQuantity > 0
      ? (branch.remainingQuantity / branch.totalQuantity) * 100
      : 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex cursor-pointer items-center gap-4 rounded-lg border bg-card px-4 py-3.5 transition-shadow hover:shadow-md',
        isCompleted && 'border-green-500/40'
      )}
    >
      {/* ── 이미지 썸네일 ── */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
        {branch.imageUrl ? (
          <Image src={branch.imageUrl} alt={branch.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <GitBranch className="text-muted-foreground/40 size-6" />
          </div>
        )}
      </div>

      {/* ── 시리얼 + 이름 + 바 그래프 ── */}
      <div className="min-w-0 flex-1">
        {/* 시리얼 · 완료 배지 */}
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="shrink-0 text-[11px]">
            {branch.serial}
          </Badge>
          {isCompleted && (
            <Badge className="shrink-0 border-green-500 bg-green-500/10 text-green-600 dark:text-green-400">
              완료
            </Badge>
          )}
        </div>

        {/* 이름 */}
        <p className="text-sm font-semibold leading-snug">{branch.name}</p>

        {/* 범례 */}
        <div className="mt-1.5">
          <BranchBarLegend />
        </div>

        {/* 바 그래프 (hover → 툴팁) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-1 flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${completedPct}%` }}
              />
              <div
                className="h-full bg-amber-400 transition-all"
                style={{ width: `${remainingPct}%` }}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="space-y-0.5">
            <p>
              <span
                className="mr-1 inline-block h-2 w-2 rounded-sm"
                style={{ background: BRANCH_BAR_COLORS.completed.hex }}
              />
              완료 수량: <strong>{branch.completedQuantity.toLocaleString()}</strong>개
            </p>
            <p>
              <span
                className="mr-1 inline-block h-2 w-2 rounded-sm"
                style={{ background: BRANCH_BAR_COLORS.remaining.hex }}
              />
              잔여 수량: <strong>{branch.remainingQuantity.toLocaleString()}</strong>개
            </p>
            <p className="border-t border-white/20 pt-0.5">
              총 수량: <strong>{branch.totalQuantity.toLocaleString()}</strong>개
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* ── 실질 생산 가능 강조 박스 ── */}
      <div
        className={cn(
          'shrink-0 rounded-xl px-5 py-3 text-center',
          branch.effectiveCapacity <= 0 ? 'bg-destructive/10' : 'bg-blue-500/10'
        )}
      >
        <p className="text-muted-foreground mb-1 whitespace-nowrap text-[10px] font-medium uppercase tracking-wide">
          실질 생산 가능
        </p>
        <p
          className={cn(
            'text-3xl font-bold tabular-nums leading-none',
            branch.effectiveCapacity <= 0
              ? 'text-destructive'
              : 'text-blue-600 dark:text-blue-400'
          )}
        >
          {branch.effectiveCapacity.toLocaleString()}
        </p>
        <p className="text-muted-foreground mt-0.5 text-[11px]">개</p>
      </div>

      {/* ── 클릭 유도 화살표 ── */}
      <ChevronRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </div>
  );
});
