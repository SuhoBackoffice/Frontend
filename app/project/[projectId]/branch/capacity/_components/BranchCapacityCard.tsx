import { GetProjectBranchCapacityResponse } from '@/types/project/project.types';
import { BranchInfo } from './BranchInfo';
import { BranchChart } from './BranchChart';
import { BranchLegend } from './BranchLegend';
import { ShortageAccordion } from './ShortageAccordion';

interface BranchCapacityCardProps {
  branch: GetProjectBranchCapacityResponse;
  idx: number;
}

export function BranchCapacityCard({ branch, idx }: BranchCapacityCardProps) {
  const completed = branch.completedQuantity;
  const producible = branch.capacity;
  const unproducible = Math.max(0, branch.totalQuantity - completed - producible);

  const pieChartData = [
    { name: '완료', value: completed, key: 'completed' },
    { name: '생산 가능', value: producible, key: 'producible' },
    { name: '생산 불가', value: unproducible, key: 'unproducible' },
  ].filter((d) => d.value > 0);

  return (
    <section className="border-border/50 bg-card/30 grid items-center gap-1 rounded-2xl border p-2 md:grid-cols-[3fr_200px_1fr]">
      <BranchInfo branch={branch} idx={idx} />
      <BranchChart pieChartData={pieChartData} />
      <BranchLegend />
      <ShortageAccordion shortageList={branch.branchBomShortageList} />
    </section>
  );
}
