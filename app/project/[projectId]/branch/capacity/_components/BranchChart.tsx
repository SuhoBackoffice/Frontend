'use client';
import { useState, memo } from 'react';
import { useTheme } from 'next-themes';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from 'recharts';

interface BranchChartProps {
  pieChartData: { name: string; value: number; key: string }[];
}

interface ActiveShapeProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: { name: string; value: number; key: string };
}

const createActiveShape = (textColor: string, textShadow: string) => {
  const BranchChartActiveShape = (props: unknown) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } =
      props as ActiveShapeProps;
    return (
      <g>
        <text
          x={cx}
          y={cy - 12}
          dy={8}
          textAnchor="middle"
          fill={textColor}
          fontSize={12}
          fontWeight="500"
          style={{ textShadow: textShadow }}
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 12}
          dy={8}
          textAnchor="middle"
          fill={textColor}
          fontSize={20}
          fontWeight="bold"
          style={{ textShadow: textShadow }}
        >
          {`${payload.value}개`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{
            filter: `drop-shadow(0 6px 12px rgba(0,0,0,0.4)) drop-shadow(0 0 8px ${fill}80)`,
            stroke: 'hsl(var(--card-foreground))',
            strokeWidth: 2,
          }}
        />
      </g>
    );
  };
  (BranchChartActiveShape as unknown as { displayName?: string }).displayName =
    'BranchChartActiveShape';
  return BranchChartActiveShape;
};

const BranchChartComponent = ({ pieChartData }: BranchChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const textColor = isDark ? '#ffffff' : '#111827';
  const textShadow = isDark
    ? '0 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)'
    : '0 1px 2px rgba(0,0,0,0.25)';

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const onPieEnter = (_: unknown, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="gradCompleted" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="gradProducible" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="gradUnproducible" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="4"
                floodColor="rgba(0,0,0,0.3)"
                floodOpacity="1"
              />
            </filter>
          </defs>
          <Pie
            data={pieChartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={70}
            paddingAngle={4}
            cornerRadius={8}
            startAngle={90}
            endAngle={-270}
            stroke="hsl(var(--card))"
            strokeWidth={3}
            isAnimationActive
            animationDuration={600}
            activeShape={
              activeIndex !== null ? createActiveShape(textColor, textShadow) : undefined
            }
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {pieChartData.map((entry) => {
              const map: Record<string, string> = {
                completed: 'url(#gradCompleted)',
                producible: 'url(#gradProducible)',
                unproducible: 'url(#gradUnproducible)',
              };
              return (
                <Cell key={entry.key} fill={map[entry.key]} style={{ filter: 'url(#shadow)' }} />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BranchChart = memo(BranchChartComponent);
(BranchChart as unknown as { displayName?: string }).displayName = 'BranchChart';
