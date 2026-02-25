'use client';

import { CalendarRange, MapPin, Tag, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProjectInfoResponse } from '@/types/project/project.types';

interface ProjectCardProps {
  project: ProjectInfoResponse;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      {/* Top row: badges + arrow */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="gap-1 text-xs font-normal">
            <Tag className="h-2.5 w-2.5" />
            {project.version}
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs font-normal">
            <MapPin className="h-2.5 w-2.5" />
            {project.region}
          </Badge>
        </div>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/30 transition-all group-hover:text-primary group-hover:opacity-100" />
      </div>

      {/* Project name */}
      <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug transition-colors group-hover:text-primary">
        {project.name}
      </h3>

      {/* Date range */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarRange className="h-3.5 w-3.5 shrink-0" />
        <span>{project.startDate}</span>
        <span className="opacity-40">—</span>
        <span>{project.endDate}</span>
      </div>
    </div>
  );
}
