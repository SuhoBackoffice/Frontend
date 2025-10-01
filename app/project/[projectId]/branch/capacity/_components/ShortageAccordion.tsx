import { memo } from 'react';
import { GetBranchBomShortageList } from '@/types/project/project.types';
import { shortageBadgeClass, topShortages } from './utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { PackageX } from 'lucide-react';

interface ShortageAccordionProps {
  shortageList: GetBranchBomShortageList[];
}

const ShortageAccordionComponent = ({ shortageList }: ShortageAccordionProps) => {
  if (!shortageList?.length) {
    return (
      <div className="px-3 md:col-span-3 md:col-start-1">
        <Alert variant="default" className="w-full border-blue-500/30 bg-blue-500/10 py-2">
          <PackageX className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">부족한 자재가 없습니다!</AlertTitle>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-3 md:col-span-3 md:col-start-1">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="shortages"
          className="overflow-hidden rounded-lg border transition-colors data-[state=open]:border-amber-500/30 data-[state=open]:bg-amber-500/10"
        >
          <AccordionTrigger className="group flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-amber-500/10">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/20 text-amber-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate text-sm font-semibold">부족 자재 목록</span>
              <div className="hidden min-w-0 items-center gap-1 sm:flex">
                {topShortages(shortageList).map((s) => (
                  <span
                    key={s.drawingNumber}
                    title={`${s.itemName} · ${s.shortage}개`}
                    className={`truncate rounded border px-2 py-0.5 text-[11px] ${shortageBadgeClass(s.shortage)}`}
                  >
                    {s.itemName} <span className="opacity-80">· {s.shortage}개</span>
                  </span>
                ))}
              </div>
            </div>
            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
              {shortageList.length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="border-t px-3 pt-2 pb-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="py-2 text-xs">품명</TableHead>
                  <TableHead className="py-2 text-xs">도면 번호</TableHead>
                  <TableHead className="py-2 text-right text-xs">부족 수량</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shortageList.map((item) => (
                  <TableRow key={item.drawingNumber}>
                    <TableCell className="py-2 text-sm">{item.itemName}</TableCell>
                    <TableCell className="py-2 text-sm">{item.drawingNumber}</TableCell>
                    <TableCell className="py-2 text-right text-sm font-semibold text-red-400">
                      {item.shortage}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export const ShortageAccordion = memo(ShortageAccordionComponent);
