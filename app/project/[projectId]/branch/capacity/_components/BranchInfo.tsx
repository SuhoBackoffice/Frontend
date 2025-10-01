import { memo } from 'react';
import Image from 'next/image';
import { GetProjectBranchCapacityResponse } from '@/types/project/project.types';
import { CheckCircle2, XCircle, CirclePlus, ListChecks } from 'lucide-react';

interface BranchInfoProps {
  branch: GetProjectBranchCapacityResponse;
  idx: number;
}

const BranchInfoComponent = ({ branch, idx }: BranchInfoProps) => {
  const completed = branch.completedQuantity;
  const hasImage = !!branch.imageUrl && branch.imageUrl.trim() !== '';

  return (
    <div className="bg-card/50 flex h-full flex-col justify-between rounded-lg p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="bg-muted relative aspect-square w-12 flex-shrink-0 overflow-hidden rounded-md">
          {hasImage ? (
            <Image
              src={branch.imageUrl}
              alt={`${branch.name} 이미지`}
              fill
              sizes="64px"
              className="object-cover"
              priority={idx < 2}
            />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center text-[10px]">
              N/A
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-muted inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm" />
            <p className="truncate text-base leading-tight font-semibold">{branch.name}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground rounded-md border px-1.5 py-0.5 text-[11px]">
              코드: <span className="text-card-foreground font-medium">{branch.code}</span>
            </span>
            <span
              className={[
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                branch.capacity > 0
                  ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-400'
                  : 'border border-red-500/30 bg-red-500/20 text-red-400',
              ].join(' ')}
              title={branch.capacity > 0 ? '생산 가능' : '생산 불가'}
            >
              {branch.capacity > 0 ? (
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {branch.capacity > 0 ? '생산 가능' : '생산 불가'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-1">
        <div className="rounded-md border bg-emerald-500/10 px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <CirclePlus className="h-4 w-4" aria-hidden="true" />
              <span className="text-base font-bold">추가 생산 가능 수량</span>
            </div>
            <div className="text-2xl font-extrabold">
              {branch.capacity}
              <span className="ml-1 align-top text-2xl font-extrabold">개</span>
            </div>
          </div>
        </div>

        <div className="bg-muted/40 rounded-md border px-3 py-1">
          <div className="flex items-baseline justify-between">
            <span className="inline-flex items-center gap-1.5 text-base font-semibold">
              <ListChecks className="h-4 w-4" aria-hidden="true" />
              완료 / 계획
            </span>
            <span className="text-card-foreground text-2xl font-bold">
              {completed} / {branch.totalQuantity}
            </span>
          </div>
          <div className="bg-muted mt-1 h-1.5 w-full rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{
                width: `${branch.totalQuantity ? (completed / branch.totalQuantity) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const BranchInfo = memo(BranchInfoComponent);
