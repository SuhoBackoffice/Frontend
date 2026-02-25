import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectMaterialHistoryMain from './_components/ProjectMaterialHistoryMain';

interface ProjectMaterialHistoryPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ keyword?: string }>;
}

export const metadata: Metadata = {
  title: '자재 입고 이력',
};

export default async function ProjectMaterialHistoryPage({
  params,
  searchParams,
}: ProjectMaterialHistoryPageProps) {
  const { projectId } = await params;
  const { keyword } = await searchParams;
  const id = Number(projectId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return (
    <ProjectMaterialHistoryMain
      projectId={id}
      initialKeyword={keyword ?? ''}
    />
  );
}
