import { memo } from 'react';

const BranchLegendComponent = () => (
  <div className="text-muted-foreground -ml-1 space-y-1 justify-self-start text-[12px] leading-tight">
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-3 w-3 rounded-sm"
        style={{ background: 'url(#gradCompleted)' as const, backgroundColor: '#60a5fa' }}
      />
      <span>완료</span>
    </div>
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-3 w-3 rounded-sm"
        style={{
          background: 'url(#gradProducible)' as const,
          backgroundColor: '#22c55e',
        }}
      />
      <span>생산 가능</span>
    </div>
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-3 w-3 rounded-sm"
        style={{
          background: 'url(#gradUnproducible)' as const,
          backgroundColor: '#ef4444',
        }}
      />
      <span>생산 불가</span>
    </div>
  </div>
);

export const BranchLegend = memo(BranchLegendComponent);
