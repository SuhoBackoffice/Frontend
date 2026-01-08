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
    <div className="flex min-h-dvh flex-col bg-slate-50/30">
      <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 lg:hidden">
        <MobileProjectNav projectId={id} />
        <span className="text-sm font-bold tracking-tight">프로젝트 관리 시스템</span>
      </header>

      <div className="container mx-auto flex flex-1 flex-col p-4 md:p-8 lg:grid lg:grid-cols-[auto_1fr] lg:items-stretch lg:gap-8">
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-8 lg:h-[calc(100dvh-6rem)]">
            <ProjectSidenav projectId={id} />
          </div>
        </aside>

        <main className="w-full max-w-full flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
