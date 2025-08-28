'use client';

import { ApiError, ApiResponse } from '@/types/api.types';
import { ProjectInfoBranchResponse } from '@/types/project/project.types';
import { use, useState, useTransition } from 'react';
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
import { Check, ExternalLink, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getBranchBomList } from '@/lib/api/branch/branch.api';
import { BranchDetailInfoBom } from '@/types/branch/branch.types';
import { toast } from 'sonner';
import BomListModal from '@/components/project/branch/BomListModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { deleteProjectBranch } from '@/lib/api/project/project.api';
import { updateBranchRailAction } from '@/lib/action/branch.action';

interface ProjectBranchProps {
  promiseData: Promise<ApiResponse<ProjectInfoBranchResponse[]>>;
  projectId: number;
}

type EditFormData = {
  totalQuantity: number | '';
};

export default function ProjectBranchDetail({ promiseData, projectId }: ProjectBranchProps) {
  const initialData = use(promiseData).data!;
  const [branchs, setBranchs] = useState(initialData);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bomData, setBomData] = useState<BranchDetailInfoBom[] | null>(null);
  const [currentBranchCode, setCurrentBranchCode] = useState('');
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editFormData, setEditFormData] = useState<EditFormData>({ totalQuantity: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const onRegisterClick = () => {
    router.push(`/project/${projectId}/branch/register`);
  };

  const handleSaveClick = (projectBranchId: number) => {
    startTransition(async () => {
      const result = await updateBranchRailAction(projectBranchId, editFormData);

      if (result.success) {
        toast.success(result.message);
        setEditingRowId(null);
        setBranchs(
          branchs.map((branch) =>
            branch.projectBranchId === projectBranchId
              ? { ...branch, totalQuantity: editFormData.totalQuantity as number }
              : branch
          )
        );
      } else {
        toast.error(result.message);
        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    });
  };

  const handleEditClick = (branch: ProjectInfoBranchResponse) => {
    setEditingRowId(branch.projectBranchId);
    setEditFormData({ totalQuantity: branch.totalQuantity });
    setFieldErrors({});
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
    setFieldErrors({});
  };

  const handleDeleteClick = (projectBranchId: number) => {
    startTransition(async () => {
      try {
        const result = await deleteProjectBranch(projectBranchId);
        toast.success(result.message);
        setBranchs(branchs.filter((branch) => branch.projectBranchId !== projectBranchId));
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : '분기레일 삭제 실패. 네트워크가 좋지 않습니다.';
        toast.error(message);
      }
    });
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
              <TableHead className="w-45 text-center font-bold">이미지</TableHead>
              <TableHead className="w-30 text-center font-bold">분기 코드</TableHead>
              <TableHead className="w-auto text-center font-bold">이름</TableHead>
              <TableHead className="w-30 text-center font-bold">총 수량</TableHead>
              <TableHead className="w-30 text-center font-bold">완료 수량</TableHead>
              <TableHead className="w-30 text-center font-bold">진행률</TableHead>
              <TableHead className="w-30 text-center font-bold">BOM List</TableHead>
              <TableHead className="w-40 text-center font-bold">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {branchs && branchs.length > 0 ? (
              branchs.map((branch, index) => {
                const isEditing = editingRowId === branch.projectBranchId;
                const totalQuantityError = fieldErrors?.totalQuantity?.[0];
                const progress =
                  branch.totalQuantity > 0
                    ? ((branch.completedQuantity / branch.totalQuantity) * 100).toFixed(1)
                    : 0;
                return (
                  <TableRow
                    key={branch.projectBranchId}
                    className={`divide-x ${index % 2 === 0 ? 'bg-background' : 'bg-accent/50'} hover:bg-accent`}
                  >
                    <TableCell className="text-center">
                      <div className="relative mx-auto h-30">
                        <Image
                          src="/logo.png"
                          alt="Branch Logo"
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100px, 120px"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{branch.branchCode}</TableCell>
                    <TableCell className="text-center font-medium">todo</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        {isEditing ? (
                          <>
                            <Input
                              type="number"
                              className={`mx-auto h-8 w-20 text-center ${totalQuantityError ? 'border-red-500' : ''}`}
                              value={editFormData.totalQuantity}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  totalQuantity: Number(e.target.value),
                                })
                              }
                              autoFocus
                            />
                            {totalQuantityError && (
                              <p className="mt-1 text-xs text-red-500">{totalQuantityError}</p>
                            )}
                          </>
                        ) : (
                          branch.totalQuantity
                        )}
                      </div>
                    </TableCell>
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
                    <TableCell className="text-center">
                      {isEditing ? (
                        <div className="flex justify-center gap-2">
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleSaveClick(branch.branchTypeId)}
                            disabled={isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={handleCancelClick}
                            disabled={isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <Button
                            size="icon"
                            variant="default"
                            className="h-8 w-8"
                            onClick={() => handleEditClick(branch)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="destructive" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  이 작업은 되돌릴 수 없습니다. 해당 분기 레일 정보가 영구적으로
                                  삭제됩니다.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteClick(branch.projectBranchId)}
                                  disabled={isPending}
                                >
                                  삭제
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
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
