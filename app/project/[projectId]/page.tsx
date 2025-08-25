import {
  getProjectDetail,
  getProjectStraightDetail,
  getProjectBranchDetail,
} from '@/lib/api/project/project.api';
import { notFound } from 'next/navigation';
import ProjectStraightDetail from './_components/ProjectStraightDetail';
import ProjectBranchDetail from './_components/ProjectBranchDetail';
import ProjectInfoDetailLoading from './_components/ProjectInfoDetail.Loading';
import ProjectStraightDetailLoading from './_components/ProjectStraightDetail.Loading';
import ProjectBranchDetailLoading from './_components/ProjectBranchDetail.Loading';
import { Suspense } from 'react';
import ProjectInfoDetail from './_components/ProjectInfoDetail';
import AuthGuard from '@/components/auth/AuthGuard';

type Params = Promise<{ projectId: string }>;

export async function generateMetadata() {
  return { title: `프로젝트 상세 정보` };
}

export default async function ProjectDetail({ params }: { params: Params }) {
  const { projectId } = await params;
  const id = Number(projectId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  const projectDetailPromise = getProjectDetail({ projectId: id });
  const projectStraightDetailPromise = getProjectStraightDetail({ projectId: id });
  const projectBranchDetailPromise = getProjectBranchDetail({ projectId: id });

  return (
    <AuthGuard allowedRoles={['admin', '관리자', '사용자']}>
      <div className="container mx-auto space-y-6 p-4 md:p-8">
        {/* 섹션 1: 기본 정보 */}
        <Suspense fallback={<ProjectInfoDetailLoading />}>
          <ProjectInfoDetail promiseData={projectDetailPromise} />
        </Suspense>

        {/* 섹션 2: 직선 레일 */}
        <Suspense fallback={<ProjectStraightDetailLoading />}>
          <ProjectStraightDetail promiseData={projectStraightDetailPromise} projectId={id} />
        </Suspense>

        {/* 섹션 3: 분기 레일 */}
        <Suspense fallback={<ProjectBranchDetailLoading />}>
          <ProjectBranchDetail promiseData={projectBranchDetailPromise} />
        </Suspense>
      </div>
    </AuthGuard>
  );
}
