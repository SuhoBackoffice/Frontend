'use client';

import { useRouter } from 'next/navigation';
import { Loader2, FolderSearch } from 'lucide-react';
import { ProjectInfoResponse } from '@/types/project/project.types';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: ProjectInfoResponse[];
  isLoading: boolean;
}

export function ProjectList({ projects, isLoading }: ProjectListProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin" />
        <p className="text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <FolderSearch className="h-10 w-10 opacity-30" />
        <p className="text-sm">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => router.push(`/project/${project.id}`)}
        />
      ))}
    </div>
  );
}
