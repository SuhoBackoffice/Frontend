'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CheckCircle2, CalendarIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface BasicInfoSectionProps {
  workDate: string;
  setWorkDate: (date: string) => void;
  workSummary: string;
  setWorkSummary: (summary: string) => void;
  errors?: any;
}

export default function BasicInfoSection({
  workDate,
  setWorkDate,
  workSummary,
  setWorkSummary,
  errors,
}: BasicInfoSectionProps) {
  return (
    <Card
      className={cn(
        errors?.workSummary && 'border-destructive shadow-sm'
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
          <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          기본 정보
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
          <div className="space-y-2 md:col-span-3">
            <Label className="text-muted-foreground ml-1 text-base font-bold">보고 일자</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-11 w-full justify-between text-left font-normal',
                    !workDate && 'text-muted-foreground'
                  )}
                >
                  {workDate ? (
                    format(new Date(workDate), 'yyyy년 MM월 dd일', { locale: ko })
                  ) : (
                    <span>날짜 선택</span>
                  )}
                  <CalendarIcon className="text-muted-foreground h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={workDate ? new Date(workDate) : undefined}
                  onSelect={(date) => date && setWorkDate(format(date, 'yyyy-MM-dd'))}
                  initialFocus
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 오른쪽: 업무 요약 (8/12 공간 차지) */}
          <div className="space-y-2 md:col-span-9">
            <div className="ml-1 flex items-center justify-between">
              <Label
                htmlFor="summary"
                className={cn(
                  'text-base font-bold transition-colors',
                  errors?.workSummary ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                업무 요약 및 특이사항
              </Label>
              {errors?.workSummary && (
                <span className="text-destructive flex animate-pulse items-center gap-1 text-[11px] font-medium">
                  <AlertCircle className="h-3 w-3" /> 필수 입력
                </span>
              )}
            </div>

            <Textarea
              id="summary"
              placeholder={'특이 사항을 적어주세요.\n없다면 공백 ✔'}
              className={cn(
                'min-h-[110px] resize-none text-base leading-relaxed',
                errors?.workSummary && 'border-destructive'
              )}
              value={workSummary}
              onChange={(e) => setWorkSummary(e.target.value)}
            />

              {errors?.workSummary && (
                <p className="text-destructive px-1 text-xs font-semibold">
                  {errors.workSummary[0]}
                </p>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
