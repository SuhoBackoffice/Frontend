import { getProjectWorkReportList } from '@/lib/api/work/report.api';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProjectWorkReport from './_components/ProjectWorkReport';
import ProjectWorkReportLoading from './_components/ProjectWorkReportLoading';
import ReportTopFilter from './_components/ReportTopFilter';

type Params = Promise<{ projectId: string }>;
type SearchParams = Promise<{ status?: string }>;

export async function generateMetadata() {
  return { title: `일일 보고서 목록 조회` };
}

export default async function ProjectReportsPage({ params, searchParams }: any) {
  const { projectId } = await params;
  const { status } = await searchParams;
  const id = Number(projectId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  const currentStatus = (
    ['PENDING', 'APPROVED', 'REJECTED'].includes(status as string) ? status : undefined
  ) as any;

  const workReportListPromise = getProjectWorkReportList({
    projectId: id,
    status: currentStatus,
  }).catch((err) => {
    if (err.status === 404 || err.status === 400) {
      notFound();
    }
    throw err;
  });

  return (
    <div className="mx-auto space-y-2">
      {/* 1. 상단 수평 필터 */}
      <ReportTopFilter projectId={id} currentStatus={currentStatus} />

      {/* 2. 보고서 피드 리스트 */}
      <Suspense fallback={<ProjectWorkReportLoading />}>
        <ProjectWorkReport promiseData={workReportListPromise} projectId={id} />
      </Suspense>
    </div>
  );
}
