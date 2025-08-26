'use client';

import { ApiResponse } from '@/types/api.types';
import { ProjectInfoBranchResponse } from '@/types/project/project.types';
import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProjectBranchProps {
  promiseData: Promise<ApiResponse<ProjectInfoBranchResponse[]>>;
  projectId: number;
}

export default function ProjectBranchDetail({ promiseData, projectId }: ProjectBranchProps) {
  const data = use(promiseData).data!;
  const router = useRouter();

  const onRegisterClick = () => {
    router.push(`/project/${projectId}/branch/register`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>분기레일</CardTitle>
        <Button variant="outline" onClick={onRegisterClick} className="h-auto px-3 py-1 text-sm">
          <Plus className="mr-2 h-4 w-4" />
          추가 등록
        </Button>
      </CardHeader>
      <CardContent>
        <Table className="border text-sm [&_td]:px-2 [&_td]:py-1 [&_th]:px-2 [&_th]:py-1">
          <TableHeader className="border-b">
            <TableRow className="divide-x">
              <TableHead className="text-center">분기 코드</TableHead>
              <TableHead className="text-center">총 수량</TableHead>
              <TableHead className="text-center">완료 수량</TableHead>
              <TableHead className="text-center">진행률</TableHead>
              <TableHead className="text-center">BOM List</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {data && data.length > 0 ? (
              data.map((branch) => {
                const progress =
                  branch.totalQuantity > 0
                    ? ((branch.completedQuantity / branch.totalQuantity) * 100).toFixed(1)
                    : 0;
                return (
                  <TableRow key={branch.projectBranchId} className="divide-x">
                    <TableCell className="text-center font-medium">{branch.branchCode}</TableCell>
                    <TableCell className="text-center">{branch.totalQuantity}</TableCell>
                    <TableCell className="text-center">{branch.completedQuantity}</TableCell>
                    <TableCell className="text-center">{progress}%</TableCell>
                    <TableCell className="text-center">{branch.branchTypeId}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Branch 정보가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
