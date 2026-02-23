'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronRight, Package, ListChecks, Search, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getReportableStraightSerialList,
  getReportableBranchSerialList,
} from '@/lib/api/work/report.api';
import { Input } from '@/components/ui/input';

export default function AddRailReportWizard({
  open,
  onOpenChange,
  type,
  projectId,
  availableRails,
  existingReports,
  onAdd,
}: any) {
  const [step, setStep] = useState(1);
  const [selectedRail, setSelectedRail] = useState<any>(null);
  const [selectedSerialIds, setSelectedSerialIds] = useState<number[]>([]);
  const [serials, setSerials] = useState<any[]>([]);
  const [loadingSerials, setLoadingSerials] = useState(false);
  const [serialSearch, setSerialSearch] = useState('');
  const [rangeStart, setRangeStart] = useState<string>('');
  const [rangeEnd, setRangeEnd] = useState<string>('');

  useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedRail(null);
      setSelectedSerialIds([]);
      setSerialSearch('');
      setRangeStart('');
      setRangeEnd('');
    }
  }, [open]);

  const existingIds = existingReports.map((r: any) =>
    type === 'straight' ? r.projectStraightId : r.projectBranchId
  );
  const filteredRails = availableRails.filter(
    (r: any) => !existingIds.includes(r.projectStraightId || r.projectBranchId)
  );
  const filteredSerials = serials.filter((s: any) =>
    s.serial.toLowerCase().includes(serialSearch.toLowerCase())
  );
  const isAllSelected =
    filteredSerials.length > 0 &&
    filteredSerials.every((s) =>
      selectedSerialIds.includes(s.straightSerialId || s.branchSerialId)
    );

  const toggleAllSerials = () => {
    const currentPageIds = filteredSerials.map((s) => s.straightSerialId || s.branchSerialId);
    if (isAllSelected) {
      setSelectedSerialIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedSerialIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  /** 시리얼 문자열에서 끝 번호 추출 (예: "SR3600A-05" → 5, "SR3600A-66" → 66) */
  const getSerialNumber = (serial: string): number | null => {
    const match = serial.match(/-?(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  };

  const applyRangeSelect = () => {
    const start = rangeStart.trim() === '' ? null : parseInt(rangeStart, 10);
    const end = rangeEnd.trim() === '' ? null : parseInt(rangeEnd, 10);
    if (start == null || end == null || !Number.isInteger(start) || !Number.isInteger(end)) return;
    const low = Math.min(start, end);
    const high = Math.max(start, end);

    const idsInRange = serials
      .filter((s) => {
        const num = getSerialNumber(s.serial);
        return num != null && num >= low && num <= high;
      })
      .map((s) => s.straightSerialId || s.branchSerialId);

    setSelectedSerialIds((prev) => Array.from(new Set([...prev, ...idsInRange])));
  };

  const handleSelectRail = (rail: any) => {
    setSelectedRail(rail);
    setLoadingSerials(true);
    const railId = rail.projectStraightId || rail.projectBranchId;
    const fetchApi =
      type === 'straight' ? getReportableStraightSerialList : getReportableBranchSerialList;

    fetchApi(projectId, railId).then((res) => {
      if (res.isSuccess) setSerials(res.data!);
      setLoadingSerials(false);
      setStep(2);
    });
  };

  const handleFinalAdd = () => {
    const selectedSerialsData = serials.filter((s) =>
      selectedSerialIds.includes(s.straightSerialId || s.branchSerialId)
    );

    const serialLabels = selectedSerialsData.map((s) => s.serial);

    const newItem =
      type === 'straight'
        ? {
            projectStraightId: selectedRail.projectStraightId,
            productionQuantity: selectedSerialIds.length,
            projectStraightSerialIdList: selectedSerialIds,
            serialLabels: serialLabels,
          }
        : {
            projectBranchId: selectedRail.projectBranchId,
            productionQuantity: selectedSerialIds.length,
            projectBranchSerialIdList: selectedSerialIds,
            serialLabels: serialLabels,
          };
    onAdd(newItem);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              {step === 1 ? <Package className="h-5 w-5" /> : <ListChecks className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {step === 1 ? '품목 선택' : '시리얼 지정'}
              </DialogTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {step === 1
                  ? '생산 보고 품목을 선택하세요.'
                  : '생산 완료된 시리얼 번호를 선택하세요.'}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pt-4 pb-6">
          {step === 1 ? (
            <Command className="rounded-lg border">
              <CommandInput placeholder="품번 검색..." className="h-10" />
              <CommandList className="max-h-[400px]">
                <CommandEmpty className="text-muted-foreground py-10 text-center text-sm">
                  결과가 없습니다.
                </CommandEmpty>
                <CommandGroup>
                  {filteredRails.map((rail: any) => (
                    <CommandItem
                      key={rail.projectStraightId || rail.projectBranchId}
                      onSelect={() => handleSelectRail(rail)}
                      className="aria-selected:bg-accent hover:bg-accent flex cursor-pointer items-center justify-between rounded-lg border border-transparent px-4 py-3"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold">
                          {rail.straightSerial || rail.branchSerial}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          보고 가능 {rail.availableQuantity}개
                        </span>
                      </div>
                      <ChevronRight className="text-muted-foreground h-4 w-4" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/20 flex flex-wrap items-center gap-2 rounded-lg border p-2">
                <div className="bg-background flex items-center gap-2 rounded-md border px-3 py-1.5">
                  <span className="text-muted-foreground text-sm">선택됨</span>
                  <span className="text-foreground text-sm font-semibold">
                    {selectedSerialIds.length}/{serials.length}개
                  </span>
                </div>
                <div className="bg-background flex items-center gap-2 rounded-md border px-3 py-1.5">
                  <ListOrdered className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span className="text-muted-foreground shrink-0 text-sm">범위</span>
                  <Input
                    type="number"
                    min={1}
                    placeholder="1"
                    className="h-7 w-14 text-center text-sm"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                  />
                  <span className="text-muted-foreground text-xs">~</span>
                  <Input
                    type="number"
                    min={1}
                    placeholder="90"
                    className="h-7 w-14 text-center text-sm"
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 shrink-0 px-2 text-xs"
                    onClick={applyRangeSelect}
                  >
                    적용
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'bg-background h-7 shrink-0 rounded-md border px-3 text-sm',
                    isAllSelected && 'border-primary bg-primary/10 text-primary'
                  )}
                  onClick={toggleAllSerials}
                >
                  {isAllSelected ? '전체 해제' : `전체 선택 (${filteredSerials.length}개)`}
                </Button>
              </div>

              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="시리얼 번호 검색..."
                  className="h-9 pl-9"
                  value={serialSearch}
                  onChange={(e) => setSerialSearch(e.target.value)}
                />
              </div>

              <div className="custom-scrollbar grid max-h-[380px] grid-cols-2 gap-2 overflow-y-auto rounded-lg border p-2">
                {filteredSerials.map((s: any) => {
                  const id = s.straightSerialId || s.branchSerialId;
                  const isSelected = selectedSerialIds.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        isSelected
                          ? setSelectedSerialIds(selectedSerialIds.filter((v) => v !== id))
                          : setSelectedSerialIds([...selectedSerialIds, id])
                      }
                      className={cn(
                        'hover:bg-muted/50 flex min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors',
                        isSelected ? 'border-primary bg-primary/5' : 'border-border bg-background'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded border',
                          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/50'
                        )}
                      >
                        {isSelected && (
                          <Check className="text-primary-foreground h-3 w-3 stroke-[2.5px]" />
                        )}
                      </span>
                      <span
                        className={cn(
                          'min-w-0 truncate text-sm font-medium',
                          isSelected ? 'text-primary' : 'text-foreground'
                        )}
                        title={s.serial}
                      >
                        {s.serial}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <div className="flex w-full items-center justify-between gap-4">
            {step === 2 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                className="text-muted-foreground -ml-2"
              >
                ← 레일 다시 선택
              </Button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                취소
              </Button>
              {step === 2 && (
                <Button
                  size="sm"
                  disabled={selectedSerialIds.length === 0}
                  onClick={handleFinalAdd}
                >
                  {selectedSerialIds.length}개 추가 완료
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
