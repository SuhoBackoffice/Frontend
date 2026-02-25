'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FileText, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ApiError } from '@/types/api.types';
import { StraightDetailResponse, StraightBomItem } from '@/types/straight/straight.types';
import { getStraightBom } from '@/lib/api/straight/straight.api';
import { patchProjectStraight, deleteProjectStraight } from '@/lib/api/project/project.api';
import BomListModal from '@/components/project/branch/BomListModal';

interface Props {
  railDetail: StraightDetailResponse;
  straightRailId: number;
  projectId: number;
}

const BOM_HEADERS = ['자재 코드', '품목명', '단위 수량'];
const BOM_KEYS: (keyof StraightBomItem)[] = ['materialCode', 'itemName', 'unitQuantity'];

export default function StraightDetailContent({ railDetail, straightRailId, projectId }: Props) {
  const router = useRouter();

  const [bomOpen, setBomOpen] = useState(false);
  const [bomData, setBomData] = useState<StraightBomItem[] | null>(null);
  const [isBomLoading, setIsBomLoading] = useState(false);

  // 삭제 다이얼로그
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 수량 수정 다이얼로그
  const [editOpen, setEditOpen] = useState(false);
  const [newQuantity, setNewQuantity] = useState(String(railDetail.totalQuantity));
  const [isPatching, setIsPatching] = useState(false);

  const progress =
    railDetail.totalQuantity > 0
      ? (railDetail.completedQuantity / railDetail.totalQuantity) * 100
      : 0;
  const isDone =
    railDetail.completedQuantity >= railDetail.totalQuantity && railDetail.totalQuantity > 0;

  const handleOpenBom = async () => {
    if (bomData) {
      setBomOpen(true);
      return;
    }
    setIsBomLoading(true);
    try {
      const result = await getStraightBom(straightRailId);
      setBomData(result.data!);
      setBomOpen(true);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'BOM 정보를 불러오는 중 오류가 발생했습니다.';
      toast.error(message);
    } finally {
      setIsBomLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProjectStraight(straightRailId);
      toast.success('레일이 삭제되었습니다.');
      setDeleteOpen(false);
      router.push(`/project/${projectId}`);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : '삭제 중 오류가 발생했습니다.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePatch = async () => {
    const qty = Number(newQuantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      toast.error('올바른 수량을 입력하세요.');
      return;
    }
    setIsPatching(true);
    try {
      await patchProjectStraight({ totalQuantity: qty }, straightRailId);
      toast.success('수량이 수정되었습니다.');
      setEditOpen(false);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : '수량 수정 중 오류가 발생했습니다.';
      toast.error(message);
    } finally {
      setIsPatching(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 레일 기본 정보 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl">{railDetail.serial}</CardTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {railDetail.isLoopRail ? '루프 직선 레일' : '일반 직선 레일'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleOpenBom} disabled={isBomLoading}>
                {isBomLoading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-1.5 h-4 w-4" />
                )}
                BOM
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewQuantity(String(railDetail.totalQuantity));
                  setEditOpen(true);
                }}
              >
                <Pencil className="mr-1.5 h-4 w-4" />
                수량 수정
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="mr-1.5 h-4 w-4" />
                삭제
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                길이
              </p>
              <p className="text-lg font-semibold">{railDetail.length}mm</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                타입
              </p>
              <p className="text-lg font-semibold">{railDetail.isLoopRail ? '루프' : '일반'}</p>
            </div>
            {railDetail.isLoopRail && railDetail.holePosition > 0 && (
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  가공 위치
                </p>
                <p className="text-lg font-semibold">{railDetail.holePosition}mm</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                생산 수량
              </p>
              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-bold ${isDone ? 'text-primary' : ''}`}>
                  {railDetail.completedQuantity}
                </span>
                <span className="text-muted-foreground text-sm">/ {railDetail.totalQuantity}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* 시리얼 현황 */}
      <Card className="!gap-1">
        <CardHeader>
          <CardTitle className="text-xl">시리얼 현황</CardTitle>
        </CardHeader>
        <CardContent>
          {railDetail.serialInfoList.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              등록된 시리얼이 없습니다.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">시리얼</TableHead>
                  <TableHead className="text-center">생산 일시</TableHead>
                  <TableHead className="text-center">시리얼 상태</TableHead>
                  <TableHead className="text-center">생산 상태</TableHead>
                  <TableHead className="text-center">비활성 사유</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {railDetail.serialInfoList.map((serial) => (
                  <TableRow
                    key={serial.serial}
                    className={serial.serialState !== '유효' ? 'bg-muted hover:bg-muted/80' : ''}
                  >
                    <TableCell className="text-center font-medium">{serial.serial}</TableCell>
                    <TableCell className="text-muted-foreground text-center">
                      {serial.producedAt ?? '—'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={serial.serialState === '유효' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {serial.serialState}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={serial.productionState === '생산 완료' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {serial.productionState}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center text-sm">
                      {serial.inactiveReason ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* BOM 모달 */}
      <BomListModal<StraightBomItem>
        isOpen={bomOpen}
        onClose={() => setBomOpen(false)}
        data={bomData}
        headers={BOM_HEADERS}
        keys={BOM_KEYS}
        title={`BOM — ${railDetail.serial}`}
        description="직선 레일 BOM 목록입니다."
      />

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>레일 삭제</DialogTitle>
            <DialogDescription>
              <span className="text-foreground font-semibold">{railDetail.serial}</span>을
              삭제합니다.
              <br />이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 수량 수정 다이얼로그 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>수량 수정</DialogTitle>
            <DialogDescription>
              {railDetail.totalQuantity}개 → {newQuantity || '?'}개로 변경합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="quantity" className="mb-1.5 block text-sm">
              새 수량
            </Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isPatching}>
              취소
            </Button>
            <Button onClick={handlePatch} disabled={isPatching}>
              {isPatching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
