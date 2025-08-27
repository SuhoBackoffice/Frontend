import { notFound } from 'next/navigation';
import StraightRegisterComponent from './_components/StraightRegisterComponent.client';

type Params = Promise<{ projectId: string }>;

export async function generateMetadata() {
  return { title: `신규 직선 레일 등록` };
}

export default async function ProjectStraightRegister({ params }: { params: Params }) {
  const { projectId } = await params;
  const id = Number(projectId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return <StraightRegisterComponent projectId={id} />;
}
