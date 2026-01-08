'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Search, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import SerialSelectionModal from './SerialSelectionModal';
import {
  getReportableStraightSerialList,
  getReportableBranchSerialList,
} from '@/lib/api/work/report.api';
import {
  GetReportableBranchSerialResponse,
  GetReportableStraightSerialResponse,
} from '@/types/work/report.types';

export default function RailReportSection({
  title,
  type,
  projectId,
  availableRails,
  reports,
  setReports,
  errors,
}: any) {
  const addRow = () => {
    const newRow =
      type === 'straight'
        ? { projectStraightId: 0, productionQuantity: 0, projectStraightSerialIdList: [] }
        : { projectBranchId: 0, productionQuantity: 0, projectBranchSerialIdList: [] };
    setReports([...reports, newRow]);
  };

  return (
    <Card className="border-t-primary border-t-4 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <div className="bg-primary h-2 w-2 rounded-full" />
          {title}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={addRow}
          className="border-primary text-primary hover:bg-primary/5"
        >
          <Plus className="mr-1 h-4 w-4" /> 항목 추가
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {reports.length === 0 ? (
          <div className="text-muted-foreground rounded-xl border-2 border-dashed py-10 text-center text-sm">
            추가된 보고 항목이 없습니다. '항목 추가'를 눌러 작성을 시작하세요.
          </div>
        ) : (
          reports.map((report: any, idx: number) => {
            const railId = type === 'straight' ? report.projectStraightId : report.projectBranchId;
            const currentError = errors?.[`${type}ReportList`]?.[idx];

            return (
              <div
                key={idx}
                className={cn(
                  'relative rounded-xl border p-5 shadow-sm transition-all',
                  currentError
                    ? 'border-destructive bg-destructive/5 ring-destructive/20 ring-1'
                    : 'bg-muted/10 hover:bg-muted/20'
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 absolute top-2 right-2 transition-colors"
                  onClick={() => setReports(reports.filter((_: any, i: any) => i !== idx))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      className={cn(
                        'text-sm font-semibold',
                        (currentError?.projectStraightId || currentError?.projectBranchId) &&
                          'text-destructive'
                      )}
                    >
                      레일 선택
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'bg-background w-full justify-between',
                            (currentError?.projectStraightId || currentError?.projectBranchId) &&
                              'border-destructive'
                          )}
                        >
                          {railId
                            ? availableRails.find(
                                (r: any) => (r.projectStraightId || r.projectBranchId) === railId
                              )?.straightSerial ||
                              availableRails.find(
                                (r: any) => (r.projectStraightId || r.projectBranchId) === railId
                              )?.branchSerial
                            : '레일 시리얼 검색 및 선택...'}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[350px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="시리얼 번호 입력..." />
                          <CommandList>
                            <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                            <CommandGroup heading="보고 가능한 레일 목록">
                              {availableRails.map((rail: any) => {
                                const id = rail.projectStraightId || rail.projectBranchId;
                                const serial = rail.straightSerial || rail.branchSerial;
                                return (
                                  <CommandItem
                                    key={id}
                                    value={serial}
                                    onSelect={() => {
                                      const updated = [...reports];
                                      if (type === 'straight') {
                                        updated[idx].projectStraightId = id;
                                        updated[idx].projectStraightSerialIdList = [];
                                      } else {
                                        updated[idx].projectBranchId = id;
                                        updated[idx].projectBranchSerialIdList = [];
                                      }
                                      setReports(updated);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        railId === id ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span className="font-medium">{serial}</span>
                                      <span className="text-muted-foreground text-[10px]">
                                        가용 수량: {rail.availableQuantity} / 전체:{' '}
                                        {rail.totalQuantity}
                                      </span>
                                    </div>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {(currentError?.projectStraightId || currentError?.projectBranchId) && (
                      <p className="text-destructive animate-in fade-in slide-in-from-top-1 text-[11px] font-medium">
                        항목을 선택해주세요.
                      </p>
                    )}
                  </div>

                  {/* 시리얼 모달 연동 */}
                  <div className="space-y-2">
                    <Label
                      className={cn(
                        'text-sm font-semibold',
                        (currentError?.projectStraightSerialIdList ||
                          currentError?.projectBranchSerialIdList) &&
                          'text-destructive'
                      )}
                    >
                      시리얼 번호 보고
                    </Label>
                    <SerialSelectionContainer
                      type={type}
                      projectId={projectId}
                      railId={railId}
                      selectedIds={
                        type === 'straight'
                          ? report.projectStraightSerialIdList
                          : report.projectBranchSerialIdList
                      }
                      onSelect={(ids: any) => {
                        const updated = [...reports];
                        if (type === 'straight') {
                          updated[idx].projectStraightSerialIdList = ids;
                          updated[idx].productionQuantity = ids.length;
                        } else {
                          updated[idx].projectBranchSerialIdList = ids;
                          updated[idx].productionQuantity = ids.length;
                        }
                        setReports(updated);
                      }}
                      hasError={
                        !!(
                          currentError?.projectStraightSerialIdList ||
                          currentError?.projectBranchSerialIdList
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

// 시리얼 데이터를 비동기로 로드하고 모달로 연결하는 내부 컴포넌트
function SerialSelectionContainer({
  type,
  projectId,
  railId,
  selectedIds,
  onSelect,
  hasError,
}: any) {
  const [serials, setSerials] = useState<
    (GetReportableStraightSerialResponse | GetReportableBranchSerialResponse)[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (railId > 0) {
      setLoading(true);
      const fetchApi =
        type === 'straight' ? getReportableStraightSerialList : getReportableBranchSerialList;
      fetchApi(projectId, railId).then((res) => {
        if (res.isSuccess) setSerials(res.data!);
        setLoading(false);
      });
    } else {
      setSerials([]);
    }
  }, [railId, projectId, type]);

  if (!railId) {
    return (
      <div className="bg-muted/30 text-muted-foreground flex h-10 items-center rounded-md border px-3 text-xs italic">
        레일을 먼저 선택해야 시리얼을 지정할 수 있습니다.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <SerialSelectionModal
        serials={serials}
        selectedIds={selectedIds}
        onSelect={onSelect}
        loading={loading}
      />
      {hasError && (
        <p className="text-destructive animate-in fade-in slide-in-from-top-1 text-[11px] font-medium">
          최소 1개 이상의 시리얼을 선택해야 합니다.
        </p>
      )}
    </div>
  );
}
