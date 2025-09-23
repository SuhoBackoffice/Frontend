'use client';

import { use, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, CalendarDays, Inbox, Package, Boxes } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import type { GetMaterialInboundHistoryResponse } from '@/types/material/material.types';
import type { ApiResponse } from '@/types/api.types';
import HistoryDetailContent from './HistoryDetailContent';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface ProjectMaterialHistoryMainProps {
  promiseData: Promise<ApiResponse<GetMaterialInboundHistoryResponse[]>>;
  projectId: number;
}

export default function ProjectMaterialHistoryMain({
  promiseData,
  projectId,
}: ProjectMaterialHistoryMainProps) {
  const history = use(promiseData).data!;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const debouncedKeyword = useDebounce(keyword, 100);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedKeyword) {
      params.set('keyword', debouncedKeyword);
    } else {
      params.delete('keyword');
    }

    if (searchParams.get('keyword') !== debouncedKeyword) {
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedKeyword, pathname, router, searchParams]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-12 text-center">
      <Inbox className="text-primary/60 h-12 w-12" />
      <h3 className="mt-4 text-lg font-semibold">이력 없음</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        검색 조건에 맞는 자재 입고 이력이 없습니다.
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">자재 입고 이력</CardTitle>
        <CardDescription>날짜를 선택하여 상세 입고 내역을 확인할 수 있습니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="도면 번호, 품명으로 실시간 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="pt-4">
          {history.length > 0 ? (
            <div className="m-2 rounded-lg border">
              <Accordion type="single" collapsible className="w-full">
                {history.map((item) => (
                  <AccordionItem value={item.date} key={item.date}>
                    <AccordionTrigger className="hover:bg-accent/50 p-4 text-left hover:no-underline">
                      <div className="flex w-full items-center gap-4">
                        <CalendarDays className="text-muted-foreground h-8 w-8" />
                        <div className="flex-1">
                          <p className="text-primary text-lg font-bold">{item.date}</p>
                          <p className="text-muted-foreground text-base">
                            총{' '}
                            <span className="bg-secondary text-secondary-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-semibold">
                              <Boxes className="h-4 w-4" />
                              {item.kindCount}
                            </span>{' '}
                            종류,{' '}
                            <span className="bg-secondary text-secondary-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-semibold">
                              <Package className="h-4 w-4" />
                              {item.totalCount}
                            </span>{' '}
                            개가 입고되었습니다.
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <HistoryDetailContent
                        projectId={projectId}
                        date={item.date}
                        keyword={searchParams.get('keyword') || ''}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
