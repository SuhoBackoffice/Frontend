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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-none overflow-y-auto sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index} className="text-center">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((item, dataIndex) => (
                  <TableRow key={dataIndex}>
                    {keys.map((key, keyIndex) => {
                      const value = item[key];
                      return (
                        <TableCell key={keyIndex} className="text-center">
                          {/* 데이터 타입이 boolean일 경우 'Yes' 또는 'No'로 변환 */}
                          {
                            typeof value === 'boolean' ? (value ? '✅' : '❌') : String(value) // ✅ 값을 문자열로 변환하여 렌더링
                          }
                        </TableCell>
                      );
                    })}
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
