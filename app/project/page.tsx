'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { FolderKanban } from 'lucide-react';
import { getProjectList, getProjectSearchSort } from '@/lib/api/project/project.api';
import { getVersionInfo } from '@/lib/api/version/version.api';
import { ProjectInfoResponse, ProjectSearchSortResponse } from '@/types/project/project.types';
import { VersionInfoResponse } from '@/types/version/version.types';
import { ApiError, PagingResponse } from '@/types/api.types';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { ProjectFilterBar } from './_components/ProjectFilterBar';
import { ProjectList } from './_components/ProjectList';
import { ProjectPagination } from './_components/ProjectPagination';

export default function ProjectPage() {
  const [keyword, setKeyword] = useState('');
  const [versionId, setVersionId] = useState<number | undefined>();
  const [sort, setSort] = useState('START_DATE');
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  const [projectData, setProjectData] = useState<PagingResponse<ProjectInfoResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [versions, setVersions] = useState<VersionInfoResponse[]>([]);
  const [sortOptions, setSortOptions] = useState<ProjectSearchSortResponse[]>([]);

  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [vRes, sRes] = await Promise.all([getVersionInfo(), getProjectSearchSort()]);
        if (vRes.isSuccess && vRes.data) setVersions(vRes.data);
        if (sRes.isSuccess && sRes.data) setSortOptions(sRes.data);
      } catch {
        toast.error('메타데이터 조회에 실패했습니다.');
      }
    };
    fetchMeta();
  }, []);

  const fetchProjects = useCallback(
    async (params: {
      keyword: string;
      versionId?: number;
      sort: string;
      startDate?: string;
      endDate?: string;
      page: number;
    }) => {
      setIsLoading(true);
      try {
        const filtered = Object.fromEntries(
          Object.entries({ ...params, size: 10 }).filter(
            ([, v]) => v !== undefined && v !== null && v !== ''
          )
        );
        const response = await getProjectList(filtered);
        setProjectData(response.isSuccess && response.data ? response.data : null);
      } catch (err) {
        setProjectData(null);
        toast.error(
          err instanceof ApiError ? err.message : '프로젝트 목록 조회에 실패했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProjects({ keyword: debouncedKeyword, versionId, sort, startDate, endDate, page });
  }, [debouncedKeyword, versionId, sort, startDate, endDate, page, fetchProjects]);

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(0);
  };

  const handleVersionChange = (value: number | undefined) => {
    setVersionId(value);
    setPage(0);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(0);
  };

  const handleStartDateChange = (value: string | undefined) => {
    setStartDate(value);
    setPage(0);
  };

  const handleEndDateChange = (value: string | undefined) => {
    setEndDate(value);
    setPage(0);
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FolderKanban className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">프로젝트 목록</h1>
          <p className="text-sm text-muted-foreground">
            {projectData
              ? `총 ${projectData.totalElements}개의 프로젝트`
              : '프로젝트를 조회하세요'}
          </p>
        </div>
      </div>

      {/* Filter */}
      <ProjectFilterBar
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
        versionId={versionId}
        onVersionChange={handleVersionChange}
        sort={sort}
        onSortChange={handleSortChange}
        startDate={startDate}
        onStartDateChange={handleStartDateChange}
        endDate={endDate}
        onEndDateChange={handleEndDateChange}
        versions={versions}
        sortOptions={sortOptions}
      />

      {/* Project List */}
      <ProjectList projects={projectData?.content ?? []} isLoading={isLoading} />

      {/* Pagination — always visible */}
      <ProjectPagination pagingData={projectData} onPageChange={setPage} />
    </div>
  );
}
