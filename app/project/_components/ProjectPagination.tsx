'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PagingResponse } from '@/types/api.types';
import { ProjectInfoResponse } from '@/types/project/project.types';

interface ProjectPaginationProps {
  pagingData: PagingResponse<ProjectInfoResponse> | null;
  onPageChange: (page: number) => void;
}

export function ProjectPagination({ pagingData, onPageChange }: ProjectPaginationProps) {
  const currentPage = pagingData?.pageNo ?? 0;
  const totalPages = pagingData?.totalPages ?? 1;

  const getPageNumbers = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    if (totalPages <= 7) return [...Array(totalPages).keys()];

    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [0];

    if (currentPage > 2) pages.push('ellipsis-start');

    const rangeStart = Math.max(1, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 2, currentPage + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push('ellipsis-end');

    pages.push(totalPages - 1);
    return pages;
  };

  const isPrevDisabled = !pagingData || pagingData.first;
  const isNextDisabled = !pagingData || pagingData.last;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isPrevDisabled) onPageChange(currentPage - 1);
            }}
            className={isPrevDisabled ? 'pointer-events-none opacity-40' : ''}
          />
        </PaginationItem>

        {getPageNumbers().map((page, idx) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <PaginationItem key={page}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isNextDisabled) onPageChange(currentPage + 1);
            }}
            className={isNextDisabled ? 'pointer-events-none opacity-40' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
