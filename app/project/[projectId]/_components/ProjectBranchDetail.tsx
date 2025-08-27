'use client';

import { ApiError, ApiResponse } from '@/types/api.types';
import { ProjectInfoBranchResponse } from '@/types/project/project.types';
import { use, useState } from 'react';
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
import { ExternalLink, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getBranchBomList } from '@/lib/api/branch/branch.api';
import { BranchDetailInfoBom } from '@/types/branch/branch.types';
import { toast } from 'sonner';
import BomListModal from '@/components/project/branch/BomListModal';

interface ProjectBranchProps {
  promiseData: Promise<ApiResponse<ProjectInfoBranchResponse[]>>;
  projectId: number;
}

export default function ProjectBranchDetail({ promiseData, projectId }: ProjectBranchProps) {
  const data = use(promiseData).data!;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bomData, setBomData] = useState<BranchDetailInfoBom[] | null>(null);
  const [currentBranchCode, setCurrentBranchCode] = useState('');

  const onRegisterClick = () => {
    router.push(`/project/${projectId}/branch/register`);
  };

  const handleBomListClick = async (branchTypeId: number, branchCode: string) => {
    try {
      setIsModalOpen(false);
      setBomData(null);
      setCurrentBranchCode(branchCode);

      const response = await getBranchBomList({ branchTypeId });
      if (response.data) {
        setBomData(response.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : '분기레일 BOM List 조회 실패. 서버 상태가 좋지 않습니다.';
      toast.error(message);
    }
  };

  //모달에 전달할 header, keys
  const bomHeaders = ['품목 구분', '도번', '품명', '규격', '단위 수량', '단위', '사급'];
  const bomKeys = [
    'itemType',
    'drawingNumber',
    'itemName',
    'specification',
    'unitQuantity',
    'unit',
    'suppliedMaterial',
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between text-2xl font-bold">
        <CardTitle>분기레일</CardTitle>
        <Button variant="default" onClick={onRegisterClick} className="h-auto px-3 py-1 text-lg">
          <Plus className="mr-2 h-4 w-4" />
          추가 등록
        </Button>
      </CardHeader>
      <CardContent>
        <Table className="border text-lg [&_td]:px-2 [&_td]:py-1 [&_th]:px-2 [&_th]:py-1">
          <TableHeader className="border-b">
            <TableRow className="divide-x">
              <TableHead className="text-center font-bold">분기 코드</TableHead>
              <TableHead className="w-30 text-center font-bold">총 수량</TableHead>
              <TableHead className="w-30 text-center font-bold">완료 수량</TableHead>
              <TableHead className="w-30 text-center font-bold">진행률</TableHead>
              <TableHead className="w-30 text-center font-bold">BOM List</TableHead>
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
                    <TableCell className="text-center">
                      <Button
                        size="icon"
                        className="h-8 w-8"
                        variant="outline"
                        onClick={() => handleBomListClick(branch.branchTypeId, branch.branchCode)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
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
      <BomListModal<BranchDetailInfoBom>
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={bomData || []}
        headers={bomHeaders}
        keys={bomKeys as (keyof BranchDetailInfoBom)[]}
        title={`${currentBranchCode}번 분기 BOM List`}
        description={`${currentBranchCode}번 분기에 대한 자재 목록입니다.`}
      />
    </Card>
  );
}
