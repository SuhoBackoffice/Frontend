import type { GetBranchBomShortageList } from '@/types/project/project.types';

export const shortageBadgeClass = (n: number) => {
  if (n >= 50) return 'bg-red-100 text-red-700 border-red-200';
  if (n >= 10) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (n > 0) return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

export const topShortages = (list: GetBranchBomShortageList[]) =>
  [...list].sort((a, b) => b.shortage - a.shortage).slice(0, 2);
