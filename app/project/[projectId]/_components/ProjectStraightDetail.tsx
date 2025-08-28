'use client';

import { useState, useTransition, use, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from 'lucide-react';
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
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  flexRender,
  getFilteredRowModel,
} from '@tanstack/react-table';

interface ProjectStraightProps {
  promiseData: Promise<ApiResponse<ProjectInfoStraightResponse[]>>;
  projectId: number;
}

type EditFormData = {
  totalQuantity: number | '';
};

type StraightRail = ProjectInfoStraightResponse;

export default function ProjectStraightDetail({ promiseData, projectId }: ProjectStraightProps) {
  const initialData = use(promiseData).data!;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [straights, setStraights] = useState(initialData);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({ totalQuantity: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const onRegisterClick = () => {
    router.push(`/project/${projectId}/straight/register`);
  };

  const handleEditClick = useCallback((straight: StraightRail) => {
    setEditingRowId(straight.straightRailId);
    setEditFormData({ totalQuantity: straight.totalQuantity });
    setFieldErrors({});
  }, []);

  const handleCancelClick = useCallback(() => {
    setEditingRowId(null);
    setFieldErrors({});
  }, []);

  const handleSaveClick = useCallback(
    (straightRailId: number) => {
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
    },
    [editFormData, straights]
  );

  const handleDeleteClick = useCallback(
    (straightRailId: number) => {
      startTransition(async () => {
        const result = await deleteProjectStraight(straightRailId);
        if (result.isSuccess) {
          toast.success(result.message);
          setStraights(straights.filter((straight) => straight.straightRailId !== straightRailId));
        } else {
          toast.error(result.message);
        }
      });
    },
    [straights]
  );

  const columns = useMemo<ColumnDef<StraightRail>[]>(
    () => [
      { accessorKey: 'length', header: '길이', cell: (info) => info.getValue() },
      { accessorKey: 'straightType', header: '타입', cell: (info) => info.getValue() },
      {
        accessorKey: 'totalQuantity',
        header: '수량',
        cell: (info) => {
          const straight = info.row.original;
          const isEditing = editingRowId === straight.straightRailId;
          const totalQuantityError = fieldErrors?.totalQuantity?.[0];
          return (
            <div className="flex flex-col items-center">
              {isEditing ? (
                <>
                  <Input
                    type="number"
                    className={`mx-auto h-8 w-20 text-center ${totalQuantityError ? 'border-red-500' : ''}`}
                    value={editFormData.totalQuantity}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, totalQuantity: Number(e.target.value) })
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
          );
        },
      },
      {
        accessorKey: 'isLoopRail',
        header: '루프레일',
        cell: (info) => (info.getValue() ? '✅' : '❌'),
      },
      {
        accessorKey: 'holePosition',
        header: '가공',
        cell: (info) => (info.getValue() === 0 ? '❌' : info.getValue()),
      },
      { accessorKey: 'litzInfo.litz1', header: 'Litz1', cell: (info) => info.getValue() },
      { accessorKey: 'litzInfo.litz2', header: 'Litz2', cell: (info) => info.getValue() },
      { accessorKey: 'litzInfo.litz3', header: 'Litz3', cell: (info) => info.getValue() },
      { accessorKey: 'litzInfo.litz4', header: 'Litz4', cell: (info) => info.getValue() },
      { accessorKey: 'litzInfo.litz5', header: 'Litz5', cell: (info) => info.getValue() },
      { accessorKey: 'litzInfo.litz6', header: 'Litz6', cell: (info) => info.getValue() },
      {
        id: 'actions',
        header: '관리',
        cell: (info) => {
          const straight = info.row.original;
          const isEditing = editingRowId === straight.straightRailId;
          return (
            <div className="text-center">
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
                    variant="default"
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
                          이 작업은 되돌릴 수 없습니다. 해당 직선 레일 정보가 영구적으로 삭제됩니다.
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
            </div>
          );
        },
      },
    ],
    [
      editingRowId,
      fieldErrors,
      isPending,
      editFormData,
      handleSaveClick,
      handleEditClick,
      handleCancelClick,
      handleDeleteClick,
    ]
  );

  const table = useReactTable({
    data: straights,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card>
      <CardHeader className="grid grid-cols-[120px_auto_auto] items-center gap-4 text-2xl font-bold">
        <CardTitle className="justify-self-start">직선 레일</CardTitle>
        <div className="justify-self-start">
          <Input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="키워드를 입력해 주세요..."
            className="h-10 w-80 !text-xl"
          />
        </div>
        <div className="justify-self-end">
          <Button variant="default" onClick={onRegisterClick} className="h-auto px-3 py-1 text-lg">
            <Plus className="mr-2 h-4 w-4" />
            추가 등록
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table className="border text-lg [&_td]:px-2 [&_td]:py-1 [&_th]:px-2 [&_th]:py-1">
          <TableHeader className="border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="divide-x">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="w-auto text-center font-bold"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className="flex cursor-pointer items-center justify-center select-none"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() &&
                          (header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="ml-2 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-2 h-4 w-4" />
                          ))}
                        {!header.column.getIsSorted() && (
                          <ChevronsUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`divide-x ${row.index % 2 === 0 ? 'bg-background' : 'bg-accent/50'} hover:bg-accent`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
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
