'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock,
  Cpu,
  Package,
  PackageX,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getProjectStraightCapacityDetail,
  getProjectStraightCapacityAnalyzeSortTypes,
} from '@/lib/api/project/project.api';
import { cn } from '@/lib/utils';
import type {
  StraightCapacitySortType,
  GetStraightCapacityDetailResponse,
} from '@/types/project/project.types';
import { DialogDescription } from '@radix-ui/react-dialog';

// ── 색상 토큰 ──────────────────────────────────────────────────────────────────
const STAT_COLORS = {
  total: {
    bg: 'bg-sky-500/10 dark:bg-sky-500/15',
    numColor: 'text-sky-700 dark:text-sky-400',
    iconBg: 'bg-sky-500/20 dark:bg-sky-500/25',
    iconColor: 'text-sky-600 dark:text-sky-400',
    Icon: Package,
    label: '생산 목표',
  },
  completed: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    numColor: 'text-emerald-700 dark:text-emerald-400',
    iconBg: 'bg-emerald-500/20 dark:bg-emerald-500/25',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    Icon: CheckCircle2,
    label: '생산 완료',
  },
  remaining: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    numColor: 'text-amber-700 dark:text-amber-400',
    iconBg: 'bg-amber-500/20 dark:bg-amber-500/25',
    iconColor: 'text-amber-600 dark:text-amber-400',
    Icon: Clock,
    label: '잔여 수량',
  },
  capacity: {
    bg: 'bg-violet-500/10 dark:bg-violet-500/15',
    numColor: 'text-violet-700 dark:text-violet-400',
    iconBg: 'bg-violet-500/20 dark:bg-violet-500/25',
    iconColor: 'text-violet-600 dark:text-violet-400',
    Icon: Cpu,
    label: '총 생산 가능',
  },
} as const;

const EFFECTIVE_COLORS = {
  positive: {
    wrap: 'bg-blue-500/10 dark:bg-blue-500/15 border-blue-500/20 dark:border-blue-500/30',
    iconWrap: 'bg-blue-500/20 dark:bg-blue-500/25',
    iconColor: 'text-blue-600 dark:text-blue-400',
    numColor: 'text-blue-600 dark:text-blue-400',
  },
  negative: {
    wrap: 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/20 dark:border-rose-500/30',
    iconWrap: 'bg-rose-500/20 dark:bg-rose-500/25',
    iconColor: 'text-rose-600 dark:text-rose-400',
    numColor: 'text-rose-600 dark:text-rose-400',
  },
} as const;

const TABLE_COLORS = {
  shortageRow: 'bg-rose-500/5 dark:bg-rose-500/10',
  shortageText: 'text-rose-600 dark:text-rose-400',
  availablePositive: 'text-blue-600 dark:text-blue-400',
  availableZero: 'text-rose-600 dark:text-rose-400',
} as const;

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────────
interface StraightCapacityDetailDialogProps {
  projectId: number;
  projectStraightId: number;
  serial: string;
  isOpen: boolean;
  onClose: () => void;
}

export function StraightCapacityDetailDialog({
  projectId,
  projectStraightId,
  serial,
  isOpen,
  onClose,
}: StraightCapacityDetailDialogProps) {
  const [sortTypes, setSortTypes] = useState<StraightCapacitySortType[]>([]);
  const [sort, setSort] = useState<string>('');
  const [dir, setDir] = useState<'ASC' | 'DESC'>('DESC');
  const [onlyShortage, setOnlyShortage] = useState(true);
  const [detail, setDetail] = useState<GetStraightCapacityDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    getProjectStraightCapacityAnalyzeSortTypes().then((res) => {
      if (res.data && res.data.length > 0) {
        setSortTypes(res.data);
        setSort((prev) => prev || res.data![0].sort);
      }
    });
  }, [isOpen]);

  const fetchDetail = useCallback(async () => {
    if (!isOpen || !sort) return;
    setIsLoading(true);
    try {
      const res = await getProjectStraightCapacityDetail({
        projectId,
        projectStraightId,
        sort,
        dir,
        onlyShortage,
      });
      setDetail(res.data ?? null);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, projectId, projectStraightId, sort, dir, onlyShortage]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const effectiveColor =
    detail && detail.effectiveCapacity > 0 ? EFFECTIVE_COLORS.positive : EFFECTIVE_COLORS.negative;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="!flex !max-h-[90vh] !w-[95vw] !max-w-4xl min-w-[600px] !flex-col gap-0 overflow-hidden p-0 sm:!w-[90vw]">
        {/* ── 헤더 (고정) ── */}
        <DialogHeader className="shrink-0 border-b px-6 py-5">
          <DialogTitle className="gap-2">
            <span className="text-2xl font-bold">{serial}</span>
            {detail && (
              <span className="text-muted-foreground mt-1 text-sm">
                {' '}
                {detail.length.toLocaleString()}mm · {detail.isLoopRail ? '루프' : '일반'}
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1 text-sm">
            {detail && <span>현재 직선 레일의 가용 생산 능력 분석입니다.</span>}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 px-6 py-5">
            {/* ── 수치 요약 ── */}
            {isLoading ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            ) : detail ? (
              <div className="space-y-3">
                {/* 4개 보조 수치 */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(
                    [
                      { ...STAT_COLORS.total, value: detail.totalQuantity },
                      { ...STAT_COLORS.completed, value: detail.completedQuantity },
                      { ...STAT_COLORS.remaining, value: detail.remainingQuantity },
                      { ...STAT_COLORS.capacity, value: detail.capacity },
                    ] as const
                  ).map((item) => (
                    <div
                      key={item.label}
                      className={cn('flex items-center gap-3 rounded-xl px-4 py-3', item.bg)}
                    >
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          item.iconBg
                        )}
                      >
                        <item.Icon className={cn('size-4', item.iconColor)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-muted-foreground truncate text-[10px] font-medium tracking-wider uppercase">
                          {item.label}
                        </p>
                        <p
                          className={cn(
                            'text-xl leading-tight font-bold tabular-nums',
                            item.numColor
                          )}
                        >
                          {item.value.toLocaleString()}
                          <span className="text-muted-foreground ml-0.5 text-xs font-normal">
                            개
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 실질 생산 가능 — 핵심 지표 배너 */}
                <div
                  className={cn(
                    'flex items-center justify-between gap-4 rounded-xl border px-6 py-4',
                    effectiveColor.wrap
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                        effectiveColor.iconWrap
                      )}
                    >
                      <TrendingUp className={cn('size-5', effectiveColor.iconColor)} />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        실질 생산 가능
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        BOM 부족 자재를 고려한 실제 생산 가능 수량
                      </p>
                    </div>
                  </div>
                  <p
                    className={cn(
                      'shrink-0 text-5xl leading-none font-bold tabular-nums',
                      effectiveColor.numColor
                    )}
                  >
                    {detail.effectiveCapacity.toLocaleString()}
                    <span className="text-muted-foreground ml-1.5 text-base font-normal">개</span>
                  </p>
                </div>
              </div>
            ) : null}

            {/* ── 제어 바 ── */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={sort} onValueChange={setSort} disabled={sortTypes.length === 0}>
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

              <div className="ml-auto flex items-center gap-2">
                <Checkbox
                  id="only-shortage-straight"
                  checked={onlyShortage}
                  onCheckedChange={(checked) => setOnlyShortage(checked === true)}
                />
                <Label
                  htmlFor="only-shortage-straight"
                  className="cursor-pointer text-sm font-normal whitespace-nowrap"
                >
                  부족 자재만 보기
                </Label>
              </div>
            </div>

            {/* ── BOM 테이블 ── */}
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-full rounded-lg" />
                ))}
              </div>
            ) : !detail || detail.bomShortageList.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-14">
                <PackageX className="text-muted-foreground/50 size-10" />
                <p className="text-muted-foreground text-sm font-medium">
                  {onlyShortage ? '부족 자재가 없습니다.' : 'BOM 데이터가 없습니다.'}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
                          자재 코드
                        </TableHead>
                        <TableHead className="text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
                          품목명
                        </TableHead>
                        <TableHead className="text-right text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
                          단위 수량
                        </TableHead>
                        <TableHead className="text-right text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
                          재고
                        </TableHead>
                        <TableHead className="text-right text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
                          필요
                        </TableHead>
                        <TableHead className="text-right text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
                          부족
                        </TableHead>
                        <TableHead className="text-right text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
                          생산가능
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.bomShortageList.map((item, idx) => (
                        <TableRow
                          key={idx}
                          className={cn(item.isShortage && TABLE_COLORS.shortageRow)}
                        >
                          <TableCell className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                            {item.materialCode}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span className="text-sm font-medium">{item.itemName}</span>
                          </TableCell>
                          <TableCell className="text-right text-sm whitespace-nowrap tabular-nums">
                            {item.unitQuantity.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-sm whitespace-nowrap tabular-nums">
                            {item.stockQuantity.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-sm whitespace-nowrap tabular-nums">
                            {item.requiredQuantity.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <span
                              className={cn(
                                'inline-flex items-center justify-end gap-1 text-sm font-semibold tabular-nums',
                                item.isShortage
                                  ? TABLE_COLORS.shortageText
                                  : 'text-muted-foreground'
                              )}
                            >
                              {item.isShortage && <AlertTriangle className="size-3 shrink-0" />}
                              {item.shortageQuantity.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <span
                              className={cn(
                                'text-sm font-bold tabular-nums',
                                item.availableCapacity > 0
                                  ? TABLE_COLORS.availablePositive
                                  : TABLE_COLORS.availableZero
                              )}
                            >
                              {item.availableCapacity.toLocaleString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
