'use client';

import { use } from 'react';
import { ApiResponse } from '@/types/api.types';
import { GetProjectBranchCapacityResponse } from '@/types/project/project.types';
import { BranchCapacityCard } from './BranchCapacityCard';

interface ProjectBranchCapacityProps {
  promiseData: Promise<ApiResponse<GetProjectBranchCapacityResponse[]>>;
  projectId: number;
}

export default function ProjectBranchCapacityMain({ promiseData }: ProjectBranchCapacityProps) {
  const { data: branchCapacity } = use(promiseData);

  if (!branchCapacity || branchCapacity.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-lg border border-dashed">
        <p className="text-foreground/80 text-base font-semibold">생산 현황 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4">
      {branchCapacity.map((branch, idx) => (
        <BranchCapacityCard key={branch.branchTypeId} branch={branch} idx={idx} />
      ))}
    </div>
  );
}
