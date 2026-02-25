import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ProjectBranchCapacityMain from './_components/ProjectBranchCapacityMain';
import ProjectBranchCapacityMainLoading from './_components/ProjectBranchCapacityMain.Loading';

type Params = Promise<{ projectId: string }>;

export async function generateMetadata() {
  return { title: `생산 관리 - 분기 레일` };
}

export default async function BranchCapacityPage({ params }: { params: Params }) {
  const { projectId } = await params;
  const id = Number(projectId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return (
    <Suspense fallback={<ProjectBranchCapacityMainLoading />}>
      <ProjectBranchCapacityMain projectId={id} />
    </Suspense>
  );
}
