import AuthGuard from '@/components/auth/AuthGuard';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectMaterialRegisterComponent from './_components/ProjectMaterialRegisterComponent';

interface ProjectMaterialRegisterPageProps {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: `자재 입고 등록` };
}

export default async function ProjectMaterialRegisterPage({
  params,
}: ProjectMaterialRegisterPageProps) {
  const { projectId } = await params;
  const id = Number(projectId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return (
    <AuthGuard allowedRoles={['admin', '관리자', '직원']}>
      <ProjectMaterialRegisterComponent projectId={id} />
    </AuthGuard>
  );
}
