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
    <div className="flex min-h-dvh flex-col">
      <div className="container mx-auto flex flex-1 flex-col p-4 md:p-8 lg:grid lg:grid-cols-[auto_1fr] lg:items-stretch lg:gap-6">
        <aside className="mb-6 lg:mb-0">
          <div className="lg:sticky lg:top-[calc(var(--sticky-top,2rem))] lg:h-[calc(100dvh-var(--header-height,4rem)-4rem)]">
            <ProjectSidenav projectId={id} />
          </div>
        </aside>
        <main className="flex-1 space-y-6">{children}</main>
      </div>
    </div>
  );
}
