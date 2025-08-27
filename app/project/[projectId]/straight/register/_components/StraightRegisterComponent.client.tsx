'use client';

import { useEffect, useState, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { createProjectStraightAction, CreateStraightsFormState } from '@/lib/action/project.action';
import { getNormalStraightType, getLoopStraightType } from '@/lib/api/straight/straight.api';
import { StraightTypeResponse } from '@/types/straight/straight.types';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Loader2, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import AuthGuard from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ApiError } from '@/types/api.types';
import { PostProjectStraightRequest } from '@/types/project/project.types';

type StraightRow = Omit<PostProjectStraightRequest, 'length' | 'totalQuantity'> & {
  id: string;
  length: number | '';
  totalQuantity: number | '';
};

const initialState: CreateStraightsFormState = {
  message: '',
  success: false,
};

const createNewRow = (): StraightRow => ({
  id: crypto.randomUUID(),
  length: '',
  straightTypeId: 0,
  totalQuantity: '',
  isLoopRail: false,
});

interface Props {
  projectId: number;
}

export default function StraightRegisterComponent({ projectId }: Props) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    createProjectStraightAction.bind(null, projectId),
    initialState
  );

  const [rows, setRows] = useState<StraightRow[]>([createNewRow()]);
  const [normalTypes, setNormalTypes] = useState<StraightTypeResponse[]>([]);
  const [loopTypes, setLoopTypes] = useState<StraightTypeResponse[]>([]);
  const [openComboboxIndex, setOpenComboboxIndex] = useState<number | null>(null);

  // 일반 레일 타입 조회
  useEffect(() => {
    const fetchNormalType = async () => {
      try {
        const normalRes = await getNormalStraightType();
        setNormalTypes(normalRes.data!);
        if (normalRes.message) toast.success(normalRes.message);
      } catch (err) {
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error('일반 레일 타입 조회 실패. 서버 상태가 좋지 않습니다.');
        }
      }
    };
    fetchNormalType();
  }, []);

  // 루프 레일 타입 조회
  useEffect(() => {
    const fetchLoopType = async () => {
      try {
        const loopRes = await getLoopStraightType();
        setLoopTypes(loopRes.data!);
        if (loopRes.message) toast.success(loopRes.message);
      } catch (err) {
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error('루프 레일 타입 조회 실패. 서버 상태가 좋지 않습니다.');
        }
      }
    };
    fetchLoopType();
  }, []);

  const handleRowChange = (
    index: number,
    field: keyof StraightRow,
    value: string | number | boolean
  ) => {
    const newRows = [...rows];
    newRows[index][field] = value as never;

    if (field === 'isLoopRail') {
      const newTypeList = value ? loopTypes : normalTypes;
      newRows[index].straightTypeId = newTypeList[0]?.id || 0;
    }

    setRows(newRows);
  };

  const addRow = () => setRows((prev) => [...prev, createNewRow()]);
  const removeRow = (id: string) => setRows((prev) => prev.filter((row) => row.id !== id));

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || '등록이 완료되었습니다.');
      const to = setTimeout(() => router.push(`/project/${projectId}`), 1000);
      return () => clearTimeout(to);
    }
  }, [state.success, state.message, router, projectId]);

  return (
    <AuthGuard allowedRoles={['admin', '관리자']}>
      <div className="container mx-auto max-w-4xl py-8">
        <form action={formAction}>
          <Card>
            <CardHeader>
              <CardTitle>신규 직선 레일 등록</CardTitle>
            </CardHeader>
            <CardContent>
              {state.message && !state.success && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}

              {/* 서버 액션으로 전달할 페이로드 */}
              <input type="hidden" name="straightsData" value={JSON.stringify(rows)} />

              <Table className="border text-sm">
                <TableHeader>
                  <TableRow className="divide-x">
                    <TableHead>길이 (mm)</TableHead>
                    <TableHead>타입</TableHead>
                    <TableHead>수량</TableHead>
                    <TableHead>루프레일</TableHead>
                    <TableHead className="w-[50px]">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, index) => {
                    const typeOptions = row.isLoopRail ? loopTypes : normalTypes;
                    const selectedType = typeOptions.find((t) => t.id === row.straightTypeId);
                    const rowErrors = state.errors?.[index];

                    return (
                      <TableRow key={row.id} className="divide-x">
                        <TableCell>
                          <Input
                            type="number"
                            value={row.length}
                            placeholder="예: 3600"
                            onChange={(e) =>
                              handleRowChange(
                                index,
                                'length',
                                e.target.value === '' ? '' : Number(e.target.value)
                              )
                            }
                            className={cn('h-9', rowErrors?.length && 'border-destructive')}
                          />
                          {rowErrors?.length && (
                            <p className="text-destructive mt-1 text-xs">{rowErrors.length}</p>
                          )}
                        </TableCell>

                        <TableCell>
                          <Popover
                            open={openComboboxIndex === index}
                            onOpenChange={(isOpen) => setOpenComboboxIndex(isOpen ? index : null)}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'h-9 w-full justify-between font-normal',
                                  rowErrors?.straightTypeId && 'border-destructive'
                                )}
                              >
                                {selectedType ? selectedType.type : '타입 선택...'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                              <Command>
                                <CommandInput placeholder="타입 검색..." />
                                <CommandList>
                                  <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                                  <CommandGroup>
                                    {typeOptions.map((type) => (
                                      <CommandItem
                                        key={type.id}
                                        value={type.type}
                                        onSelect={() => {
                                          handleRowChange(index, 'straightTypeId', type.id);
                                          setOpenComboboxIndex(null);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            row.straightTypeId === type.id
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {type.type}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {rowErrors?.straightTypeId && (
                            <p className="text-destructive mt-1 text-xs">
                              {rowErrors.straightTypeId}
                            </p>
                          )}
                        </TableCell>

                        <TableCell>
                          <Input
                            type="number"
                            value={row.totalQuantity}
                            placeholder="예: 10"
                            onChange={(e) =>
                              handleRowChange(
                                index,
                                'totalQuantity',
                                e.target.value === '' ? '' : Number(e.target.value)
                              )
                            }
                            className={cn('h-9', rowErrors?.totalQuantity && 'border-destructive')}
                          />
                          {rowErrors?.totalQuantity && (
                            <p className="text-destructive mt-1 text-xs">
                              {rowErrors.totalQuantity}
                            </p>
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          <Checkbox
                            checked={row.isLoopRail}
                            onCheckedChange={(checked) =>
                              handleRowChange(index, 'isLoopRail', Boolean(checked))
                            }
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => removeRow(row.id)}
                            disabled={rows.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addRow}>
                <PlusCircle className="mr-2 h-4 w-4" /> 행 추가
              </Button>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                등록하기
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AuthGuard>
  );
}
