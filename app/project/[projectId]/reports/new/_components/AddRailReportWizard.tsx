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
import { Check, ChevronRight, Package, ListChecks, Search } from 'lucide-react';
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

  useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedRail(null);
      setSelectedSerialIds([]);
      setSerialSearch('');
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
    const newItem =
      type === 'straight'
        ? {
            projectStraightId: selectedRail.projectStraightId,
            productionQuantity: selectedSerialIds.length,
            projectStraightSerialIdList: selectedSerialIds,
          }
        : {
            projectBranchId: selectedRail.projectBranchId,
            productionQuantity: selectedSerialIds.length,
            projectBranchSerialIdList: selectedSerialIds,
          };
    onAdd(newItem);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden rounded-[28px] border-none p-0 shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 rounded-2xl p-3">
              {step === 1 ? (
                <Package className="text-primary h-6 w-6" />
              ) : (
                <ListChecks className="text-primary h-6 w-6" />
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight">
                {step === 1 ? '레일 선택' : '시리얼 지정'}
              </DialogTitle>
              <p className="text-muted-foreground mt-0.5 text-sm font-bold">
                {step === 1
                  ? '생산 보고 품목을 선택하세요.'
                  : '생산 완료된 시리얼 번호를 선택하세요.'}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-4 pb-4">
          {step === 1 ? (
            <Command className="bg-transparent">
              <div className="px-4 pb-2">
                <CommandInput
                  placeholder="품번 검색..."
                  className="h-12 border-none text-base focus:ring-0"
                />
              </div>
              <CommandList className="custom-scrollbar max-h-[380px] px-2">
                <CommandEmpty className="text-muted-foreground/50 py-12 text-center font-bold">
                  결과가 없습니다.
                </CommandEmpty>
                <CommandGroup>
                  {filteredRails.map((rail: any) => (
                    <CommandItem
                      key={rail.projectStraightId || rail.projectBranchId}
                      onSelect={() => handleSelectRail(rail)}
                      className="border-border hover:bg-accent aria-selected:bg-accent mb-2 flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-black tracking-tight">
                          {rail.straightSerial || rail.branchSerial}
                        </span>
                        <span className="bg-secondary text-secondary-foreground w-fit rounded-full px-2 py-0.5 text-[11px] font-black uppercase">
                          보고 가능 {rail.availableQuantity}개
                        </span>
                      </div>
                      <ChevronRight className="text-muted-foreground/50 h-5 w-5" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-4 px-4 duration-300">
              <div className="bg-secondary/50 flex items-center gap-3 rounded-2xl p-2">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    className="h-10 border-none bg-transparent pl-9 text-base font-bold focus-visible:ring-0"
                    value={serialSearch}
                    onChange={(e) => setSerialSearch(e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  onClick={toggleAllSerials}
                  className={cn(
                    'h-10 rounded-xl px-4 font-black transition-all',
                    isAllSelected
                      ? 'text-primary hover:text-primary hover:bg-primary/5'
                      : 'text-muted-foreground'
                  )}
                >
                  {isAllSelected ? '전체 해제' : '전체 선택'}
                </Button>
              </div>

              <div className="custom-scrollbar grid max-h-[320px] grid-cols-2 gap-3 overflow-y-auto pr-1 pb-2">
                {filteredSerials.map((s: any) => {
                  const id = s.straightSerialId || s.branchSerialId;
                  const isSelected = selectedSerialIds.includes(id);
                  return (
                    <div
                      key={id}
                      onClick={() =>
                        isSelected
                          ? setSelectedSerialIds(selectedSerialIds.filter((v) => v !== id))
                          : setSelectedSerialIds([...selectedSerialIds, id])
                      }
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-[20px] border-2 p-4 transition-all duration-200',
                        isSelected
                          ? 'border-primary bg-primary/[0.03]'
                          : 'border-border bg-card hover:border-muted-foreground/30'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all',
                          isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                        )}
                      >
                        {isSelected && (
                          <Check className="text-primary-foreground h-4 w-4 stroke-[3px]" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-base font-black tracking-tight',
                          isSelected ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {s.serial}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-border flex items-center justify-between border-t px-8 py-5">
          <div className="flex-1">
            {step === 2 && (
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="text-muted-foreground hover:text-foreground h-11 px-0 font-black hover:bg-transparent"
              >
                ← 레일 다시 선택
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground h-11 rounded-xl px-6 font-black"
            >
              취소
            </Button>
            {step === 2 && (
              <Button
                disabled={selectedSerialIds.length === 0}
                onClick={handleFinalAdd}
                className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 h-11 rounded-xl px-8 font-black shadow-lg transition-all disabled:opacity-30"
              >
                {selectedSerialIds.length}개 추가 완료
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
