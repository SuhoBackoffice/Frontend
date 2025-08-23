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

interface ProjectStraightProps {
  promiseData: Promise<ApiResponse<ProjectInfoStraightResponse[]>>;
}

export default function ProjectStraightDetail({ promiseData }: ProjectStraightProps) {
  const data = use(promiseData).data!;

  return (
    <Card>
      <CardHeader>
        <CardTitle>직선 레일</CardTitle>
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
