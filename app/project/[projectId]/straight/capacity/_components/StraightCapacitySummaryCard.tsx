import { memo } from 'react';
import { ChevronRight, Ruler } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { GetProjectStraightCapacityResponse } from '@/types/project/project.types';

// ── 색상 정의 ──────────────────────────────────────────────────────────────────
export const STRAIGHT_BAR_COLORS = {
  completed: { bg: 'bg-blue-500', hex: '#3b82f6', label: '완료' },
  remaining: { bg: 'bg-amber-400', hex: '#fbbf24', label: '잔여' },
} as const;

// ── 범례 컴포넌트 ──────────────────────────────────────────────────────────────
export function StraightBarLegend() {
  return (
    <div className="flex items-center gap-3">
      {Object.values(STRAIGHT_BAR_COLORS).map((c) => (
        <div key={c.label} className="flex items-center gap-1">
          <span className="inline-block h-2 w-2.5 rounded-sm" style={{ background: c.hex }} />
          <span className="text-muted-foreground text-[10px]">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── 카드 ───────────────────────────────────────────────────────────────────────
interface StraightCapacitySummaryCardProps {
  straight: GetProjectStraightCapacityResponse;
  onClick: () => void;
}

export const StraightCapacitySummaryCard = memo(function StraightCapacitySummaryCard({
  straight,
  onClick,
}: StraightCapacitySummaryCardProps) {
  const isCompleted = straight.remainingQuantity === 0;

  const completedPct =
    straight.totalQuantity > 0
      ? (straight.completedQuantity / straight.totalQuantity) * 100
      : 0;
  const remainingPct =
    straight.totalQuantity > 0
      ? (straight.remainingQuantity / straight.totalQuantity) * 100
      : 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex cursor-pointer items-center gap-4 rounded-lg border bg-card px-4 py-3.5 transition-shadow hover:shadow-md',
        isCompleted && 'border-green-500/40'
      )}
    >
      {/* ── 레일 아이콘 ── */}
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
        <Ruler className="text-muted-foreground/40 size-6" />
      </div>

      {/* ── 시리얼 + 길이 + 바 그래프 ── */}
      <div className="min-w-0 flex-1">
        {/* 시리얼 · 완료 배지 */}
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="shrink-0 text-[11px]">
            {straight.serial}
          </Badge>
          <Badge variant="outline" className="shrink-0 text-[11px]">
            {straight.isLoopRail ? '루프' : '일반'}
          </Badge>
          {isCompleted && (
            <Badge className="shrink-0 border-green-500 bg-green-500/10 text-green-600 dark:text-green-400">
              완료
            </Badge>
          )}
        </div>

        {/* 길이 */}
        <p className="text-sm font-semibold leading-snug">{straight.length.toLocaleString()}mm</p>

        {/* 범례 */}
        <div className="mt-1.5">
          <StraightBarLegend />
        </div>

        {/* 바 그래프 */}
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
                style={{ background: STRAIGHT_BAR_COLORS.completed.hex }}
              />
              완료 수량: <strong>{straight.completedQuantity.toLocaleString()}</strong>개
            </p>
            <p>
              <span
                className="mr-1 inline-block h-2 w-2 rounded-sm"
                style={{ background: STRAIGHT_BAR_COLORS.remaining.hex }}
              />
              잔여 수량: <strong>{straight.remainingQuantity.toLocaleString()}</strong>개
            </p>
            <p className="border-t border-white/20 pt-0.5">
              총 수량: <strong>{straight.totalQuantity.toLocaleString()}</strong>개
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* ── 실질 생산 가능 강조 박스 ── */}
      <div
        className={cn(
          'shrink-0 rounded-xl px-5 py-3 text-center',
          straight.effectiveCapacity <= 0 ? 'bg-destructive/10' : 'bg-blue-500/10'
        )}
      >
        <p className="text-muted-foreground mb-1 whitespace-nowrap text-[10px] font-medium uppercase tracking-wide">
          실질 생산 가능
        </p>
        <p
          className={cn(
            'text-3xl font-bold tabular-nums leading-none',
            straight.effectiveCapacity <= 0
              ? 'text-destructive'
              : 'text-blue-600 dark:text-blue-400'
          )}
        >
          {straight.effectiveCapacity.toLocaleString()}
        </p>
        <p className="text-muted-foreground mt-0.5 text-[11px]">개</p>
      </div>

      {/* ── 클릭 유도 화살표 ── */}
      <ChevronRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </div>
  );
});
