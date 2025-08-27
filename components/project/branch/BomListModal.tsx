'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DialogDescription } from '@radix-ui/react-dialog';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  flexRender,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BomListModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  data: T[] | null;
  headers: string[];
  keys: (keyof T)[];
  title: string;
  description: string;
}

export default function BomListModal<T>({
  isOpen,
  onClose,
  title,
  description,
  headers,
  keys,
  data,
}: BomListModalProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<T>[]>(
    () =>
      headers.map((header, index) => ({
        accessorKey: keys[index] as string,
        header: ({ column }) => {
          const sortDirection = column.getIsSorted();
          return (
            <div
              className="flex cursor-pointer items-center justify-center select-none"
              onClick={column.getToggleSortingHandler()}
            >
              {header}
              {sortDirection === 'asc' && <ChevronUp className="ml-2 h-4 w-4" />}
              {sortDirection === 'desc' && <ChevronDown className="ml-2 h-4 w-4" />}
              {!sortDirection && <ChevronsUpDown className="ml-2 h-4 w-4" />}
            </div>
          );
        },
        cell: (info) => {
          const value = info.getValue() as T[keyof T];
          if (typeof value === 'boolean') {
            return value ? '✅' : '❌';
          }
          return String(value);
        },
      })),
    [headers, keys]
  );

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-none overflow-y-auto sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="p-2">
          <Input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="전체 테이블에서 검색..."
            className="h-8 w-full"
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan} className="text-center">
                      {header.isPlaceholder ? null : (
                        <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length} className="h-24 text-center">
                    정보가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
