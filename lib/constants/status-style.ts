export const STATUS_STYLE = {
  PENDING: {
    container: 'bg-amber-500/10 border-amber-500/20',
    surface: 'bg-amber-50/50 dark:bg-amber-950/10',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-500',
    label: '승인 대기',
  },
  APPROVED: {
    container: 'bg-emerald-500/10 border-emerald-500/20',
    surface: 'bg-emerald-50/50 dark:bg-emerald-950/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-600',
    label: '승인 완료',
  },
  REJECTED: {
    container: 'bg-rose-500/10 border-rose-500/20',
    surface: 'bg-rose-50/50 dark:bg-rose-950/10',
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'bg-rose-600',
    label: '반려',
  },
} as const;

export type StatusType = keyof typeof STATUS_STYLE;
