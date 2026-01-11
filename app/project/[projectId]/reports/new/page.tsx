import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WorkReportComponents from './_components/WorkReportComponents';

type Params = Promise<{ projectId: string }>;

export async function generateMetadata(): Promise<Metadata> {
  return { title: `일일 업무 보고` };
}

export default async function ProjectWorkReportPage({ params }: { params: Params }) {
  const { projectId } = await params;
  const id = Number(projectId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return <WorkReportComponents projectId={id} />;
}
