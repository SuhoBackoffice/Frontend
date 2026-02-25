'use client';

import { useState } from 'react';
import { Search, X, CalendarIcon, ChevronDown, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { VersionInfoResponse } from '@/types/version/version.types';
import { ProjectSearchSortResponse } from '@/types/project/project.types';

interface ProjectFilterBarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  versionId: number | undefined;
  onVersionChange: (value: number | undefined) => void;
  sort: string;
  onSortChange: (value: string) => void;
  startDate: string | undefined;
  onStartDateChange: (value: string | undefined) => void;
  endDate: string | undefined;
  onEndDateChange: (value: string | undefined) => void;
  versions: VersionInfoResponse[];
  sortOptions: ProjectSearchSortResponse[];
}

export function ProjectFilterBar({
  keyword,
  onKeywordChange,
  versionId,
  onVersionChange,
  sort,
  onSortChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  versions,
  sortOptions,
}: ProjectFilterBarProps) {
  const [versionOpen, setVersionOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const selectedVersion = versions.find((v) => v.id === versionId);
  const selectedSort = sortOptions.find((s) => s.id === sort);
  const hasActiveFilters = !!versionId || !!startDate || !!endDate;

  const handleClearFilters = () => {
    onVersionChange(undefined);
    onStartDateChange(undefined);
    onEndDateChange(undefined);
  };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="프로젝트명, 지역 등 검색..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="h-11 bg-muted/40 pl-10 pr-10 focus-visible:bg-background transition-colors"
        />
        {keyword && (
          <button
            onClick={() => onKeywordChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Version Combobox */}
        <Popover open={versionOpen} onOpenChange={setVersionOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-8 gap-1.5 text-xs font-normal',
                versionId && 'border-primary/50 bg-primary/5 text-primary hover:bg-primary/10'
              )}
            >
              {selectedVersion ? selectedVersion.name : '버전'}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-0" align="start">
            <Command>
              <CommandInput placeholder="버전 검색..." className="h-8 text-sm" />
              <CommandList>
                <CommandEmpty>결과 없음</CommandEmpty>
                <CommandGroup>
                  {versionId && (
                    <CommandItem
                      onSelect={() => {
                        onVersionChange(undefined);
                        setVersionOpen(false);
                      }}
                      className="text-muted-foreground text-xs"
                    >
                      <X className="mr-2 h-3 w-3" />
                      전체 보기
                    </CommandItem>
                  )}
                  {versions.map((version) => (
                    <CommandItem
                      key={version.id}
                      value={version.name}
                      onSelect={() => {
                        onVersionChange(version.id);
                        setVersionOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-3.5 w-3.5',
                          versionId === version.id ? 'opacity-100' : 'opacity-0'
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

        {/* Sort Combobox */}
        <Popover open={sortOpen} onOpenChange={setSortOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-normal">
              {selectedSort ? selectedSort.name : '정렬'}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup>
                  {sortOptions.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.name}
                      onSelect={() => {
                        onSortChange(option.id);
                        setSortOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-3.5 w-3.5',
                          sort === option.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Divider */}
        <div className="h-4 w-px bg-border" />

        {/* Start Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-8 gap-1.5 text-xs font-normal',
                startDate && 'border-primary/50 bg-primary/5 text-primary hover:bg-primary/10'
              )}
            >
              <CalendarIcon className="h-3 w-3 opacity-60" />
              {startDate ? format(new Date(startDate), 'yy.MM.dd') : '시작일'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate ? new Date(startDate) : undefined}
              onSelect={(date) => onStartDateChange(date ? format(date, 'yyyy-MM-dd') : undefined)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-xs text-muted-foreground">→</span>

        {/* End Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-8 gap-1.5 text-xs font-normal',
                endDate && 'border-primary/50 bg-primary/5 text-primary hover:bg-primary/10'
              )}
            >
              <CalendarIcon className="h-3 w-3 opacity-60" />
              {endDate ? format(new Date(endDate), 'yy.MM.dd') : '종료일'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate ? new Date(endDate) : undefined}
              onSelect={(date) => onEndDateChange(date ? format(date, 'yyyy-MM-dd') : undefined)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Clear active filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            필터 초기화
          </Button>
        )}
      </div>
    </div>
  );
}
