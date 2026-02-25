'use client';

import { use } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, Boxes, Package, Truck, Wrench } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { ApiResponse } from '@/types/api.types';
import type { GetMaterialSummaryResponse } from '@/types/material/material.types';

interface ProjectMaterialMainProps {
  promiseData: Promise<ApiResponse<GetMaterialSummaryResponse>>;
  projectId: number;
}

const KPI_CARDS = [
  {
    key: 'unitKindCount' as const,
    title: '총 품목 수',
    unit: '종',
    desc: '프로젝트에 필요한 자재 종류',
    Icon: Boxes,
    accent: '--mat-kpi-1',
    bg: '--mat-kpi-1-bg',
  },
  {
    key: 'totalCount' as const,
    title: '총 필요 수량',
    unit: '개',
    desc: '프로젝트에 필요한 전체 자재 수량',
    Icon: Package,
    accent: '--mat-kpi-2',
    bg: '--mat-kpi-2-bg',
  },
  {
    key: 'inboundCount' as const,
    title: '입고된 수량',
    unit: '개',
    desc: '현재까지 입고 완료된 자재',
    Icon: Truck,
    accent: '--mat-kpi-3',
    bg: '--mat-kpi-3-bg',
  },
  {
    key: 'usedCount' as const,
    title: '사용된 수량',
    unit: '개',
    desc: '생산에 투입되어 사용된 자재',
    Icon: Wrench,
    accent: '--mat-kpi-4',
    bg: '--mat-kpi-4-bg',
  },
] as const;

export default function ProjectMaterialMain({ promiseData }: ProjectMaterialMainProps) {
  const summary = use(promiseData).data!;

  const remainingInStock = summary.inboundCount - summary.usedCount;
  const isOverUsed = remainingInStock < 0;

  const usageChartData = [
    { name: '사용된 자재', value: summary.usedCount },
    { name: '재고 자재', value: remainingInStock > 0 ? remainingInStock : 0 },
  ];

  const quantityChartData = [
    { name: '총 필요', 수량: summary.totalCount },
    { name: '총 입고', 수량: summary.inboundCount },
    { name: '총 사용', 수량: summary.usedCount },
  ];

  const chartTooltipStyle: React.CSSProperties = {
    background: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    color: 'var(--popover-foreground)',
    fontSize: '12px',
  };

  const kpiValues: Record<string, number> = {
    unitKindCount: summary.unitKindCount,
    totalCount: summary.totalCount,
    inboundCount: summary.inboundCount,
    usedCount: summary.usedCount,
  };

  return (
    <div className="flex flex-col gap-5">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {KPI_CARDS.map((card) => {
          const value = kpiValues[card.key];
          const showInboundWarn = isOverUsed && card.key === 'inboundCount';
          const showUsedWarn = isOverUsed && card.key === 'usedCount';

          return (
            <Card
              key={card.key}
              className="gap-0 py-0 transition-shadow hover:shadow-md"
              style={{ borderTop: `3px solid var(${card.accent})` }}
            >
              <div className="flex flex-col gap-3 px-5 pb-5 pt-4">
                {/* 제목 + 아이콘 */}
                <div className="flex items-center justify-between gap-2">
                  <p className="text-muted-foreground min-w-0 flex-1 truncate text-[11px] font-semibold uppercase tracking-widest">
                    {card.title}
                  </p>
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `var(${card.bg})` }}
                  >
                    <card.Icon
                      className="h-4 w-4"
                      style={{ color: `var(${card.accent})` }}
                    />
                  </div>
                </div>

                {/* 수치 */}
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight tabular-nums">
                    {value.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">{card.unit}</span>
                </div>

                {/* 설명 또는 경고 뱃지 */}
                <div className="min-h-[1.25rem]">
                  {showInboundWarn && (
                    <Badge variant="destructive" className="h-5 gap-1 px-1.5 text-[10px]">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      재고 사용 의심
                    </Badge>
                  )}
                  {showUsedWarn && (
                    <Badge variant="destructive" className="h-5 gap-1 px-1.5 text-[10px]">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      초과 {Math.abs(remainingInStock).toLocaleString()}개
                    </Badge>
                  )}
                  {!showInboundWarn && !showUsedWarn && (
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <p className="text-muted-foreground cursor-default truncate text-xs">
                          {card.desc}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{card.desc}</p>
                      </TooltipContent>
                    </UITooltip>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 전체 입고 진행률 */}
      <Card className="gap-0 py-0">
        <CardHeader className="pt-5 pb-0">
          <div className="col-span-full flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-base leading-none font-semibold">전체 입고 진행률</p>
              <p className="text-muted-foreground mt-1.5 text-sm">
                필요한 모든 자재 중 현재까지 입고된 비율입니다.
              </p>
            </div>
            <span
              className="shrink-0 text-2xl font-bold tabular-nums"
              style={{ color: 'var(--mat-kpi-3)' }}
            >
              {summary.inboundPercent.toFixed(1)}%
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 pb-5">
          <Progress value={summary.inboundPercent} className="h-2" />
          <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
            <span>0</span>
            <span className="font-medium">
              {summary.inboundCount.toLocaleString()} / {summary.totalCount.toLocaleString()} 개
              입고
            </span>
            <span>{summary.totalCount.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* 수량 비교 바 차트 */}
        <Card className="col-span-1 gap-0 py-0 lg:col-span-4">
          <CardHeader className="pt-5 pb-0">
            <p className="text-base leading-none font-semibold">수량 비교</p>
            <p className="text-muted-foreground text-sm">필요, 입고, 사용 수량을 비교합니다.</p>
          </CardHeader>
          <CardContent className="pt-4 pb-5">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={quantityChartData}
                  margin={{ top: 8, right: 12, left: -10, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                    tickFormatter={(v) => v.toLocaleString()}
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={chartTooltipStyle} />
                  <Bar dataKey="수량" radius={[5, 5, 0, 0]}>
                    {quantityChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`var(--mat-chart-${index + 1})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 입고 자재 사용 현황 파이 차트 */}
        <Card className="col-span-1 gap-0 py-0 lg:col-span-3">
          <CardHeader className="pt-5 pb-0">
            <p className="text-base leading-none font-semibold">입고 자재 사용 현황</p>
            <p className="text-muted-foreground text-sm">입고된 자재 중 사용된 비율입니다.</p>
          </CardHeader>
          <CardContent className="pt-4 pb-5">
            <div className="h-[248px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Pie
                    data={usageChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    <Cell fill="var(--mat-chart-1)" />
                    <Cell fill="var(--mat-pie-empty)" />
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: '22px', fontWeight: 700, fill: 'var(--foreground)' }}
                  >
                    {summary.inboundCount > 0
                      ? `${((summary.usedCount / summary.inboundCount) * 100).toFixed(0)}%`
                      : '0%'}
                  </text>
                  <text
                    x="50%"
                    y="50%"
                    dy={24}
                    textAnchor="middle"
                    style={{ fontSize: '11px', fill: 'var(--muted-foreground)' }}
                  >
                    사용됨
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* 커스텀 범례 */}
            <div className="mt-3 flex items-center justify-center gap-5">
              {usageChartData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{
                      background: idx === 0 ? 'var(--mat-chart-1)' : 'var(--mat-pie-empty)',
                    }}
                  />
                  <span className="text-muted-foreground text-xs">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
