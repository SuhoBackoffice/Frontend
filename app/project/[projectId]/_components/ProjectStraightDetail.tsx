'use client';

import { useState, useTransition, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
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
import { updateStraightRailAction } from '@/lib/action/straight.action';
import { deleteProjectStraight } from '@/lib/api/project/project.api';
import { ApiResponse } from '@/types/api.types';
import { ProjectInfoStraightResponse } from '@/types/project/project.types';

interface ProjectStraightProps {
  promiseData: Promise<ApiResponse<ProjectInfoStraightResponse[]>>;
  projectId: number;
}

type EditFormData = {
  totalQuantity: number | '';
};

export default function ProjectStraightDetail({ promiseData, projectId }: ProjectStraightProps) {
  const initialData = use(promiseData).data!;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [straights, setStraights] = useState(initialData);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({ totalQuantity: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const onRegisterClick = () => {
    router.push(`/project/${projectId}/straight/register`);
  };

  const handleEditClick = (straight: ProjectInfoStraightResponse) => {
    setEditingRowId(straight.straightRailId);
    setEditFormData({ totalQuantity: straight.totalQuantity });
    setFieldErrors({});
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
    setFieldErrors({});
  };

  const handleSaveClick = (straightRailId: number) => {
    startTransition(async () => {
      const result = await updateStraightRailAction(straightRailId, editFormData);

      if (result.success) {
        toast.success(result.message);
        setEditingRowId(null);
        setStraights(
          straights.map((straight) =>
            straight.straightRailId === straightRailId
              ? { ...straight, totalQuantity: editFormData.totalQuantity as number }
              : straight
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

  const handleDeleteClick = (straightRailId: number) => {
    startTransition(async () => {
      const result = await deleteProjectStraight(straightRailId);
      if (result.isSuccess) {
        toast.success(result.message);
        setStraights(straights.filter((straight) => straight.straightRailId !== straightRailId));
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>직선 레일</CardTitle>
        <Button variant="outline" onClick={onRegisterClick} className="h-auto px-3 py-1 text-sm">
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
              <TableHead className="w-[120px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {straights && straights.length > 0 ? (
              straights.map((straight) => {
                const isEditing = editingRowId === straight.straightRailId;
                const totalQuantityError = fieldErrors?.totalQuantity?.[0];

                return (
                  <TableRow key={straight.straightRailId} className="divide-x">
                    <TableCell className="text-center">{straight.length}</TableCell>
                    <TableCell className="text-center">{straight.straightType}</TableCell>
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
                          straight.totalQuantity
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {straight.isLoopRail ? '✅' : '❌'}
                    </TableCell>
                    <TableCell className="text-center">
                      {straight.holePosition === 0 ? '❌' : straight.holePosition}
                    </TableCell>
                    <TableCell className="w-13 text-center">{straight.litzInfo.litz1}</TableCell>
                    <TableCell className="w-13 text-center">{straight.litzInfo.litz2}</TableCell>
                    <TableCell className="w-13 text-center">{straight.litzInfo.litz3}</TableCell>
                    <TableCell className="w-13 text-center">{straight.litzInfo.litz4}</TableCell>
                    <TableCell className="w-13 text-center">{straight.litzInfo.litz5}</TableCell>
                    <TableCell className="w-13 text-center">{straight.litzInfo.litz6}</TableCell>
                    <TableCell className="w-40 text-center">
                      {isEditing ? (
                        <div className="flex justify-center gap-2">
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleSaveClick(straight.straightRailId)}
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
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleEditClick(straight)}
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
                                  이 작업은 되돌릴 수 없습니다. 해당 직선 레일 정보가 영구적으로
                                  삭제됩니다.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteClick(straight.straightRailId)}
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
                <TableCell colSpan={13} className="h-24 text-center">
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
