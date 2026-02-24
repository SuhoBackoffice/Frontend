import type { ReactNode } from 'react';
import { MobileProjectNav, ProjectSidenav } from './_components/ProjectSidenav';

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
      <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 lg:hidden">
        <MobileProjectNav projectId={id} />
        <div className="flex flex-col items-start -space-y-1">
          <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
            Project #{id}
          </span>
          <span className="text-base font-bold tracking-tight">SUHO Production</span>
        </div>
      </header>

      <div className="container mx-auto flex flex-1 flex-col p-4 md:p-8 lg:grid lg:grid-cols-[auto_1fr] lg:items-stretch lg:gap-4">
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-[var(--sticky-top)] lg:h-[calc(100dvh-var(--header-height))]">
            <ProjectSidenav projectId={id} />
          </div>
        </aside>

        <main className="w-full max-w-full flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
