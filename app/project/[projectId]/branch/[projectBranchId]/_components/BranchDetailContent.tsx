'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FileText, Loader2, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
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
import { BranchDetailResponse, BranchDetailInfoBom } from '@/types/branch/branch.types';
import { getBranchBomList } from '@/lib/api/branch/branch.api';
import { patchProjectBranch, deleteProjectBranch } from '@/lib/api/project/project.api';
import BomListModal from '@/components/project/branch/BomListModal';

interface Props {
  branchDetail: BranchDetailResponse;
  projectBranchId: number;
  projectId: number;
}

const BOM_HEADERS = ['품목 구분', '도번', '품명', '규격', '단위 수량', '단위', '사급'] as const;
const BOM_KEYS: (keyof BranchDetailInfoBom)[] = [
  'itemType',
  'drawingNumber',
  'itemName',
  'specification',
  'unitQuantity',
  'unit',
  'suppliedMaterial',
];

export default function BranchDetailContent({ branchDetail, projectBranchId, projectId }: Props) {
  const router = useRouter();

  const [bomOpen, setBomOpen] = useState(false);
  const [bomData, setBomData] = useState<BranchDetailInfoBom[] | null>(null);
  const [isBomLoading, setIsBomLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [newQuantity, setNewQuantity] = useState(String(branchDetail.totalQuantity));
  const [isPatching, setIsPatching] = useState(false);

  const progress =
    branchDetail.totalQuantity > 0
      ? (branchDetail.completedQuantity / branchDetail.totalQuantity) * 100
      : 0;
  const isDone =
    branchDetail.completedQuantity >= branchDetail.totalQuantity && branchDetail.totalQuantity > 0;

  const handleOpenBom = async () => {
    if (bomData) {
      setBomOpen(true);
      return;
    }
    setIsBomLoading(true);
    try {
      const result = await getBranchBomList({ branchTypeId: projectBranchId });
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
      await deleteProjectBranch(projectBranchId);
      toast.success('분기 레일이 삭제되었습니다.');
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
      await patchProjectBranch({ totalQuantity: qty }, projectBranchId);
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
              <CardTitle className="text-xl">{branchDetail.serial}</CardTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">{branchDetail.name}</p>
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
                  setNewQuantity(String(branchDetail.totalQuantity));
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
                코드
              </p>
              <p className="text-lg font-semibold">{branchDetail.code}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                버전
              </p>
              <p className="text-lg font-semibold">{branchDetail.branchVersion}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                생산 수량
              </p>
              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-bold ${isDone ? 'text-primary' : ''}`}>
                  {branchDetail.completedQuantity}
                </span>
                <span className="text-muted-foreground text-sm">/ {branchDetail.totalQuantity}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                이미지
              </p>
              <div className="relative h-16 w-16">
                <Image
                  src={branchDetail.imageUrl ?? '/logo.png'}
                  alt={branchDetail.name}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
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
          {branchDetail.serialInfoList.length === 0 ? (
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
                {branchDetail.serialInfoList.map((serial) => (
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
      <BomListModal<BranchDetailInfoBom>
        isOpen={bomOpen}
        onClose={() => setBomOpen(false)}
        data={bomData}
        headers={[...BOM_HEADERS]}
        keys={BOM_KEYS}
        title={`BOM — ${branchDetail.serial}`}
        description="분기 레일 BOM 목록입니다."
      />

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>분기 레일 삭제</DialogTitle>
            <DialogDescription>
              <span className="text-foreground font-semibold">{branchDetail.serial}</span>을
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
              {branchDetail.totalQuantity}개 → {newQuantity || '?'}개로 변경합니다.
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
