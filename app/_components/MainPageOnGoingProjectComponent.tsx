'use client';

import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LockKeyhole, Calendar, MapPin, ArrowRight, Tag, FileText } from 'lucide-react';
import Link from 'next/link';
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

function calcProgress(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

// ── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: GetProjectOnGoingList }) {
  const dday = calculateDday(project.endDate);
  const progress = calcProgress(project.startDate, project.endDate);

  const ddayDisplay = dday === 'DAY' ? 'D-DAY' : dday === '종료' ? '종료' : String(dday);
  const showDaysLeft = typeof dday === 'number';

  return (
    <Card className="bg-card overflow-hidden !rounded-2xl !border-none !p-0 shadow-sm">
      <div className="bg-primary/30 h-1 w-full" />

      <CardContent className="relative overflow-hidden p-8">
        <div className="from-primary/5 pointer-events-none absolute -top-10 -right-10 h-52 w-52 rounded-full bg-gradient-to-br to-transparent" />

        {/* Row 1: 태그 + 연도 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
              <Tag className="h-3 w-3" />
              {project.version}
            </span>
            <span className="bg-muted text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
              <MapPin className="h-3 w-3" />
              {project.region}
            </span>
          </div>
          <span className="text-muted-foreground font-mono text-xs">
            {project.startDate.slice(0, 4)}
          </span>
        </div>

        {/* Row 2: 프로젝트명 + D-day */}
        <div className="mb-6 flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
              Project Name
            </p>
            <h3 className="text-foreground line-clamp-2 text-2xl leading-tight font-black md:text-3xl">
              {project.name}
            </h3>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-widest uppercase">
              Deadline
            </p>
            <div className="text-primary font-mono text-5xl leading-none font-black tabular-nums md:text-6xl">
              {ddayDisplay}
            </div>
            {showDaysLeft && (
              <p className="text-muted-foreground mt-1 text-right text-xs">days left</p>
            )}
          </div>
        </div>

        {/* Row 3: 타임라인 진행바 */}
        <div className="mb-6">
          <div className="text-muted-foreground mb-2 flex items-center justify-between font-mono text-xs">
            <span>{project.startDate}</span>
            <span className="text-muted-foreground/60">{progress}% 경과</span>
            <span>{project.endDate}</span>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Row 4: 버튼 */}
        <div className="flex gap-3 border-t pt-6">
          <Button asChild className="flex-1 gap-2">
            <Link href={`/project/${project.projectId}`}>
              <ArrowRight className="h-4 w-4" />
              상세 페이지
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 gap-2">
            <Link href={`/project/${project.projectId}/reports/new`}>
              <FileText className="h-4 w-4" />
              업무 보고
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card className="bg-card overflow-hidden !rounded-2xl !border-none !p-0 shadow-sm">
      <Skeleton className="h-1 w-full rounded-none" />
      <CardContent className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="mb-6 flex items-start justify-between gap-6">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-3/4" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="ml-auto h-3 w-16" />
            <Skeleton className="h-16 w-20" />
          </div>
        </div>
        <div className="mb-6 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
        <div className="flex gap-3 border-t pt-6">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function MainPageOnGoingProject() {
  const { isLoggedIn, _hasHydrated } = useAuthStore();
  const [projects, setProjects] = useState<GetProjectOnGoingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

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

  if (!_hasHydrated) return <ProjectSkeleton />;
  if (!isLoggedIn) return <OnGoingProjectBlurOverlay />;
  if (isLoading) return <ProjectSkeleton />;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-foreground text-lg font-bold">진행 중인 프로젝트</h2>
        <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">
          {projects.length}개
        </span>
      </div>

      <div>
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {projects.length > 0 ? (
              projects.map((project) => (
                <CarouselItem key={project.projectId}>
                  <ProjectCard project={project} />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="text-muted-foreground border-muted w-full rounded-3xl border-2 border-dashed py-20 text-center text-2xl">
                  현재 진행 중인 프로젝트가 없습니다.
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

// ── 비로그인 오버레이 ───────────────────────────────────────────────────────────

function OnGoingProjectBlurOverlay() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-foreground text-lg font-bold">진행 중인 프로젝트</h2>
      </div>

      <div>
        <Card className="bg-card overflow-hidden !rounded-2xl !border-none !p-0 shadow-sm">
          <div className="bg-primary/30 h-1 w-full" />
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-2 opacity-30">
              <div className="bg-primary/10 h-6 w-20 rounded-full" />
              <div className="bg-muted h-6 w-16 rounded-full" />
            </div>

            <div className="mb-6 flex items-start justify-between gap-6">
              <div className="flex-1">
                <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
                  Project Name
                </p>
                <h3 className="text-foreground mb-3 text-2xl font-black md:text-3xl">
                  회원 전용 콘텐츠
                </h3>
                <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                  진행 중인 프로젝트 정보는 로그인한 사용자에게만 공개됩니다.
                  <br />
                  우측 상단 버튼으로 로그인해 주세요.
                </p>
              </div>
              <div className="shrink-0 text-right opacity-20">
                <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-widest uppercase">
                  Deadline
                </p>
                <div className="text-muted-foreground font-mono text-6xl font-black">???</div>
              </div>
            </div>

            <div className="mb-6 opacity-20">
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div className="bg-primary h-full w-1/2 rounded-full" />
              </div>
            </div>

            <div className="flex gap-3 border-t pt-6 opacity-30">
              <div className="bg-primary h-10 flex-1 rounded-md" />
              <div className="border-border h-10 flex-1 rounded-md border" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ── 로딩 스켈레톤 ─────────────────────────────────────────────────────────────

function ProjectSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-36 rounded-md" />
        <Skeleton className="h-5 w-8 rounded-full" />
      </div>

      <div>
        <ProjectCardSkeleton />
      </div>
    </section>
  );
}
