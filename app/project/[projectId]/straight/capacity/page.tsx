import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ProjectStraightCapacityMain from './_components/ProjectStraightCapacityMain';
import ProjectStraightCapacityMainLoading from './_components/ProjectStraightCapacityMain.Loading';

type Params = Promise<{ projectId: string }>;

export async function generateMetadata() {
  return { title: `생산 관리 - 직선 레일` };
}

export default async function StraightCapacityPage({ params }: { params: Params }) {
  const { projectId } = await params;
  const id = Number(projectId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return (
    <Suspense fallback={<ProjectStraightCapacityMainLoading />}>
      <ProjectStraightCapacityMain projectId={id} />
    </Suspense>
  );
}
