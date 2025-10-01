import type { ReactNode } from 'react';
import { ProjectSidenav } from './_components/ProjectSidenav';

type Params = Promise<{ projectId: string }>;

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) {
  const { projectId } = await params;
  const id = Number(projectId);

  return (
    <div className="min-h-dvh">
      {/* 좌측 사이드바 + 우측 본문 그리드 */}
      <div className="container mx-auto p-4 md:p-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-6">
        <aside className="mb-6 lg:sticky lg:top-[calc(var(--sticky-top))] lg:mb-0 lg:max-h-[calc(100dvh-var(--header-height)-24px)] lg:self-start lg:overflow-y-auto">
          <ProjectSidenav projectId={id} />
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
