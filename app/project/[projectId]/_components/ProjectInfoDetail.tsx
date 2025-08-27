'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiResponse } from '@/types/api.types';
import { ProjecInfoDetailResponse } from '@/types/project/project.types';
import { use } from 'react';

interface ProjectDetailProps {
  promiseData: Promise<ApiResponse<ProjecInfoDetailResponse>>;
}

export default function ProjectInfoDetail({ promiseData }: ProjectDetailProps) {
  const data = use(promiseData).data!;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">프로젝트 명 : [{data.name}]</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-lg font-medium">버전</p>
            <p className="text-2xl font-semibold">{data.version}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-lg font-medium">지역</p>
            <p className="text-2xl font-semibold">{data.region}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-lg font-medium">시작일</p>
            <p className="text-2xl font-semibold">{data.startDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-lg font-medium">종료일</p>
            <p className="text-2xl font-semibold">{data.endDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
