import { notFound } from 'next/navigation';
import BranchRegisterComponent from './_components/BranchRegisterComponent.client';

type Params = Promise<{ projectId: string }>;

export async function generateMetadata() {
  return { title: `신규 분기 레일 등록` };
}

export default async function BranchRailRegister({ params }: { params: Params }) {
  const { projectId } = await params;
  const id = Number(projectId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return <BranchRegisterComponent projectId={id} />;
}
