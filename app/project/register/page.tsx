'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { getVersionInfo } from '@/lib/api/version/version.api';
import { VersionInfoResponse } from '@/types/version/version.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
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

import { withAuth } from '@/lib/hooks/withAuth';
import { createProjectAction, NewProjectFormState } from '@/lib/action/project.action';

const initialState: NewProjectFormState = {
  message: '',
  errors: {},
  success: false,
};

function ProjectRegister() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createProjectAction, initialState);

  const [versions, setVersions] = useState<VersionInfoResponse[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [versionId, setVersionId] = useState('');

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await getVersionInfo();
        if (response.data) {
          setVersions(response.data);
        }
      } catch {
        toast.error('Version 정보를 불러오는 데 실패했습니다.');
      }
    };
    fetchVersions();
  }, []);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || '프로젝트가 성공적으로 등록되었습니다.');
      setTimeout(() => router.push('/project'), 1000);
    }
  }, [state.success, state.message, router]);

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">새 프로젝트 등록</h1>
        <p className="text-muted-foreground">프로젝트 정보를 입력하여 등록을 완료하세요.</p>
      </div>

      <form action={formAction} className="space-y-6">
        {state.message && !state.success && (
          <Alert variant="destructive">
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="versionId">버전 정보</Label>
          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={comboboxOpen}
                className="w-full justify-between font-normal"
              >
                {versionId ? versions.find((v) => v.id.toString() === versionId)?.name : '예: v8.0'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Version 검색..." />
                <CommandList>
                  <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                  <CommandGroup>
                    {versions.map((version) => (
                      <CommandItem
                        key={version.id}
                        value={version.name}
                        onSelect={() => {
                          setVersionId(version.id.toString());
                          setComboboxOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            versionId === version.id.toString() ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {version.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/* Hidden input to send the selected ID to the server action */}
          <input type="hidden" name="versionId" value={versionId} />
          {state.errors?.versionId && (
            <p className="text-destructive text-sm">{state.errors.versionId[0]}</p>
          )}
        </div>

        {/* Other Form Fields */}
        <div className="space-y-2">
          <Label htmlFor="region">지역</Label>
          <Input id="region" name="region" placeholder="예: 평택, 천안" />
          {state.errors?.region && (
            <p className="text-destructive text-sm">{state.errors.region[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">프로젝트명</Label>
          <Input id="name" name="name" placeholder="예: P3 서편" />
          {state.errors?.name && <p className="text-destructive text-sm">{state.errors.name[0]}</p>}
        </div>

        {/* Date Pickers */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">시작일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'yyyy-MM-dd') : <span>날짜 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
            <input
              type="hidden"
              name="startDate"
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
            />
            {state.errors?.startDate && (
              <p className="text-destructive text-sm">{state.errors.startDate[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">종료일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'yyyy-MM-dd') : <span>날짜 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
            <input
              type="hidden"
              name="endDate"
              value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
            />
            {state.errors?.endDate && (
              <p className="text-destructive text-sm">{state.errors.endDate[0]}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          프로젝트 등록
        </Button>
      </form>
    </div>
  );
}

export default withAuth(ProjectRegister, ['admin', '관리자']);
