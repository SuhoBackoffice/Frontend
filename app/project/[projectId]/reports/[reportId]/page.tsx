import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getWorkReportDetail } from '@/lib/api/work/report.api';
import WorkReportDetailContent from './_components/WorkReportDetailContent';
import ReportDetailLoading from './_components/ReportDetailLoading';

type Params = Promise<{ projectId: string; reportId: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { reportId } = await params;
  return { title: `업무 보고서 #${reportId} 상세` };
}

export default async function ReportDetailPage({ params }: { params: Params }) {
  const { reportId, projectId } = await params;
  const rId = Number(reportId);

  if (!Number.isSafeInteger(rId)) notFound();

  const reportDetailPromise = getWorkReportDetail(rId).catch((err) => {
    if (err.status === 404 || err.status === 400) notFound();
    throw err;
  });

  return (
    <div className="mx-auto space-y-6">
      <Suspense fallback={<ReportDetailLoading />}>
        <WorkReportDetailContent
          promiseData={reportDetailPromise}
          reportId={rId}
          projectId={Number(projectId)}
        />
      </Suspense>
    </div>
  );
}
