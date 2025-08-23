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
        <CardTitle>Straight 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>타입</TableHead>
              <TableHead>루프레일</TableHead>
              <TableHead className="text-right">길이 (mm)</TableHead>
              <TableHead className="text-right">총 수량</TableHead>
              <TableHead className="text-right">Hole 위치</TableHead>
              <TableHead>Litz1</TableHead>
              <TableHead>Litz2</TableHead>
              <TableHead>Litz3</TableHead>
              <TableHead>Litz4</TableHead>
              <TableHead>Litz5</TableHead>
              <TableHead>Litz6</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((straight) => (
                <TableRow key={straight.straightRailId}>
                  <TableCell>{straight.straightType}</TableCell>
                  <TableCell>{straight.isLoopRail ? '✅' : ' '}</TableCell>
                  <TableCell className="text-right">{straight.length}</TableCell>
                  <TableCell className="text-right">{straight.totalQuantity}</TableCell>
                  <TableCell className="text-right">{straight.holePosition}</TableCell>
                  <TableCell>{Object.values(straight.litzInfo).join(', ')}</TableCell>
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
