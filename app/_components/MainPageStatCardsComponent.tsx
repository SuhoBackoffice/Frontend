'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, AlertTriangle, Calendar, LockKeyhole } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { GetProjectOnGoingList } from '@/types/project/project.types';
import { getOnGoingProjectList } from '@/lib/api/project/project.api';

function calculateDday(endDate: string): number | 'DAY' | '종료' {
  const today = new Date();
  const end = new Date(endDate);
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return diff;
  if (diff === 0) return 'DAY';
  return '종료';
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  iconBg: string;
}

function StatCard({ icon, label, value, sub, iconBg }: StatCardProps) {
  return (
    <Card className="rounded-2xl border-none shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground truncate text-sm">{label}</p>
          <p className="text-foreground text-2xl font-bold">{value}</p>
          {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="rounded-2xl border-none shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}

function LockedStatCards() {
  return (
    <div className="grid grid-cols-3 gap-4 opacity-40">
      {[
        { label: '진행 중인 프로젝트', iconBg: 'bg-blue-100 dark:bg-blue-900/30' },
        { label: '마감 임박', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
        { label: '이번 달 마감', iconBg: 'bg-purple-100 dark:bg-purple-900/30' },
      ].map((item) => (
        <Card key={item.label} className="rounded-2xl border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
            >
              <LockKeyhole className="text-muted-foreground h-5 w-5" />
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">{item.label}</p>
              <div className="bg-muted h-7 w-10 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function MainPageStatCards() {
  const { isLoggedIn, _hasHydrated } = useAuthStore();
  const [projects, setProjects] = useState<GetProjectOnGoingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (_hasHydrated && isLoggedIn) {
      getOnGoingProjectList()
        .then((res) => {
          if (res.isSuccess) setProjects(res.data!);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [_hasHydrated, isLoggedIn]);

  if (!_hasHydrated || isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  if (!isLoggedIn) return <LockedStatCards />;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const urgentCount = projects.filter((p) => {
    const d = calculateDday(p.endDate);
    return typeof d === 'number' && d <= 7;
  }).length;

  const thisMonthCount = projects.filter((p) => {
    const end = new Date(p.endDate);
    return end.getFullYear() === today.getFullYear() && end.getMonth() === today.getMonth();
  }).length;

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        icon={<Activity className="h-6 w-6 text-blue-600" />}
        label="진행 중인 프로젝트"
        value={`${projects.length}개`}
        iconBg="bg-blue-100 dark:bg-blue-900/30"
      />
      <StatCard
        icon={<AlertTriangle className="h-6 w-6 text-amber-500" />}
        label="마감 임박"
        value={`${urgentCount}개`}
        sub="D-7 이내"
        iconBg="bg-amber-100 dark:bg-amber-900/30"
      />
      <StatCard
        icon={<Calendar className="h-6 w-6 text-purple-600" />}
        label="이번 달 마감"
        value={`${thisMonthCount}개`}
        iconBg="bg-purple-100 dark:bg-purple-900/30"
      />
    </div>
  );
}
