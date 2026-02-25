import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MaterialStockMain from './_components/MaterialStockMain';

interface MaterialStockPageProps {
  params: Promise<{ projectId: string }>;
}

export const metadata: Metadata = {
  title: '자재 재고 현황',
};

export default async function MaterialStockPage({ params }: MaterialStockPageProps) {
  const { projectId } = await params;
  const id = Number(projectId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return <MaterialStockMain projectId={id} />;
}
