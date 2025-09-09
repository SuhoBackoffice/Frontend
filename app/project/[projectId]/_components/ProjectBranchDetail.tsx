'use client';

import { ApiError, ApiResponse } from '@/types/api.types';
import { ProjectInfoBranchResponse } from '@/types/project/project.types';
import { use, useCallback, useMemo, useState, useTransition } from 'react';
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
import {
  Check,
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from 'lucide-react';
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
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  flexRender,
  getFilteredRowModel,
} from '@tanstack/react-table';

interface ProjectBranchProps {
  promiseData: Promise<ApiResponse<ProjectInfoBranchResponse[]>>;
  projectId: number;
}

type EditFormData = {
  totalQuantity: number | '';
};

type BranchRail = ProjectInfoBranchResponse;

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const onRegisterClick = () => {
    router.push(`/project/${projectId}/branch/register`);
  };

  const handleSaveClick = useCallback(
    (projectBranchId: number) => {
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
    },
    [editFormData, branchs]
  );

  const handleEditClick = useCallback((branch: ProjectInfoBranchResponse) => {
    setEditingRowId(branch.projectBranchId);
    setEditFormData({ totalQuantity: branch.totalQuantity });
    setFieldErrors({});
  }, []);

  const handleCancelClick = useCallback(() => {
    setEditingRowId(null);
    setFieldErrors({});
  }, []);

  const handleDeleteClick = useCallback(
    (projectBranchId: number) => {
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
    },
    [branchs]
  );

  const handleBomListClick = useCallback(async (branchTypeId: number, branchCode: string) => {
    try {
      setIsModalOpen(false);
      setBomData(null);
      setCurrentBranchCode(branchCode);

      const response = await getBranchBomList({ branchTypeId });
      setBomData(response.data);
      setIsModalOpen(true);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : '분기레일 BOM List 조회 실패. 서버 상태가 좋지 않습니다.';
      toast.error(message);
    }
  }, []);

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

  const columns = useMemo<ColumnDef<BranchRail>[]>(
    () => [
      {
        accessorKey: 'image',
        header: '이미지',
        cell: () => (
          <div className="relative mx-auto h-30 w-30">
            <Image
              src="/logo.png"
              alt="Branch Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100px, 120px"
            />
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      { accessorKey: 'branchCode', header: '분기 코드', cell: (info) => info.getValue() },
      { accessorKey: 'branchName', header: '이름', cell: (info) => info.getValue() },
      {
        accessorKey: 'totalQuantity',
        header: '총 수량',
        cell: (info) => {
          const branch = info.row.original;
          const isEditing = editingRowId === branch.projectBranchId;
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
                branch.totalQuantity
              )}
            </div>
          );
        },
      },
      { accessorKey: 'completedQuantity', header: '완료 수량', cell: (info) => info.getValue() },
      {
        id: 'progress',
        accessorFn: (row) =>
          row.totalQuantity > 0
            ? ((row.completedQuantity / row.totalQuantity) * 100).toFixed(1) + '%'
            : '0%',
        header: '진행률',
        cell: (info) => info.getValue(),
      },
      {
        id: 'bomList',
        header: 'BOM List',
        cell: (info) => {
          const branch = info.row.original;
          return (
            <Button
              size="icon"
              className="h-8 w-8"
              variant="outline"
              onClick={() => handleBomListClick(branch.branchTypeId, branch.branchCode)}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        id: 'actions',
        header: '관리',
        cell: (info) => {
          const branch = info.row.original;
          const isEditing = editingRowId === branch.projectBranchId;
          return (
            <div className="text-center">
              {isEditing ? (
                <div className="flex justify-center gap-2">
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleSaveClick(branch.projectBranchId)}
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
                          이 작업은 되돌릴 수 없습니다. 해당 분기 레일 정보가 영구적으로 삭제됩니다.
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
      handleBomListClick,
    ]
  );

  const table = useReactTable({
    data: branchs,
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
        <CardTitle className="justify-self-start">분기 레일</CardTitle>
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
