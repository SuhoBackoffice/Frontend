import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectMaterialMain from './_components/ProjectMaterialMain';
import { getMaterialSummary } from '@/lib/api/material/material.api';
import { Suspense } from 'react';
import ProjectMaterialMainLoading from './_components/ProjectMaterialMain.Loading';
import AuthGuard from '@/components/auth/AuthGuard';

type Params = Promise<{ projectId: string }>;

export async function generateMetadata(): Promise<Metadata> {
  return { title: `프로젝트 자재 정보` };
}

export default async function ProjectMaterialPage({ params }: { params: Params }) {
  const { projectId } = await params;
  const id = Number(projectId);

  const materialSummary = getMaterialSummary({ projectId: id });

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return (
    <AuthGuard allowedRoles={['admin', '관리자', '직원']}>
      <Suspense fallback={<ProjectMaterialMainLoading />}>
        <ProjectMaterialMain promiseData={materialSummary} projectId={id} />
      </Suspense>
    </AuthGuard>
  );
}
