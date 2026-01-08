import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, ListChecks } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  GetReportableBranchSerialResponse,
  GetReportableStraightSerialResponse,
} from '@/types/work/report.types';

interface SerialSelectionModalProps {
  serials: (GetReportableStraightSerialResponse | GetReportableBranchSerialResponse)[];
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
  loading: boolean;
}

export default function SerialSelectionModal({
  serials,
  selectedIds,
  onSelect,
  loading,
}: SerialSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 검색 필터링
  const filteredSerials = serials.filter((s: any) =>
    s.serial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAll = () => {
    if (selectedIds.length === filteredSerials.length) {
      onSelect([]);
    } else {
      onSelect(filteredSerials.map((s: any) => s.straightSerialId || s.branchSerialId));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center">
            <ListChecks className="mr-2 h-4 w-4" />
            시리얼 번호 선택
          </div>
          <Badge variant="default">{selectedIds.length}개 선택됨</Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>가용 시리얼 번호 선택</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
            <Input
              placeholder="시리얼 번호 검색..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <p className="text-muted-foreground text-sm">총 {filteredSerials.length}개 검색됨</p>
            <Button variant="ghost" size="sm" onClick={toggleAll}>
              {selectedIds.length === filteredSerials.length ? '전체 해제' : '전체 선택'}
            </Button>
          </div>

          <ScrollArea className="h-[300px] rounded-md border p-4">
            {loading ? (
              <p className="py-10 text-center">로드 중...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredSerials.map((s: any) => {
                  const id = s.straightSerialId || s.branchSerialId;
                  return (
                    <div key={id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`serial-${id}`}
                        checked={selectedIds.includes(id)}
                        onCheckedChange={(checked) => {
                          if (checked) onSelect([...selectedIds, id]);
                          else onSelect(selectedIds.filter((sid: any) => sid !== id));
                        }}
                      />
                      <label
                        htmlFor={`serial-${id}`}
                        className="cursor-pointer text-sm leading-none font-medium"
                      >
                        {s.serial}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>선택 완료</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
