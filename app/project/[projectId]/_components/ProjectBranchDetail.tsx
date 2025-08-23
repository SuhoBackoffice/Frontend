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

interface ProjectBranchProps {
  promiseData: Promise<ApiResponse<ProjectInfoBranchResponse[]>>;
}

export default function ProjectBranchDetail({ promiseData }: ProjectBranchProps) {
  const data = use(promiseData).data!;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>분기 코드</TableHead>
              <TableHead>분기 버전</TableHead>
              <TableHead className="text-right">총 수량</TableHead>
              <TableHead className="text-right">완료 수량</TableHead>
              <TableHead className="text-right">진행률</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((branch) => {
                const progress =
                  branch.totalQuantity > 0
                    ? ((branch.completedQuantity / branch.totalQuantity) * 100).toFixed(1)
                    : 0;
                return (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">{branch.branchCode}</TableCell>
                    <TableCell>{branch.branchVersion}</TableCell>
                    <TableCell className="text-right">{branch.totalQuantity}</TableCell>
                    <TableCell className="text-right">{branch.completedQuantity}</TableCell>
                    <TableCell className="text-right">{progress}%</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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
