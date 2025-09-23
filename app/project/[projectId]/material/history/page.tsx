// app/project/[projectId]/material/history/page.tsx

import AuthGuard from '@/components/auth/AuthGuard';
import { getMaterialHistory } from '@/lib/api/material/material.api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProjectMaterialHistoryMain from './_components/ProjectMaterialHistoryMain';
import ProjectMaterialHistoryMainLoading from './_components/ProjectMaterialHistoryMain.Loading';

interface ProjectMaterialHistoryPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ keyword?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: `자재 입고 이력 확인` };
}

export default async function ProjectMaterialHistroyPage({
  params,
  searchParams,
}: ProjectMaterialHistoryPageProps) {
  const { projectId } = await params;
  const id = Number(projectId);
  const { keyword } = await searchParams;

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  // API 호출 시 URL의 keyword를 함께 전달
  const materialHistory = getMaterialHistory({
    projectId: id,
    keyword: keyword,
  });

  return (
    <AuthGuard allowedRoles={['admin', '관리자', '직원']}>
      <Suspense fallback={<ProjectMaterialHistoryMainLoading />}>
        <ProjectMaterialHistoryMain promiseData={materialHistory} projectId={id} />
      </Suspense>
    </AuthGuard>
  );
}
