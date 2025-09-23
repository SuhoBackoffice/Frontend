'use client';

import { useEffect, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getMaterialDetailHistroy } from '@/lib/api/material/material.api';
import { GetMaterialInboundDetailHistoryResponse } from '@/types/material/material.types';
import { toast } from 'sonner';
import { ApiError } from '@/types/api.types';

interface HistoryDetailContentProps {
  projectId: number;
  date: string;
  keyword?: string;
}

export default function HistoryDetailContent({
  projectId,
  date,
  keyword,
}: HistoryDetailContentProps) {
  const [details, setDetails] = useState<GetMaterialInboundDetailHistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const response = await getMaterialDetailHistroy({ projectId, date, keyword });
        setDetails(response.data!);
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : '상세 이력 조회 중 오류가 발생했습니다.';
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [projectId, date, keyword]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (details.length === 0) {
    return (
      <p className="text-muted-foreground text-center text-sm">
        해당 날짜의 상세 입고 내역이 없습니다.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">ID</TableHead>
            <TableHead className="text-center">도면 번호</TableHead>
            <TableHead className="text-center">품명</TableHead>
            <TableHead className="text-center">수량</TableHead>
            <TableHead className="text-center">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-center">{item.id}</TableCell>
              <TableCell className="text-center font-medium">{item.drawingNumber}</TableCell>
              <TableCell className="text-center">{item.itemName}</TableCell>
              <TableCell className="text-center">{item.quantity}EA</TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">메뉴 열기</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => alert(`수정: ID ${item.id}`)}>
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => alert(`삭제: ID ${item.id}`)}
                      className="text-destructive"
                    >
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
