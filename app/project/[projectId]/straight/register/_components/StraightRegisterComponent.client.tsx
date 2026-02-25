'use client';

import { useEffect, useState, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { createProjectStraightAction, CreateStraightsFormState } from '@/lib/action/project.action';
import { getNormalStraightType, getLoopStraightType } from '@/lib/api/straight/straight.api';
import { StraightTypeResponse } from '@/types/straight/straight.types';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Loader2, ChevronsUpDown, Check, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

// 공통 그리드 컬럼 정의: [번호 | 길이 | 타입 | 수량 | 루프레일 | 삭제]
const GRID_COLS = 'grid-cols-[2rem_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,0.8fr)_6.5rem_2.25rem]';

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

  useEffect(() => {
    const fetchNormalType = async () => {
      try {
        const res = await getNormalStraightType();
        setNormalTypes(res.data!);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : '일반 레일 타입 조회 실패.');
      }
    };
    fetchNormalType();
  }, []);

  useEffect(() => {
    const fetchLoopType = async () => {
      try {
        const res = await getLoopStraightType();
        setLoopTypes(res.data!);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : '루프 레일 타입 조회 실패.');
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
      const list = value ? loopTypes : normalTypes;
      newRows[index].straightTypeId = list[0]?.id || 0;
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
    <form action={formAction}>
      <Card className="w-full">
        {/* ── 헤더 ── */}
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <Ruler className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">직선 레일 일괄 등록</CardTitle>
              <CardDescription className="mt-0.5">
                레일 항목을 추가하고 길이·타입·수량을 입력한 뒤 한 번에 등록하세요.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <input type="hidden" name="straightsData" value={JSON.stringify(rows)} />

          {/* 컬럼 헤더 */}
          <div className={cn('grid items-center gap-2 px-3', GRID_COLS)}>
            <div />
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              길이 (mm)
            </span>
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              타입
            </span>
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              수량
            </span>
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              루프 레일
            </span>
            <div />
          </div>

          {/* 항목 목록 */}
          <div className="space-y-1.5">
            {rows.map((row, index) => {
              const typeOptions = row.isLoopRail ? loopTypes : normalTypes;
              const selectedType = typeOptions.find((t) => t.id === row.straightTypeId);
              const rowErrors = state.errors?.[index];
              const hasError = !!(
                rowErrors?.length ||
                rowErrors?.straightTypeId ||
                rowErrors?.totalQuantity
              );

              return (
                <div
                  key={row.id}
                  className={cn(
                    'grid items-start gap-2 rounded-lg border p-3 transition-colors',
                    GRID_COLS,
                    hasError
                      ? 'border-destructive/40 bg-destructive/5'
                      : 'bg-muted/30 border-transparent'
                  )}
                >
                  {/* 번호 */}
                  <div className="flex h-9 items-center justify-center">
                    <span className="text-muted-foreground text-sm tabular-nums">{index + 1}</span>
                  </div>

                  {/* 길이 */}
                  <div className="space-y-1">
                    <Input
                      type="number"
                      value={row.length}
                      placeholder="3600"
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
                      <p className="text-destructive text-xs">{rowErrors.length}</p>
                    )}
                  </div>

                  {/* 타입 */}
                  <div className="space-y-1">
                    <Popover
                      open={openComboboxIndex === index}
                      onOpenChange={(isOpen) => setOpenComboboxIndex(isOpen ? index : null)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'h-9 w-full justify-between bg-background font-normal',
                            rowErrors?.straightTypeId && 'border-destructive'
                          )}
                        >
                          <span className="truncate">
                            {selectedType ? selectedType.type : '타입 선택...'}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-52 p-0">
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
                                      row.straightTypeId === type.id ? 'opacity-100' : 'opacity-0'
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
                      <p className="text-destructive text-xs">{rowErrors.straightTypeId}</p>
                    )}
                  </div>

                  {/* 수량 */}
                  <div className="space-y-1">
                    <Input
                      type="number"
                      value={row.totalQuantity}
                      placeholder="10"
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
                      <p className="text-destructive text-xs">{rowErrors.totalQuantity}</p>
                    )}
                  </div>

                  {/* 루프 레일 */}
                  <div className="flex h-9 items-center justify-center gap-2">
                    <Checkbox
                      id={`loop-${row.id}`}
                      checked={row.isLoopRail}
                      onCheckedChange={(checked) =>
                        handleRowChange(index, 'isLoopRail', Boolean(checked))
                      }
                    />
                    <Label
                      htmlFor={`loop-${row.id}`}
                      className="cursor-pointer select-none text-sm font-normal"
                    >
                      {row.isLoopRail ? '루프' : '일반'}
                    </Label>
                  </div>

                  {/* 삭제 */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-9 w-9"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* 항목 추가 */}
          <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-1.5">
            <PlusCircle className="h-4 w-4" />
            항목 추가
          </Button>
        </CardContent>

        {/* ── 푸터 ── */}
        <CardFooter className="flex items-center justify-between border-t pt-6">
          <span className="text-muted-foreground text-sm">총 {rows.length}개 항목</span>
          <Button type="submit" disabled={isPending} size="lg" className="min-w-44">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {rows.length}개 레일 등록하기
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
