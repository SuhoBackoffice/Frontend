'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  Inbox,
  Package,
  PackageCheck,
  PackageOpen,
  WarehouseIcon,
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
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { getMaterialStockSortTypes, getMaterialStockList } from '@/lib/api/material/material.api';
import type {
  GetMaterialStockSortResponse,
  GetMaterialStockItemResponse,
  MaterialStockSortType,
  MaterialStockDirType,
} from '@/types/material/material.types';
import { ApiError } from '@/types/api.types';
import { toast } from 'sonner';

interface MaterialStockMainProps {
  projectId: number;
}

export default function MaterialStockMain({ projectId }: MaterialStockMainProps) {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);

  const [sortTypes, setSortTypes] = useState<GetMaterialStockSortResponse[]>([]);
  const [sort, setSort] = useState<MaterialStockSortType>('MATERIAL_CODE');
  const [dir, setDir] = useState<MaterialStockDirType>('ASC');

  const [items, setItems] = useState<GetMaterialStockItemResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // 정렬 조건 조회
  useEffect(() => {
    getMaterialStockSortTypes()
      .then((res) => {
        if (res.isSuccess && res.data) setSortTypes(res.data);
      })
      .catch(() => {});
  }, []);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMaterialStockList({
        projectId,
        sort,
        dir,
        keyword: debouncedKeyword || undefined,
      });
      if (res.isSuccess && res.data) {
        setItems(res.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : '자재 재고 조회에 실패했습니다.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [projectId, sort, dir, debouncedKeyword]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const currentSortLabel = sortTypes.find((s) => s.sort === sort)?.description ?? '도번';

  const emptyState = (
    <div className="border-muted flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
      <Inbox className="text-muted-foreground h-12 w-12" />
      <h3 className="mt-4 text-lg font-semibold">자재 없음</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        {debouncedKeyword
          ? `"${debouncedKeyword}"에 해당하는 자재가 없습니다.`
          : '이 프로젝트에 할당된 자재가 없습니다.'}
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 페이지 설명 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <WarehouseIcon className="text-primary h-5 w-5" />
            <CardTitle className="text-2xl">프로젝트 자재 현황</CardTitle>
          </div>
          <CardDescription className="mt-1 text-sm leading-relaxed whitespace-pre-line">
            {`이 페이지는 현재 프로젝트에 할당된 자재별 계획 수량, 입고 수량, 사용 수량, 잔여 입고 필요량을 한눈에 확인하는 자재 현황판입니다.
자재 입고 대비 사용 진행 상황을 추적하여 생산 계획에 차질이 없도록 관리하세요.`}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">자재 목록</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 필터 영역 */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="도번, 품명으로 검색..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {/* 정렬 기준 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <span>{currentSortLabel}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortTypes.map((s) => (
                    <DropdownMenuItem key={s.sort} onClick={() => setSort(s.sort)}>
                      {s.description}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 정렬 방향 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <span>{dir === 'ASC' ? '오름차순' : '내림차순'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDir('ASC')}>오름차순</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDir('DESC')}>내림차순</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* 테이블 */}
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : items.length === 0 ? (
            emptyState
          ) : (
            <>
              <p className="text-muted-foreground text-sm">총 {items.length}건</p>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center whitespace-nowrap">도번</TableHead>
                      <TableHead>품명</TableHead>
                      <TableHead className="text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <Package className="h-3.5 w-3.5" />
                          계획 수량
                        </span>
                      </TableHead>
                      <TableHead className="text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <PackageCheck className="h-3.5 w-3.5" />
                          입고 수량
                        </span>
                      </TableHead>
                      <TableHead className="text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <PackageOpen className="h-3.5 w-3.5" />
                          사용 수량
                        </span>
                      </TableHead>
                      <TableHead className="text-center whitespace-nowrap">잔여 입고량</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center font-mono text-sm font-medium whitespace-nowrap">
                          {item.materialCode}
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate">{item.itemName}</TableCell>
                        <TableCell className="text-center">{item.totalPlanQuantity}</TableCell>
                        <TableCell className="text-center">{item.totalInboundQuantity}</TableCell>
                        <TableCell className="text-center">{item.totalUsedQuantity}</TableCell>
                        <TableCell className="text-center font-semibold">
                          {item.remainingInbound > 0 ? (
                            <span className="text-destructive">{item.remainingInbound}</span>
                          ) : (
                            <span className="text-muted-foreground">{item.remainingInbound}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
