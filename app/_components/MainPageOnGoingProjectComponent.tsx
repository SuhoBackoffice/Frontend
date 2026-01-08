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

export default function MainPageOnGoingProject() {
  const { isLoggedIn, _hasHydrated, user } = useAuthStore();
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

  function calculateDday(endDate: string) {
    const today = new Date();
    const end = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff > 0) return diff;
    if (diff === 0) return 'DAY';
    return '종료';
  }

  return (
    <section className="py-12">
      <div className="mb-4 flex flex-col items-center text-center">
        <h2 className="from-foreground via-primary to-foreground bg-gradient-to-r bg-clip-text pb-2 text-4xl font-black tracking-tighter text-transparent md:text-4xl">
          진행 중인 프로젝트
        </h2>
        <div className="bg-primary mt-4 mb-4 h-1 w-20 rounded-full" />
      </div>

      <div className="mx-auto max-w-4xl px-4">
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
                  <Card className="bg-card overflow-hidden !rounded-2xl !border-none !p-0 !shadow-none transition-colors duration-300">
                    <CardContent className="p-0">
                      <div className="flex h-full flex-col md:flex-row">
                        <div className="from-primary to-primary/80 text-primary-foreground flex w-full flex-col gap-8 bg-gradient-to-br p-10 md:w-1/4">
                          <div>
                            <p className="mb-1 text-sm tracking-widest text-white/70 uppercase">
                              Version
                            </p>
                            <h4 className="flex items-center text-2xl font-bold text-white">
                              <Tag className="mr-2 h-5 w-5 text-white/80" />
                              {project.version}
                            </h4>
                          </div>

                          <div>
                            <p className="mb-1 text-sm tracking-widest text-white/70 uppercase">
                              Region
                            </p>
                            <h4 className="flex items-center text-2xl font-bold text-white">
                              <MapPin className="mr-2 h-5 w-5 text-white/80" />
                              {project.region}
                            </h4>
                          </div>
                        </div>

                        <div className="bg-card flex w-full flex-col justify-center p-10 md:w-2/3">
                          <div className="text-primary mb-3 flex items-center text-sm font-semibold tracking-wider uppercase">
                            <span className="bg-primary mr-3 h-px w-8" />
                            Project Detail
                          </div>
                          <h3 className="text-foreground mb-6 text-3xl leading-tight font-extrabold">
                            {project.name}
                          </h3>

                          <div className="mb-8 flex flex-wrap items-center gap-3">
                            <Calendar className="text-primary h-5 w-5" />
                            <span className="text-foreground font-semibold">
                              {project.startDate}
                            </span>
                            <span className="text-muted-foreground/40">~</span>
                            <span className="text-foreground font-semibold">{project.endDate}</span>

                            <div className="bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-bold">
                              D-{calculateDday(project.endDate)}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 md:flex-row">
                            <Button
                              asChild
                              size="sm"
                              className="shadow-primary/20 w-full py-6 text-lg shadow-lg transition-all hover:scale-105 md:w-fit"
                            >
                              <Link href={`/project/${project.projectId}`}>
                                <ArrowRight className="ml-2 h-5 w-5" />
                                상세 페이지
                              </Link>
                            </Button>

                            <Button
                              asChild
                              size="sm"
                              className="shadow-primary/20 w-full py-6 text-lg shadow-lg transition-all hover:scale-105 md:w-fit"
                            >
                              <Link
                                aria-disabled
                                href={`/project/${project.projectId}/reports/new`}
                              >
                                <FileText className="ml-2 h-5 w-5" />
                                업무 보고
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="text-muted-foreground border-muted w-full rounded-3xl border-2 border-dashed py-20 text-center !text-2xl">
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

function OnGoingProjectBlurOverlay() {
  return (
    <section className="py-12">
      {/* 헤더 부분: 메인과 동일한 그라데이션 적용 */}
      <div className="mb-4 flex flex-col items-center text-center">
        <h2 className="from-foreground via-primary to-foreground bg-gradient-to-r bg-clip-text pb-2 text-4xl font-black tracking-tighter text-transparent md:text-4xl">
          진행 중인 프로젝트
        </h2>
        <div className="bg-primary mt-4 mb-4 h-1 w-20 rounded-full" />
      </div>

      <div className="mx-auto max-w-4xl px-4">
        {/* 카드 스타일 동기화: !rounded-2xl, shadow-none 제거 후 메인 스타일 반영 */}
        <div className="bg-card overflow-hidden rounded-2xl border-none shadow-none">
          <div className="flex flex-col md:flex-row">
            {/* 왼쪽 영역: 메인과 동일한 그라데이션 및 패딩 */}
            <div className="from-primary to-primary/80 text-primary-foreground flex w-full flex-col gap-8 bg-gradient-to-br p-10 opacity-70 md:w-1/4">
              <div>
                <p className="mb-1 text-sm tracking-widest text-white/70 uppercase">Version</p>
                <div className="h-8 w-16 animate-pulse rounded-lg bg-white/20" />
              </div>

              <div>
                <p className="mb-1 text-sm tracking-widest text-white/70 uppercase">Region</p>
                <div className="h-8 w-20 animate-pulse rounded-lg bg-white/20" />
              </div>
            </div>

            {/* 오른쪽 영역: 메인과 동일한 레이아웃 및 'Project Detail' 라인 적용 */}
            <div className="bg-card flex w-full flex-col justify-center p-10 md:w-3/4">
              <div className="text-primary mb-3 flex items-center text-sm font-semibold tracking-wider uppercase">
                <span className="bg-primary mr-3 h-px w-8" />
                <LockKeyhole className="mr-2 h-4 w-4" />
                Project Detail
              </div>

              <h3 className="text-foreground mb-4 text-3xl leading-tight font-extrabold">
                회원 전용 콘텐츠
              </h3>

              <p className="text-muted-foreground max-w-md leading-relaxed">
                진행 중인 프로젝트의 상세 정보는 보안을 위해
                <br />
                로그인한 사용자에게만 공개됩니다.
                <br />
                우측 상단 버튼을 통해 로그인 해주세요.
              </p>

              <div className="mt-8 flex items-center gap-3 opacity-30">
                <Calendar className="text-primary h-5 w-5" />
                <div className="bg-muted h-5 w-48 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectSkeleton() {
  return (
    <section className="py-12">
      {/* 헤더 스켈레톤 */}
      <div className="mb-4 flex flex-col items-center text-center">
        <Skeleton className="h-12 w-64 rounded-full" />
        <Skeleton className="mt-6 h-1 w-20 rounded-full" />
      </div>

      <div className="mx-auto max-w-4xl px-4">
        <div className="bg-card flex flex-col overflow-hidden rounded-2xl md:flex-row">
          {/* 왼쪽 영역 스켈레톤 (1/4) */}
          <div className="bg-primary/10 flex w-full flex-col gap-8 p-10 md:w-1/4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          {/* 오른쪽 영역 스켈레톤 (3/4) */}
          <div className="flex w-full flex-col justify-center p-10 md:w-3/4">
            <div className="mb-4 flex items-center gap-3">
              <Skeleton className="h-px w-8" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="mb-6 h-10 w-3/4" />
            <div className="mb-8 flex items-center gap-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-12 w-32 rounded-md" />
              <Skeleton className="h-12 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
