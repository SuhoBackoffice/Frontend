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
    <Card className="overflow-hidden border shadow-sm">
      {/* 헤더 */}
      <div className="px-6 pt-2">
        <div className="flex items-start gap-4">
          {/* 아이콘 */}
          <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
            <FolderKanban className="text-foreground h-6 w-6" />
          </div>

          {/* 텍스트 */}
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="px-2 py-0.5 text-[11px] font-semibold">
                PROJECT OVERVIEW
              </Badge>
              <span className="text-muted-foreground text-xs">#{projectId}</span>
            </div>

            <h1 className="text-foreground truncate text-2xl font-bold tracking-tight">
              {data.name}
            </h1>
          </div>
        </div>
      </div>

      {/* 통계 섹션 */}
      <CardContent className="p-0">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }, index) => (
            <div
              key={label}
              className="group hover:bg-muted/40 relative flex flex-col items-center gap-2 px-5 py-4 text-center transition-colors"
            >
              {/* 세로 구분선 (마지막 제외) */}
              {index < stats.length - 1 && (
                <div className="bg-border absolute top-3 right-0 hidden h-[calc(100%-24px)] w-px border-1 md:block" />
              )}
              <div className="flex items-center gap-1.5">
                <Icon className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                  {label}
                </span>
              </div>
              <span className="text-foreground text-base leading-none font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
