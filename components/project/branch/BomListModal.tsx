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

interface BomListModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  headers: string[];
  keys: string[];
  title: string;
  description: string;
}

export default function BomListModal({
  isOpen,
  onClose,
  title,
  description,
  headers,
  keys,
  data,
}: BomListModalProps) {
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
                    {keys.map((key, keyIndex) => (
                      <TableCell key={keyIndex} className="text-center">
                        {typeof item[key] === 'boolean' ? (item[key] ? 'Yes' : 'No') : item[key]}
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
