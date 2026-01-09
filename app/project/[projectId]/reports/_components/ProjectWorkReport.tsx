'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { ApiResponse } from '@/types/api.types';
import { GetProjectWorkReportListResponse } from '@/types/work/report.types';
import ReportListItem from './ReportListItem';

interface ProjectWorkReportProps {
  promiseData: Promise<ApiResponse<GetProjectWorkReportListResponse[]>>;
  projectId: number;
}

export default function ProjectWorkReport({ promiseData, projectId }: ProjectWorkReportProps) {
  const response = use(promiseData);

  if (!response.isSuccess) {
    notFound();
  }

  const reports = response.data || [];

  if (reports.length === 0) {
    return (
      <div className="bg-muted/20 flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center">
        <p className="text-muted-foreground font-medium">해당 조건에 맞는 보고서가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-card overflow-hidden">
      <div className="divide-border divide-y">
        {reports.map((report: any) => (
          <ReportListItem key={report.workReportId} report={report} projectId={projectId} />
        ))}
      </div>
    </div>
  );
}
