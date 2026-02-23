'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ApiResponse } from '@/types/api.types';
import { ProjecInfoDetailResponse } from '@/types/project/project.types';
import { FolderKanban, Tag, MapPin, CalendarDays, CalendarCheck2 } from 'lucide-react';
import { use } from 'react';

interface ProjectDetailProps {
  promiseData: Promise<ApiResponse<ProjecInfoDetailResponse>>;
  projectId: number;
}

export default function ProjectInfoDetail({ promiseData, projectId }: ProjectDetailProps) {
  const data = use(promiseData).data!;

  const stats = [
    { icon: Tag, label: '버전', value: data.version },
    { icon: MapPin, label: '지역', value: data.region },
    { icon: CalendarDays, label: '시작일', value: data.startDate },
    { icon: CalendarCheck2, label: '종료일', value: data.endDate },
  ];

  return (
    <Card className="overflow-hidden border shadow-md">
      {/* 히어로 헤더 */}
      <div className="from-primary to-primary/75 relative overflow-hidden bg-gradient-to-br px-6 py-8">
        {/* 배경 도트 패턴 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.25) 1.5px, transparent 1.5px)`,
            backgroundSize: '18px 18px',
          }}
        />
        {/* 장식 원형 블러 */}
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-sm">
            <FolderKanban className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <Badge className="border-white/30 bg-white/15 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.15em] text-white uppercase hover:bg-white/25">
                PROJECT OVERVIEW
              </Badge>
              <span className="text-xs font-medium text-white/50">#{projectId}</span>
            </div>
            <h1 className="truncate text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {data.name}
            </h1>
          </div>
        </div>
      </div>

      {/* 통계 섹션 */}
      <CardContent className="p-0">
        <Separator />
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }, index) => (
            <div
              key={label}
              className="group hover:bg-muted/40 relative flex flex-col gap-2 px-5 py-4 transition-colors"
            >
              {/* 세로 구분선 (마지막 제외) */}
              {index < stats.length - 1 && (
                <div className="bg-border absolute top-3 right-0 hidden h-[calc(100%-24px)] w-px md:block" />
              )}
              <div className="flex items-center gap-1.5">
                <Icon className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                  {label}
                </span>
              </div>
              <span className="text-foreground text-lg leading-none font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
