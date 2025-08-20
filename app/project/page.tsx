'use client';

import { withAuth } from '@/lib/hooks/withAuth';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarIcon, ChevronsUpDown, Check, Search, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { cn } from '@/lib/utils';
import { getProjectList, getProjectSearchSort } from '@/lib/api/project/project.api';
import { getVersionInfo } from '@/lib/api/version/version.api';
import {
  GetProjectListRequest,
  ProjectInfoResponse,
  ProjectSearchSortResponse,
} from '@/types/project/project.types';
import { VersionInfoResponse } from '@/types/version/version.types';
import { ApiError, PagingResponse } from '@/types/api.types';

const initialSearchParams: GetProjectListRequest = {
  page: 0,
  size: 10,
  keyword: '',
  startDate: undefined,
  endDate: undefined,
  versionId: undefined,
  sort: 'START_DATE',
};

function ProjectPage() {
  const [searchParams, setSearchParams] = useState<GetProjectListRequest>(initialSearchParams);
  const [projectData, setProjectData] = useState<PagingResponse<ProjectInfoResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [versions, setVersions] = useState<VersionInfoResponse[]>([]);
  const [sortOptions, setSortOptions] = useState<ProjectSearchSortResponse[]>([]); // 타입 변경
  const [versionPopoverOpen, setVersionPopoverOpen] = useState(false);
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await getVersionInfo();
        if (response.isSuccess && response.data) {
          setVersions(response.data);
        } else {
          toast.error(response.message);
        }
      } catch {
        toast.error('버전 조회 실패. 서버 상태가 좋지 않습니다.');
      }
    };
    fetchVersions();
  }, []);

  // 정렬 기준 정보 가져오기
  useEffect(() => {
    const fetchSortOptions = async () => {
      try {
        const response = await getProjectSearchSort();
        if (response.isSuccess && response.data) {
          setSortOptions(response.data);
        } else {
          toast.error(response.message);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error('정렬 기준 조회 실패. 서버 상태가 좋지 않습니다.');
        }
      }
    };
    fetchSortOptions();
  }, []);

  // 프로젝트 목록을 조회하는 메인 함수
  const handleSearch = useCallback(async (params: GetProjectListRequest) => {
    setIsLoading(true);

    try {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== undefined && value !== null && value !== ''
        )
      ) as Partial<GetProjectListRequest>;

      const response = await getProjectList(filteredParams);
      if (response.isSuccess && response.data) {
        setProjectData(response.data);
      } else {
        setProjectData(null);
      }
    } catch (err) {
      setProjectData(null);
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error('프로젝트 목록 조회 실패. 서버 상태가 좋지 않습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onSearchClick = () => {
    handleSearch({ ...searchParams, page: 0 });
  };

  const onResetClick = () => {
    setSearchParams(initialSearchParams);
    setProjectData(null);
  };

  const handlePageChange = (newPage: number) => {
    const newSearchParams = { ...searchParams, page: newPage };
    setSearchParams(newSearchParams);
    handleSearch(newSearchParams);
  };

  const handleRowClick = (projectId: number) => {
    router.push(`/project/${projectId}`);
  };

  const getSelectedVersionName = () => versions.find((v) => v.id === searchParams.versionId)?.name;
  const getSelectedSortName = () => sortOptions.find((s) => s.id === searchParams.sort)?.name; // 로직 변경

  return (
    <div className="container mx-auto space-y-4 p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">프로젝트 조회</h1>

      {/* 검색 필터 섹션 */}
      <Card>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-[1fr_150px_150px] gap-6">
            {/* 키워드 입력 */}
            <div className="space-y-2">
              <Input
                id="keyword"
                placeholder="프로젝트명, 지역 등 검색어를 입력하세요."
                value={searchParams.keyword}
                onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
              />
            </div>

            {/* 버전 정보 Combobox */}
            <div className="space-y-2">
              <Popover open={versionPopoverOpen} onOpenChange={setVersionPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {searchParams.versionId ? getSelectedVersionName() : '버전 선택'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="버전 검색..." />
                    <CommandList>
                      <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                      <CommandGroup>
                        {versions.map((version) => (
                          <CommandItem
                            key={version.id}
                            value={version.name}
                            onSelect={() => {
                              setSearchParams({ ...searchParams, versionId: version.id });
                              setVersionPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                searchParams.versionId === version.id ? 'opacity-100' : 'opacity-0'
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
            </div>

            {/* 정렬 기준 Combobox */}
            <div className="space-y-2">
              <Popover open={sortPopoverOpen} onOpenChange={setSortPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {getSelectedSortName() || '정렬 기준 선택'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {sortOptions.map((option) => (
                          <CommandItem
                            key={option.id}
                            value={option.name}
                            onSelect={() => {
                              setSearchParams({
                                ...searchParams,
                                sort: option.id as 'START_DATE' | 'END_DATE',
                              });
                              setSortPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                searchParams.sort === option.id ? 'opacity-100' : 'opacity-0'
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
            </div>
          </div>

          <div className="grid grid-cols-[auto_auto_auto_1fr] items-center gap-6">
            {/* 시작일 선택 */}
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !searchParams.startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchParams.startDate ? (
                      format(searchParams.startDate, 'yyyy-MM-dd')
                    ) : (
                      <span>시작일</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={searchParams.startDate ? new Date(searchParams.startDate) : undefined}
                    onSelect={(date) =>
                      setSearchParams({
                        ...searchParams,
                        startDate: date ? format(date, 'yyyy-MM-dd') : undefined,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <ArrowRight className="text-muted-foreground h-5 w-5 scale-150" />

            {/* 종료일 선택 */}
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !searchParams.endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchParams.endDate ? (
                      format(searchParams.endDate, 'yyyy-MM-dd')
                    ) : (
                      <span>종료일</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={searchParams.endDate ? new Date(searchParams.endDate) : undefined}
                    onSelect={(date) =>
                      setSearchParams({
                        ...searchParams,
                        endDate: date ? format(date, 'yyyy-MM-dd') : undefined,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onResetClick}>
                <RotateCcw className="mr-2 h-4 w-4" />
                초기화
              </Button>
              <Button onClick={onSearchClick} disabled={isLoading}>
                <Search className="mr-2 h-4 w-4" />
                {isLoading ? '검색 중...' : '검색'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 결과 테이블 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>검색 결과</CardTitle>
          {projectData && (
            <p className="text-muted-foreground text-sm">총 {projectData.totalElements}개</p>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">버전</TableHead>
                <TableHead className="w-[120px]">지역</TableHead>
                <TableHead>프로젝트명</TableHead>
                <TableHead className="w-[150px]">시작일</TableHead>
                <TableHead className="w-[150px]">종료일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    데이터를 불러오는 중입니다...
                  </TableCell>
                </TableRow>
              ) : projectData?.content && projectData.content.length > 0 ? (
                projectData.content.map((project, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(project.id)}
                  >
                    <TableCell>{project.version}</TableCell>
                    <TableCell>{project.region}</TableCell>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.startDate}</TableCell>
                    <TableCell>{project.endDate}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* 페이지네이션 */}
          {projectData && projectData.totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!projectData.first) {
                          handlePageChange(projectData.pageNo - 1);
                        }
                      }}
                      className={projectData.first ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {/* 페이지 번호 렌더링 (간단한 버전) */}
                  {[...Array(projectData.totalPages).keys()].map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === projectData.pageNo}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                      >
                        {pageNumber + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!projectData.last) {
                          handlePageChange(projectData.pageNo + 1);
                        }
                      }}
                      className={projectData.last ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(ProjectPage, ['admin', '관리자', '직원']);
