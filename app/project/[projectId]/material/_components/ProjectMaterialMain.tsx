'use client';

import { use } from 'react';
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { Boxes, Package, Truck, Wrench } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import type { GetMaterialSummaryResponse } from '@/types/material/material.types';
import type { ApiResponse } from '@/types/api.types';

interface ProjectMaterialMainProps {
  promiseData: Promise<ApiResponse<GetMaterialSummaryResponse>>;
  projectId: number;
}

export default function ProjectMaterialMain({ promiseData }: ProjectMaterialMainProps) {
  const summary = use(promiseData).data!;

  // 재고 계산 및 초과 사용 여부 판단
  const remainingInStock = summary.inboundCount - summary.usedCount;
  const isOverUsed = remainingInStock < 0; // 입고된 수량보다 사용된 수량이 많음

  // 차트 데이터 가공 (이전과 동일)
  const usageChartData = [
    { name: '사용된 자재', value: summary.usedCount },
    { name: '재고 자재', value: remainingInStock > 0 ? remainingInStock : 0 },
  ];
  const USAGE_COLORS = ['#3b82f6', '#e5e7eb']; // blue-500, gray-200

  const quantityChartData = [
    { name: '총 필요', 수량: summary.totalCount },
    { name: '총 입고', 수량: summary.inboundCount },
    { name: '총 사용', 수량: summary.usedCount },
  ];
  const QUANTITY_COLORS = ['#9ca3af', '#3b82f6', '#22c55e']; // gray-400, blue-500, green-500

  return (
    <div className="flex flex-col gap-4">
      {/* 핵심 지표(KPI) 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* ... (총 품목 수 카드 - 변경 없음) ... */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 품목 수</CardTitle>
            <Boxes className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.unitKindCount.toLocaleString()} 종</div>
            <p className="text-muted-foreground text-xs">프로젝트에 필요한 자재 종류</p>
          </CardContent>
        </Card>
        {/* ... (총 필요 수량 카드 - 변경 없음) ... */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 필요 수량</CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalCount.toLocaleString()} 개</div>
            <p className="text-muted-foreground text-xs">프로젝트에 필요한 전체 자재 수량</p>
          </CardContent>
        </Card>

        {/* 입고된 수량 카드 - 초과 사용 경고 표시 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">입고된 수량</CardTitle>
            <Truck className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {' '}
              {/* Badge를 위해 flex 추가 */}
              <div className="text-2xl font-bold">{summary.inboundCount.toLocaleString()} 개</div>
              {isOverUsed && ( // isOverUsed가 true일 때만 Badge 렌더링
                <Badge variant="destructive" className="ml-auto">
                  재고 사용 의심
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs">현재까지 입고 완료된 자재</p>
          </CardContent>
        </Card>

        {/* 사용된 수량 카드 - 초과 사용량 표시 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">사용된 수량</CardTitle>
            <Wrench className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {' '}
              {/* Badge를 위해 flex 추가 */}
              <div className="text-2xl font-bold">{summary.usedCount.toLocaleString()} 개</div>
              {isOverUsed && ( // isOverUsed가 true일 때만 초과 사용량 Badge 렌더링
                <Badge variant="destructive" className="ml-auto">
                  초과: {Math.abs(remainingInStock).toLocaleString()} 개
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs">생산에 투입되어 사용된 자재</p>
          </CardContent>
        </Card>
      </div>

      {/* 전체 입고율 Progress Bar (변경 없음) */}
      <Card>
        <CardHeader>
          <CardTitle>전체 입고 진행률</CardTitle>
          <CardDescription>필요한 모든 자재 중 현재까지 입고된 비율입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={summary.inboundPercent} className="flex-1" />
            <span className="text-lg font-semibold">{summary.inboundPercent.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* 차트 영역 (변경 없음) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>수량 비교</CardTitle>
            <CardDescription>필요, 입고, 사용 수량을 비교합니다.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={quantityChartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
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
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="수량" radius={[4, 4, 0, 0]}>
                  {quantityChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={QUANTITY_COLORS[index % QUANTITY_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>입고 자재 사용 현황</CardTitle>
            <CardDescription>입고된 자재 중 사용된 비율입니다.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '0.5rem',
                  }}
                />
                <Pie
                  data={usageChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {usageChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={USAGE_COLORS[index % USAGE_COLORS.length]} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-xl font-bold"
                >
                  {summary.inboundCount > 0
                    ? `${((summary.usedCount / summary.inboundCount) * 100).toFixed(0)}%`
                    : '0%'}
                </text>
                <text
                  x="50%"
                  y="50%"
                  dy={20}
                  textAnchor="middle"
                  className="fill-muted-foreground text-sm"
                >
                  사용됨
                </text>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
