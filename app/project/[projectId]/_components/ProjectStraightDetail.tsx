'use client';

import { ApiResponse } from '@/types/api.types';
import { ProjectInfoStraightResponse } from '@/types/project/project.types';
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
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface ProjectStraightProps {
  promiseData: Promise<ApiResponse<ProjectInfoStraightResponse[]>>;
  projectId: number;
}

export default function ProjectStraightDetail({ promiseData, projectId }: ProjectStraightProps) {
  const data = use(promiseData).data!;
  const router = useRouter();

  const onRegisterClick = () => {
    router.push(`/project/${projectId}/straight/register`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>직선 레일</CardTitle>
        <Button variant="outline" onClick={onRegisterClick} className="h-auto px-3 py-1">
          <Plus className="mr-2 h-4 w-4" />
          추가 등록
        </Button>
      </CardHeader>
      <CardContent>
        <Table className="border text-sm [&_td]:px-2 [&_td]:py-1 [&_th]:px-2 [&_th]:py-1">
          <TableHeader className="border-b">
            <TableRow className="divide-x">
              <TableHead className="text-center">길이</TableHead>
              <TableHead className="text-center">타입</TableHead>
              <TableHead className="text-center">수량</TableHead>
              <TableHead className="text-center">루프레일</TableHead>
              <TableHead className="text-center">가공</TableHead>
              <TableHead className="text-center">Litz1</TableHead>
              <TableHead className="text-center">Litz2</TableHead>
              <TableHead className="text-center">Litz3</TableHead>
              <TableHead className="text-center">Litz4</TableHead>
              <TableHead className="text-center">Litz5</TableHead>
              <TableHead className="text-center">Litz6</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {data && data.length > 0 ? (
              data.map((straight) => (
                <TableRow key={straight.straightRailId} className="divide-x">
                  <TableCell className="text-center">{straight.length}</TableCell>
                  <TableCell className="text-center">{straight.straightType}</TableCell>
                  <TableCell className="text-center">{straight.totalQuantity}</TableCell>
                  <TableCell className="text-center">{straight.isLoopRail ? '✅' : '❌'}</TableCell>
                  <TableCell className="text-center">
                    {straight.holePosition == 0 ? '❌' : straight.holePosition}
                  </TableCell>
                  <TableCell className="text-center">{straight.litzInfo.litz1}</TableCell>
                  <TableCell className="text-center">{straight.litzInfo.litz2}</TableCell>
                  <TableCell className="text-center">{straight.litzInfo.litz3}</TableCell>
                  <TableCell className="text-center">{straight.litzInfo.litz4}</TableCell>
                  <TableCell className="text-center">{straight.litzInfo.litz5}</TableCell>
                  <TableCell className="text-center">{straight.litzInfo.litz6}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  Straight 정보가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
