'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getBranchLatestBomList, uploadBranchBom } from '@/lib/api/branch/branch.api';
import { BranchDetailInfoBom } from '@/types/branch/branch.types';
import { ApiError } from '@/types/api.types';
import { deleteUploadedFile, postFileUpload } from '@/lib/api/file/file.api';
import { FileUploadType } from '@/types/file/file.types';
import {
  RefreshCw,
  CloudUpload,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import BomListModal from '@/components/project/branch/BomListModal';

export interface WizardResult {
  branchCode: string;
  quantity: number;
  branchTypeId: number;
  imageUrl: string | null;
  bomData: BranchDetailInfoBom[] | null;
  bomSource: 'latest' | 'uploaded';
}

interface Props {
  open: boolean;
  onClose: () => void;
  versionInfoId: number;
  onComplete: (result: WizardResult) => void;
}

const BOM_HEADERS = ['품목 구분', '도번', '품명', '규격', '단위 수량', '단위', '사급'];
const BOM_KEYS = [
  'itemType',
  'drawingNumber',
  'itemName',
  'specification',
  'unitQuantity',
  'unit',
  'suppliedMaterial',
] as const;

const ALLOWED_EXCEL_EXTS = ['.xls', '.xlsx'] as const;
const ALLOWED_EXCEL_MIME = new Set([
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);
const ALLOWED_IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIZE = 100 * 1024 * 1024;

function toPositiveIntOrEmpty(v: string) {
  if (v === '') return '';
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return '';
  return String(Math.floor(n));
}

export default function BranchRegisterWizardModal({
  open,
  onClose,
  versionInfoId,
  onComplete,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [branchCode, setBranchCode] = useState('');
  const [quantity, setQuantity] = useState('');

  const [loadingLatest, setLoadingLatest] = useState(false);
  const [uploadingBom, setUploadingBom] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [bomData, setBomData] = useState<BranchDetailInfoBom[] | null>(null);
  const [branchTypeId, setBranchTypeId] = useState<number | null>(null);
  const [bomSource, setBomSource] = useState<'latest' | 'uploaded' | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [isBomPreviewOpen, setIsBomPreviewOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const resetWizard = () => {
    setStep(1);
    setBranchCode('');
    setQuantity('');
    setBomData(null);
    setBranchTypeId(null);
    setBomSource(null);
    setImageUrl(null);
    setIsBomPreviewOpen(false);
    setIsImagePreviewOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleClose = () => {
    // 이미지를 업로드했지만 BOM 업로드에 사용하지 않은 경우 정리
    if (imageUrl && bomSource !== 'uploaded') {
      deleteUploadedFile({ fileUrl: imageUrl }).catch(() => {});
    }
    resetWizard();
    onClose();
  };

  const handleNextStep = () => {
    if (!branchCode.trim() || !quantity.trim()) {
      toast.error('분기 레일 코드와 수량을 모두 입력해주세요.');
      return;
    }
    setBomData(null);
    setBranchTypeId(null);
    setBomSource(null);
    setStep(2);
  };

  const handleBackStep = () => {
    setBomData(null);
    setBranchTypeId(null);
    setBomSource(null);
    setStep(1);
  };

  const handleGetLatestBom = async () => {
    try {
      setLoadingLatest(true);
      const response = await getBranchLatestBomList({
        branchCode,
        versionInfoId: String(versionInfoId),
      });
      setBomData(response.data!.branchDetailinfoDtoList);
      setBranchTypeId(response.data!.branchTypeId);
      setBomSource('latest');
      toast.success('최신 BOM을 불러왔습니다.');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : '최신 BOM 조회 실패.';
      toast.error(message);
      setBomData(null);
      setBranchTypeId(null);
      setBomSource(null);
    } finally {
      setLoadingLatest(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const nameOk = ALLOWED_EXCEL_EXTS.some((ext) => file.name.toLowerCase().endsWith(ext));
    const typeOk = !file.type || ALLOWED_EXCEL_MIME.has(file.type);
    if (!nameOk || !typeOk) {
      toast.error('엑셀 파일(.xls, .xlsx)만 업로드할 수 있습니다.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setUploadingBom(true);
      const response = await uploadBranchBom({
        branchCode,
        versionInfoId,
        file,
        imageUrl,
      });
      setBranchTypeId(response.data!.branchTypeId);
      setBomSource('uploaded');
      setBomData(null);
      toast.success('새로운 BOM이 업로드되었습니다.');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : '파일 업로드 실패.';
      toast.error(message);
      setBranchTypeId(null);
      setBomSource(null);
    } finally {
      setUploadingBom(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type || !ALLOWED_IMAGE_MIME.has(file.type) || file.size > MAX_IMAGE_SIZE) {
      toast.error('JPG/PNG/WebP 형식, 100MB 이하만 업로드할 수 있습니다.');
      if (imageInputRef.current) imageInputRef.current.value = '';
      return;
    }

    try {
      setImageUploading(true);
      const res = await postFileUpload({ file, type: FileUploadType.BRANCH_IMAGE });
      setImageUrl(res.data!.fileUrl);
      toast.success('이미지 업로드 완료');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : '이미지 업로드 실패.';
      toast.error(message);
    } finally {
      setImageUploading(false);
    }
  };

  const clearImage = async () => {
    if (!imageUrl) {
      if (imageInputRef.current) imageInputRef.current.value = '';
      return;
    }
    try {
      await deleteUploadedFile({ fileUrl: imageUrl });
      setImageUrl(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
      toast.success('이미지가 제거되었습니다.');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : '이미지 삭제 실패.';
      toast.error(message);
    }
  };

  const handleComplete = () => {
    if (!branchTypeId || !bomSource) {
      toast.error('BOM을 불러오거나 업로드해주세요.');
      return;
    }
    onComplete({
      branchCode,
      quantity: Number(quantity),
      branchTypeId,
      imageUrl,
      bomData,
      bomSource,
    });
    resetWizard();
  };

  const isStep1Valid = branchCode.trim() !== '' && quantity.trim() !== '';

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="!max-h-[85vh] !w-[90vw] !max-w-[780px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              분기 레일 추가 — {step} / 2단계
            </DialogTitle>
          </DialogHeader>

          {/* 진행 표시 바 */}
          <div className="flex gap-2">
            <div
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                step >= 1 ? 'bg-primary' : 'bg-muted'
              )}
            />
            <div
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                step >= 2 ? 'bg-primary' : 'bg-muted'
              )}
            />
          </div>

          {/* 1단계: 기본 정보 */}
          {step === 1 && (
            <div className="flex min-h-[380px] flex-col justify-between space-y-6 pt-2">
              <div className="space-y-6">
                <p className="text-muted-foreground">분기 레일 코드와 수량을 입력해주세요.</p>

                <div className="space-y-2">
                  <Label htmlFor="wizard-branchCode" className="text-base">
                    분기 레일 코드
                  </Label>
                  <Input
                    id="wizard-branchCode"
                    placeholder="분기 레일 코드를 입력하세요."
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wizard-quantity" className="text-base">
                    수량
                  </Label>
                  <Input
                    id="wizard-quantity"
                    type="number"
                    min={1}
                    step={1}
                    placeholder="수량을 입력하세요."
                    value={quantity}
                    onChange={(e) => setQuantity(toPositiveIntOrEmpty(e.target.value))}
                    onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                    className="h-11 text-base"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleNextStep}
                  disabled={!isStep1Valid}
                  className="h-11 gap-1.5 px-6 text-base"
                >
                  다음
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* 2단계: BOM 설정 */}
          {step === 2 && (
            <div className="flex min-h-[420px] flex-col justify-between space-y-5 pt-2">
              <div className="space-y-5">
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">{branchCode}</span> — 수량{' '}
                  <span className="text-foreground font-medium">{quantity}</span>개의 BOM을
                  설정해주세요.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {/* 최신 BOM 적용 */}
                  <div
                    className={cn(
                      'space-y-4 rounded-xl border p-6 transition-colors',
                      bomSource === 'latest' ? 'ring-primary/40 bg-primary/5 ring-1' : 'bg-muted/30'
                    )}
                  >
                    <p className="text-center text-base font-bold">최근 BOM 적용</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleGetLatestBom}
                        disabled={loadingLatest || uploadingBom}
                        className="h-11 flex-1 text-base"
                      >
                        {loadingLatest ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            불러오는 중...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            최신 BOM 불러오기
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-11 shrink-0 p-0"
                        disabled={!bomData}
                        onClick={() => setIsBomPreviewOpen(true)}
                        title="BOM 목록 보기"
                      >
                        <FileSpreadsheet className="h-5 w-5" />
                      </Button>
                    </div>
                    {bomSource === 'latest' && (
                      <p className="text-primary flex items-center justify-center gap-1.5 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        BOM 적용됨
                      </p>
                    )}
                  </div>

                  {/* 신규 BOM 등록 */}
                  <div
                    className={cn(
                      'space-y-4 rounded-xl border p-6 transition-colors',
                      bomSource === 'uploaded'
                        ? 'ring-primary/40 bg-primary/5 ring-1'
                        : 'bg-muted/30'
                    )}
                  >
                    <p className="text-center text-base font-bold">신규 BOM 등록</p>

                    {/* ① 이미지 업로드 (선택) */}
                    <div className="space-y-1.5">
                      <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                        <span className="bg-muted text-muted-foreground inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                          1
                        </span>
                        이미지 업로드
                        <span className="text-muted-foreground/60 font-normal normal-case">(선택)</span>
                      </p>
                      {bomSource === 'uploaded' ? (
                        <div className="text-muted-foreground flex h-11 items-center justify-center rounded-lg border border-dashed text-sm">
                          BOM 등록 완료 후 이미지 변경 불가
                        </div>
                      ) : imageUrl ? (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-11 flex-1 text-base"
                            onClick={() => setIsImagePreviewOpen(true)}
                            disabled={imageUploading || uploadingBom}
                          >
                            이미지 미리보기
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            className="h-11 w-16 shrink-0 text-base"
                            onClick={clearImage}
                            disabled={imageUploading || uploadingBom}
                          >
                            제거
                          </Button>
                        </div>
                      ) : (
                        <label htmlFor="wizard-image-upload" className="w-full">
                          <Button
                            asChild
                            variant="outline"
                            className="h-11 w-full cursor-pointer text-base"
                            disabled={imageUploading || uploadingBom}
                          >
                            <span className="inline-flex items-center justify-center gap-2">
                              {imageUploading ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  업로드 중...
                                </>
                              ) : (
                                <>
                                  <CloudUpload className="h-4 w-4" />
                                  이미지 파일 선택
                                </>
                              )}
                            </span>
                          </Button>
                          <input
                            ref={imageInputRef}
                            id="wizard-image-upload"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={imageUploading || uploadingBom}
                          />
                        </label>
                      )}
                    </div>

                    {/* 구분선 + 화살표 */}
                    <div className="flex items-center gap-2">
                      <div className="bg-border h-px flex-1" />
                      <span className="text-muted-foreground text-xs">↓</span>
                      <div className="bg-border h-px flex-1" />
                    </div>

                    {/* ② BOM 엑셀 업로드 (필수) */}
                    <div className="space-y-1.5">
                      <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                        <span className="bg-primary text-primary-foreground inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                          2
                        </span>
                        BOM 엑셀 업로드
                        <span className="text-destructive font-normal normal-case">(필수)</span>
                      </p>
                      {bomSource === 'uploaded' ? (
                        <Button
                          type="button"
                          className="h-11 w-full text-base"
                          disabled
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          BOM 업로드 완료
                        </Button>
                      ) : (
                        <label htmlFor="wizard-bom-upload" className="w-full">
                          <Button
                            asChild
                            className="h-11 w-full cursor-pointer text-base"
                            disabled={uploadingBom || loadingLatest || imageUploading}
                          >
                            <span className="inline-flex items-center justify-center gap-2">
                              {uploadingBom ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  업로드 중...
                                </>
                              ) : (
                                <>
                                  <CloudUpload className="h-4 w-4" />
                                  새 BOM 업로드
                                </>
                              )}
                            </span>
                          </Button>
                          <input
                            ref={fileInputRef}
                            id="wizard-bom-upload"
                            type="file"
                            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploadingBom || loadingLatest || imageUploading}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackStep}
                  className="h-11 gap-1.5 px-6 text-base"
                  disabled={loadingLatest || uploadingBom || imageUploading}
                >
                  <ArrowLeft className="h-4 w-4" />
                  이전
                </Button>
                <Button
                  type="button"
                  onClick={handleComplete}
                  disabled={!branchTypeId || loadingLatest || uploadingBom}
                  className="h-11 gap-1.5 px-6 text-base"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  추가하기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 최신 BOM 미리보기 (마법사 내부용) */}
      <BomListModal<BranchDetailInfoBom>
        isOpen={isBomPreviewOpen}
        onClose={() => setIsBomPreviewOpen(false)}
        data={bomData}
        headers={BOM_HEADERS}
        keys={BOM_KEYS as unknown as (keyof BranchDetailInfoBom)[]}
        title={`${branchCode} 최신 BOM 목록`}
        description={`${branchCode} 분기의 최신 버전 자재 목록입니다.`}
      />

      {/* 이미지 미리보기 */}
      {imageUrl && (
        <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>분기 이미지 미리보기</DialogTitle>
            </DialogHeader>
            <div className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-lg border">
              <Image
                src={imageUrl}
                alt={`${branchCode} 분기 이미지`}
                fill
                sizes="420px"
                className="object-cover"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
