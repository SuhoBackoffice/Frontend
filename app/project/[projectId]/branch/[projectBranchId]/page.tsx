import { getProjectBranchDetailById } from '@/lib/api/project/project.api';
import { notFound } from 'next/navigation';
import BranchDetailContent from './_components/BranchDetailContent';

type Params = Promise<{ projectId: string; projectBranchId: string }>;

export async function generateMetadata() {
  return { title: '분기 레일 상세' };
}

export default async function BranchDetailPage({ params }: { params: Params }) {
  const { projectId, projectBranchId } = await params;
  const pId = Number(projectId);
  const bId = Number(projectBranchId);

  if (!Number.isSafeInteger(pId) || pId <= 0 || !Number.isSafeInteger(bId) || bId <= 0) {
    notFound();
  }

  const detail = await getProjectBranchDetailById(pId, bId);

  if (!detail.data) {
    notFound();
  }

  return (
    <BranchDetailContent branchDetail={detail.data} projectBranchId={bId} projectId={pId} />
  );
}
