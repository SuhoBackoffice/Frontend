'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  ChevronDown,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Calendar,
  Inbox,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { getMaterialHistoryPaged } from '@/lib/api/material/material.api';
import type { MaterialHistoryItemResponse } from '@/types/material/material.types';
import { ApiError } from '@/types/api.types';
import { toast } from 'sonner';

const PAGE_SIZE = 10;
const TYPE_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'INBOUND', label: '입고' },
  { value: 'OUTBOUND', label: '출고' },
] as const;
const SORT_OPTIONS = [
  { value: 'LATEST' as const, label: '최신순', Icon: ArrowDownNarrowWide },
  { value: 'OLDEST' as const, label: '과거순', Icon: ArrowUpNarrowWide },
] as const;

interface ProjectMaterialHistoryMainProps {
  projectId: number;
  initialKeyword?: string;
}

function formatHistoryDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function getTypeLabel(type: string): string {
  const found = TYPE_OPTIONS.find((o) => o.value === type);
  return found ? found.label : type;
}

export default function ProjectMaterialHistoryMain({
  projectId,
  initialKeyword = '',
}: ProjectMaterialHistoryMainProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(initialKeyword);
  const debouncedKeyword = useDebounce(keyword, 300);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sort, setSort] = useState<'LATEST' | 'OLDEST'>('LATEST');
  const [page, setPage] = useState(0);

  const [content, setContent] = useState<MaterialHistoryItemResponse[]>([]);
  const [paging, setPaging] = useState({
    pageNo: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [loadingHistory, setLoadingHistory] = useState(true);

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

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await getMaterialHistoryPaged({
        projectId,
        keyword: debouncedKeyword || undefined,
        sort,
        type: typeFilter === 'ALL' ? undefined : typeFilter,
        page,
        size: PAGE_SIZE,
      });
      if (res.isSuccess && res.data) {
        setContent(res.data.content);
        setPaging({
          pageNo: res.data.pageNo,
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
          hasNext: res.data.hasNext,
          hasPrevious: res.data.hasPrevious,
        });
      } else {
        setContent([]);
        setPaging({
          pageNo: 0,
          totalPages: 0,
          totalElements: 0,
          hasNext: false,
          hasPrevious: false,
        });
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : '이력 조회 실패');
      setContent([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [projectId, debouncedKeyword, sort, typeFilter, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const typeLabel = TYPE_OPTIONS.find((o) => o.value === typeFilter)?.label ?? '전체';
  const sortOption = SORT_OPTIONS.find((o) => o.value === sort);
  const SortIcon = sortOption?.Icon ?? ArrowDownNarrowWide;

  const emptyState = (
    <div className="border-muted flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
      <Inbox className="text-muted-foreground h-12 w-12" />
      <h3 className="mt-4 text-lg font-semibold">이력 없음</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        검색·필터 조건에 맞는 자재 이력이 없습니다.
      </p>
    </div>
  );

  return (
    <Card>
        <CardHeader>
          <CardTitle className="text-2xl">자재 이력</CardTitle>
          <CardDescription>입·출고 이력을 검색·필터하여 확인할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="relative min-w-0 flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="도면 번호, 품명으로 검색..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(0);
                }}
                className="pl-9"
              />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <span>{typeLabel}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {TYPE_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => {
                        setTypeFilter(opt.value);
                        setPage(0);
                      }}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <SortIcon className="h-4 w-4" />
                    <span>{sortOption?.label ?? '정렬'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {SORT_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => {
                        setSort(opt.value);
                        setPage(0);
                      }}
                    >
                      <opt.Icon className="mr-2 h-4 w-4" />
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {loadingHistory ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : content.length === 0 ? (
            emptyState
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap text-left">
                        <Calendar className="text-muted-foreground inline h-4 w-4" />
                        <span className="ml-1.5">일시</span>
                      </TableHead>
                      <TableHead>도면 번호</TableHead>
                      <TableHead>품명</TableHead>
                      <TableHead className="text-center">수량</TableHead>
                      <TableHead className="hidden md:table-cell">설명</TableHead>
                      <TableHead className="text-center">유형</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {content.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                          {formatHistoryDate(row.createdAt)}
                        </TableCell>
                        <TableCell className="font-medium">{row.materialCode}</TableCell>
                        <TableCell>{row.itemName}</TableCell>
                        <TableCell className="text-center">{row.quantity}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate text-sm md:max-w-none">
                          {row.description}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{getTypeLabel(row.type)}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {paging.totalPages > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                  <p className="text-muted-foreground shrink-0 whitespace-nowrap text-sm">
                    총 {paging.totalElements}건
                    {paging.totalPages > 1 && ` (${paging.pageNo + 1}/${paging.totalPages}페이지)`}
                  </p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (paging.hasPrevious) setPage((p) => Math.max(0, p - 1));
                          }}
                          className={
                            !paging.hasPrevious ? 'pointer-events-none opacity-50' : undefined
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: paging.totalPages }, (_, i) => i)
                        .filter(
                          (i) =>
                            i >= Math.max(0, paging.pageNo - 2) &&
                            i <= Math.min(paging.totalPages - 1, paging.pageNo + 2)
                        )
                        .map((i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(i);
                              }}
                              isActive={i === paging.pageNo}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (paging.hasNext) setPage((p) => p + 1);
                          }}
                          className={!paging.hasNext ? 'pointer-events-none opacity-50' : undefined}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
    </Card>
  );
}
