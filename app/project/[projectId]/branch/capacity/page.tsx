import AuthGuard from '@/components/auth/AuthGuard';
import { getProjectBranchCapacity } from '@/lib/api/project/project.api';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProjectBranchCapacityMain from './_components/ProjectBranchCapacityMain';
import ProjectBranchCapacityMainLoading from './_components/ProjectBranchCapacityMain.Loading';

type Params = Promise<{ projectId: string }>;

export async function generateMetadata() {
  return { title: `생산 관리 - 분기 레일` };
}

export default async function BranchRailRegister({ params }: { params: Params }) {
  const { projectId } = await params;
  const id = Number(projectId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  const projectBranchCapacity = getProjectBranchCapacity({ projectId: id });

  return (
    <AuthGuard allowedRoles={['admin', '관리자', '직원']}>
      <Suspense fallback={<ProjectBranchCapacityMainLoading />}>
        <ProjectBranchCapacityMain promiseData={projectBranchCapacity} projectId={id} />
      </Suspense>
    </AuthGuard>
  );
}
