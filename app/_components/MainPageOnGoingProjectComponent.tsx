'use client';

import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LockKeyhole, Calendar, MapPin, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth.store';
import { GetProjectOnGoingList } from '@/types/project/project.types';
import { getOnGoingProjectList } from '@/lib/api/project/project.api';

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
        <h2 className="from-foreground via-primary to-foreground bg-gradient-to-r bg-clip-text pb-2 text-4xl font-black tracking-tighter text-transparent md:text-5xl">
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
                  <Card className="bg-card overflow-hidden !rounded-none !border-none !p-0 shadow-2xl transition-colors duration-300">
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

                          <Button
                            asChild
                            size="lg"
                            className="shadow-primary/20 w-full rounded-full px-8 py-6 text-lg shadow-lg transition-all hover:scale-105 md:w-fit"
                          >
                            <Link href={`/project/${project.projectId}`}>
                              프로젝트 상세
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
            ) : (
              <div className="text-muted-foreground border-muted w-full rounded-3xl border-2 border-dashed py-20 text-center">
                현재 진행 중인 프로젝트가 없습니다.
              </div>
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
      <div className="mb-8 flex flex-col items-center text-center opacity-60">
        <h2 className="text-foreground text-4xl font-black tracking-tighter md:text-5xl">
          진행 중인 프로젝트
        </h2>
        <div className="bg-primary mt-4 h-1 w-20 rounded-full" />
      </div>

      <div className="mx-auto max-w-4xl px-4">
        <div className="bg-card overflow-hidden rounded-2xl shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="from-primary/80 to-primary/60 text-primary-foreground flex w-full flex-col gap-8 bg-gradient-to-br p-10 opacity-70 md:w-1/4">
              <div>
                <p className="mb-1 text-sm tracking-widest text-white/60 uppercase">Version</p>
                <div className="h-6 w-20 rounded bg-white/20" />
              </div>

              <div>
                <p className="mb-1 text-sm tracking-widest text-white/60 uppercase">Region</p>
                <div className="h-6 w-24 rounded bg-white/20" />
              </div>
            </div>

            <div className="bg-card flex w-full flex-col justify-center gap-6 p-10 md:w-3/4">
              <div className="text-primary flex items-center gap-3">
                <LockKeyhole className="h-6 w-6" />
                <span className="text-sm font-semibold tracking-wider uppercase">
                  Project Detail
                </span>
              </div>

              <h3 className="text-foreground text-2xl font-extrabold">회원 전용 콘텐츠</h3>

              <p className="text-muted-foreground max-w-md leading-relaxed">
                진행 중인 프로젝트의 상세 정보는
                <br />
                보안을 위해 로그인한 사용자에게만 공개됩니다.
                <br />
                우측 상단 로그인 버튼을 통해 로그인 해주세요.
              </p>

              <div className="mt-4 flex items-center gap-3 opacity-40">
                <Calendar className="h-5 w-5" />
                <div className="bg-muted h-5 w-40 rounded" />
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
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-16">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-12 w-64 rounded-full" />
      </div>
      <Skeleton className="h-80 w-full rounded-3xl" />
    </div>
  );
}
