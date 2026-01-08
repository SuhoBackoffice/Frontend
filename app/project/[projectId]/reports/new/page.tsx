import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

  return (
    <div>test</div>
    // <Suspense fallback={<ProjectMaterialMainLoading />}>
    //   <ProjectMaterialMain promiseData={materialSummary} projectId={id} />
    // </Suspense>
  );
}
