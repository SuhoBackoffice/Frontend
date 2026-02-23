import { getStraightDetail } from '@/lib/api/straight/straight.api';
import { notFound } from 'next/navigation';
import StraightDetailContent from './_components/StraightDetailContent';

type Params = Promise<{ projectId: string; straightRailId: string }>;

export async function generateMetadata() {
  return { title: '직선 레일 상세' };
}

export default async function StraightDetailPage({ params }: { params: Params }) {
  const { projectId, straightRailId } = await params;
  const pId = Number(projectId);
  const sId = Number(straightRailId);

  if (!Number.isSafeInteger(pId) || pId <= 0 || !Number.isSafeInteger(sId) || sId <= 0) {
    notFound();
  }

  const detail = await getStraightDetail(sId, pId);

  if (!detail.data) {
    notFound();
  }

  return <StraightDetailContent railDetail={detail.data} straightRailId={sId} projectId={pId} />;
}
