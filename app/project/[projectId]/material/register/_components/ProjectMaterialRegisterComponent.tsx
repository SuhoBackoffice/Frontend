'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { getMaterialSearch } from '@/lib/api/material/material.api';
import type { GetMaterialSearchResponse } from '@/types/material/material.types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  PlusCircle,
  Trash2,
  Search,
  ClipboardList,
  DraftingCompass,
  Boxes,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';
import { SubmitButton } from './SubmitButton';
import { ApiError } from '@/types/api.types';
import { createMaterialInboundAction } from '@/lib/action/material.action';
import { useRouter } from 'next/navigation';

interface MaterialRow {
  id: string;
  drawingNumber: string;
  itemName: string;
  quantity: string;
  isManual: boolean;
}

interface ProjectMaterialRegisterComponentProps {
  projectId: number;
}

export default function ProjectMaterialRegisterComponent({
  projectId,
}: ProjectMaterialRegisterComponentProps) {
  const router = useRouter();
  const [rows, setRows] = useState<MaterialRow[]>([]);
  const [state, formAction] = useActionState(createMaterialInboundAction.bind(null, projectId), {
    message: '',
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  const [searchPopoverOpen, setSearchPopoverOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const [searchResults, setSearchResults] = useState<GetMaterialSearchResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleAddFromSearch = (result: GetMaterialSearchResponse) => {
    if (rows.some((row) => row.drawingNumber === result.drawingNumber)) {
      toast.warning('이미 목록에 추가된 자재입니다.');
      return;
    }
    const newRow: MaterialRow = {
      id: crypto.randomUUID(),
      drawingNumber: result.drawingNumber,
      itemName: result.itemName,
      quantity: '0',
      isManual: false,
    };
    setRows((prevRows) => [...prevRows, newRow]);
    setSearchKeyword('');
    setSearchPopoverOpen(false);
  };

  const handleAddManualRow = () => {
    const newRow: MaterialRow = {
      id: crypto.randomUUID(),
      drawingNumber: '',
      itemName: '',
      quantity: '0',
      isManual: true,
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleRowChange = (id: string, field: keyof MaterialRow, value: string) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setRows([]);
    } else if (state.message && !state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    const updateWidth = () => {
      if (triggerRef.current) {
        setContentWidth(triggerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const search = async () => {
      setIsSearching(true);
      try {
        const response = await getMaterialSearch({ projectId, keyword: debouncedKeyword });
        if (response.isSuccess && response.data) {
          setSearchResults(response.data);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : '검색 중 오류가 발생했습니다.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    if (debouncedKeyword.length >= 2) {
      setSearchPopoverOpen(true);
      search();
    } else {
      setSearchPopoverOpen(false);
      setSearchResults([]);
    }
  }, [debouncedKeyword, projectId]);

  useEffect(() => {
    if (searchPopoverOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchPopoverOpen]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || '자재 입고 등록 완료!!');
      setTimeout(() => router.push(`/project/${projectId}/material`), 1000);
    }
  }, [state.success, state.message, router, projectId]);

  return (
    <form action={formAction}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">자재 입고 등록</CardTitle>
          <CardDescription className="pt-1 text-base">
            아래 검색창을 통해 자재를 추가하거나, 수동으로 입력하여 등록할 수 있습니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* 1. 자재 검색 영역 */}
          <div className="space-y-2">
            <label className="text-base font-semibold">자재 검색</label>
            <Popover open={searchPopoverOpen} onOpenChange={setSearchPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="relative" ref={triggerRef}>
                  <Search className="text-muted-foreground absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2" />
                  <Input
                    placeholder="두 글자 이상 입력하여 자재 검색..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="h-11 pl-10 text-base"
                    ref={searchInputRef}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent style={{ width: `${contentWidth}px` }} className="p-1" align="start">
                <div>
                  {isSearching ? (
                    <div className="text-muted-foreground p-2 text-center text-sm">검색 중...</div>
                  ) : searchResults.length > 0 ? (
                    <ul className="max-h-60 overflow-y-auto" key={JSON.stringify(searchResults)}>
                      {searchResults.map((result) => (
                        <li
                          key={result.id}
                          onClick={() => handleAddFromSearch(result)}
                          className="hover:bg-accent cursor-pointer rounded-sm px-2 py-1.5 text-sm"
                        >
                          {result.drawingNumber} ({result.itemName})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted-foreground p-2 text-center text-sm">
                      {debouncedKeyword.length < 2
                        ? '검색어는 최소 2글자 이상입니다.'
                        : '검색 결과가 없습니다.'}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* 2. 등록할 자재 목록 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6" />
                <h3 className="text-xl font-semibold tracking-tight">등록할 자재 목록</h3>
              </div>
              <Button variant="outline" type="button" onClick={handleAddManualRow}>
                <PlusCircle className="mr-2 h-4 w-4" />
                수동으로 추가
              </Button>
            </div>

            <div className="space-y-3">
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <div
                    key={row.id}
                    className="bg-muted/20 grid grid-cols-1 items-start gap-4 rounded-lg border p-4 md:grid-cols-[1fr_1fr_150px_auto]"
                  >
                    {/* 도면 번호 */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                        <DraftingCompass className="h-4 w-4" /> 도면 번호
                      </label>
                      <Input
                        value={row.drawingNumber}
                        onChange={(e) => handleRowChange(row.id, 'drawingNumber', e.target.value)}
                        readOnly={!row.isManual}
                      />
                      {state.errors?.[index]?.drawingNumber && (
                        <p className="text-destructive mt-1 text-sm">
                          {state.errors[index].drawingNumber}
                        </p>
                      )}
                    </div>
                    {/* 품명 */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                        <Package className="h-4 w-4" /> 품명
                      </label>
                      <Input
                        value={row.itemName}
                        onChange={(e) => handleRowChange(row.id, 'itemName', e.target.value)}
                        readOnly={!row.isManual}
                      />
                      {state.errors?.[index]?.itemName && (
                        <p className="text-destructive mt-1 text-sm">
                          {state.errors[index].itemName}
                        </p>
                      )}
                    </div>
                    {/* 수량 */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                        <Boxes className="h-4 w-4" /> 수량
                      </label>
                      <Input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => handleRowChange(row.id, 'quantity', e.target.value)}
                      />
                      {state.errors?.[index]?.quantity && (
                        <p className="text-destructive mt-1 text-sm">
                          {state.errors[index].quantity}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => handleRemoveRow(row.id)}
                      className="mt-6 self-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center">
                  <ClipboardList className="text-muted-foreground/50 h-10 w-10" />
                  <p className="mt-4 text-base font-semibold">등록할 자재가 없습니다</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    상단에서 검색하거나 수동으로 자재를 추가해주세요.
                  </p>
                </div>
              )}
            </div>
          </div>

          <input
            type="hidden"
            name="materialsData"
            value={JSON.stringify(rows.map(({ id, isManual, ...rest }) => rest))}
          />
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-6">
          {state.message && !state.success && (
            <p className="text-destructive mr-4 text-sm">{state.message}</p>
          )}
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
