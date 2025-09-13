'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { getProjectDetail } from '@/lib/api/project/project.api';
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjecInfoDetailResponse } from '@/types/project/project.types';
import { toast } from 'sonner';
import { getBranchLatestBomList, uploadBranchBom } from '@/lib/api/branch/branch.api';
import { BranchDetailInfoBom } from '@/types/branch/branch.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { postProjectBranchRegister } from '@/lib/api/project/project.api';
import { useRouter } from 'next/navigation';
import BomListModal from '@/components/project/branch/BomListModal';
import { ApiError } from '@/types/api.types';
import { Separator } from '@/components/ui/separator';
import {
  RefreshCw,
  CloudUpload,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { postFileUpload } from '@/lib/api/file/file.api';
import { FileUploadType } from '@/types/file/file.types';

interface Props {
  projectId: number;
}

// 양의 정수만 허용하는 헬퍼
function toPositiveIntOrEmpty(v: string) {
  if (v === '') return '';
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return '';
  return String(Math.floor(n));
}

export default function BranchRegisterComponent({ projectId }: Props) {
  const router = useRouter();

  // State management
  const [projectDetailData, setProjectDetailData] = useState<ProjecInfoDetailResponse>();
  const [branchCode, setBranchCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [bomData, setBomData] = useState<BranchDetailInfoBom[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBomUploaded, setIsBomUploaded] = useState(false);
  const [latestBranchTypeId, setLatestBranchTypeId] = useState<number | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  // 로딩 상태 분리
  const [loadingProject, setLoadingProject] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [uploadingBom, setUploadingBom] = useState(false);
  const [registering, setRegistering] = useState(false);

  // 파일 input 제어 (동일 파일 재선택 가능하도록)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Data for the BOM list modal
  const bomHeaders = ['품목 구분', '도번', '품명', '규격', '단위 수량', '단위', '사급'];
  const bomKeys = [
    'itemType',
    'drawingNumber',
    'itemName',
    'specification',
    'unitQuantity',
    'unit',
    'suppliedMaterial',
  ];

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoadingProject(true);
        const response = await getProjectDetail({ projectId });
        setProjectDetailData(response.data!);
        toast.success(response.message);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : '프로젝트 정보 조회 실패. 서버 상태가 좋지 않습니다.';
        toast.error(message);
      } finally {
        setLoadingProject(false);
      }
    };
    fetchProjectDetail();
  }, [projectId]);

  const handleGetLatestBom = async () => {
    if (!projectDetailData || !branchCode || !quantity) {
      toast.error('분기 레일 코드와 수량을 모두 입력해주세요.');
      return;
    }

    try {
      setLoadingLatest(true);
      const response = await getBranchLatestBomList({
        branchCode,
        versionInfoId: String(projectDetailData.versionInfoId),
      });

      setBomData(response.data!.branchDetailinfoDtoList);
      setLatestBranchTypeId(response.data!.branchTypeId);
      toast.success('최신 BOM 리스트를 성공적으로 불러왔습니다.');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : '최신 BOM 정보 조회 실패. 서버 상태가 좋지 않습니다.';
      toast.error(message);
      setBomData(null);
      setLatestBranchTypeId(null);
    } finally {
      setLoadingLatest(false);
    }
  };

  const ALLOWED_EXTS = ['.xls', '.xlsx'] as const;
  const ALLOWED_MIME = new Set([
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  ]);

  function isExcelFile(file: File) {
    const nameOk = ALLOWED_EXTS.some((ext) => file.name.toLowerCase().endsWith(ext));
    const typeOk = !file.type || ALLOWED_MIME.has(file.type);
    return nameOk && typeOk;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error('파일을 선택해주세요.');
      return;
    }

    if (!projectDetailData || !branchCode || !quantity) {
      toast.error('분기 레일 코드와 수량 입력 후 파일을 업로드해주세요.');
      return;
    }

    if (!isExcelFile(file)) {
      toast.error('엑셀 파일(.xls, .xlsx)만 업로드할 수 있습니다.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setUploadingBom(true);
      const response = await uploadBranchBom({
        branchCode,
        versionInfoId: projectDetailData.versionInfoId,
        file,
        imageUrl,
      });
      setIsBomUploaded(true);
      setBomData(null);
      setLatestBranchTypeId(response.data!.branchTypeId);
      toast.success('새로운 BOM이 성공적으로 업로드되었습니다.');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : '파일 업로드 실패. 서버 상태가 좋지 않습니다.';
      toast.error(message);
      setBomData(null);
      setLatestBranchTypeId(null);
    } finally {
      setUploadingBom(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRegister = async () => {
    if (!latestBranchTypeId || !quantity) {
      toast.error('최신 BOM을 불러오거나 새로운 BOM을 업로드한 후 등록해주세요.');
      return;
    }

    try {
      setRegistering(true);
      const data = [
        {
          branchTypeId: latestBranchTypeId,
          quantity: Number(quantity),
        },
      ];
      const response = await postProjectBranchRegister(data, projectId);
      toast.success(response.message);
      router.push(`/project/${projectId}`);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : '분기 등록 실패. 서버 상태가 좋지 않습니다.';
      toast.error(message);
    } finally {
      setRegistering(false);
    }
  };

  const ALLOWED_IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
  const MAX_IMAGE_SIZE = 100 * 1024 * 1024;

  function isImageFile(file: File) {
    const typeOk = !file.type || ALLOWED_IMAGE_MIME.has(file.type);
    const sizeOk = file.size <= MAX_IMAGE_SIZE;
    return typeOk && sizeOk;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error('이미지 파일을 선택해주세요.');
      return;
    }
    if (!isImageFile(file)) {
      toast.error('JPG/PNG/WebP 형식, 100MB 이하만 업로드할 수 있습니다.');
      if (imageInputRef.current) imageInputRef.current.value = '';
      return;
    }

    try {
      setImageUploading(true);
      const res = await postFileUpload({
        file,
        type: FileUploadType.BRANCH_IMAGE,
      });
      setImageUrl(res.data!.fileUrl);
      toast.success('이미지 업로드 완료');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : '이미지 업로드 실패. 서버 상태가 좋지 않습니다.';
      toast.error(message);
      setImageUrl(null);
    } finally {
      setImageUploading(false);
    }
  };

  const clearImage = () => {
    setIsImagePreviewOpen(false);
    setImageUrl(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const isFormFilled = branchCode.trim() !== '' && quantity.trim() !== '';
  const resetStateForNewEntry = () => {
    setBranchCode('');
    setQuantity('');
    setBomData(null);
    setIsBomUploaded(false);
    setLatestBranchTypeId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <AuthGuard allowedRoles={['admin', '관리자']}>
      <div className="flex justify-center p-8">
        <Card className="w-full max-w-[1440px]">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">신규 분기 레일 등록</CardTitle>
            <CardDescription className="text-lg">
              {projectDetailData?.name} 프로젝트에 분기 레일을 등록합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex justify-center">
              <div className="flex items-center gap-4">
                <span className="text-lg text-gray-500">버전:</span>
                <span className="text-xl font-semibold">{projectDetailData?.version}</span>
              </div>
            </div>

            {/* Step 1: Input for branch code and quantity */}
            <section aria-labelledby="section-step1" className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="branchCode" className="text-base">
                  분기 레일 코드
                </Label>
                <Input
                  id="branchCode"
                  type="text"
                  placeholder="분기 레일 코드를 입력하세요."
                  value={branchCode}
                  onChange={(e) => {
                    setBranchCode(e.target.value);
                    setLatestBranchTypeId(null);
                    setBomData(null);
                  }}
                  disabled={loadingProject || loadingLatest || uploadingBom}
                  className="h-10 text-base"
                />
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="quantity" className="text-base">
                  수량
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="수량을 입력하세요."
                  value={quantity}
                  onChange={(e) => {
                    const val = toPositiveIntOrEmpty(e.target.value);
                    setQuantity(val);
                    setLatestBranchTypeId(null);
                    setBomData(null);
                  }}
                  disabled={loadingProject || loadingLatest || uploadingBom}
                  className="h-10 text-base"
                />
              </div>
            </section>

            {/* Step 2: Render BOM options */}
            {isFormFilled && (
              <>
                <Separator className="bg-border/80 my-6 h-[2px]" />
                <section aria-labelledby="section-bom">
                  <Card className="w-full max-w-[1440px]">
                    <CardHeader>
                      <CardTitle id="section-bom" className="text-xl">
                        자재 리스트 업데이트
                      </CardTitle>
                      <CardDescription>
                        분기레일의 자재 목록을 등록해주세요. 2가지 방법 중 하나를 택해 주세요.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {/* 최신 BOM 적용 */}
                        <div
                          className={cn(
                            'bg-muted/30 space-y-4 rounded-xl border p-4 transition-colors md:p-6',
                            bomData && 'ring-primary/40 bg-primary/5 ring-1'
                          )}
                        >
                          <p className="text-center text-lg font-bold">최근 등록한 BOM 적용하기</p>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleGetLatestBom}
                              disabled={loadingLatest || uploadingBom}
                              className="h-12 flex-grow text-base"
                              aria-label="최신 BOM 불러오기"
                            >
                              {loadingLatest ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  불러오는 중...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  최신 버전 BOM 불러오기
                                </>
                              )}
                            </Button>

                            <Button
                              onClick={() => setIsModalOpen(true)}
                              variant="outline"
                              className="h-12 w-12 flex-shrink-0 p-0 text-base"
                              disabled={!bomData}
                              aria-label="BOM 리스트 보기"
                            >
                              <FileSpreadsheet className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* 새 BOM 업로드 */}
                        <div
                          className={cn(
                            'bg-muted/30 space-y-4 rounded-xl border p-4 transition-colors md:p-6',
                            isBomUploaded && 'ring-primary/40 bg-primary/5 ring-1'
                          )}
                        >
                          <p className="text-center text-lg font-bold">신규 BOM 등록하기</p>

                          {/* ✅ 이미지 업로드: 버튼만 풀사이즈(내부 카드 제거) */}
                          {imageUrl ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="default"
                                  className="h-12 min-w-0 flex-1 text-base"
                                  onClick={() => setIsImagePreviewOpen(true)}
                                  disabled={imageUploading || uploadingBom || loadingLatest}
                                >
                                  미리보기
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  className="h-12 w-16 shrink-0"
                                  onClick={clearImage}
                                  disabled={imageUploading || uploadingBom || loadingLatest}
                                >
                                  제거
                                </Button>
                              </div>

                              {/* 미리보기 다이얼로그 */}
                              <Dialog
                                open={isImagePreviewOpen}
                                onOpenChange={setIsImagePreviewOpen}
                              >
                                <DialogContent className="sm:max-w-[560px]">
                                  <DialogHeader>
                                    <DialogTitle>분기 이미지 미리보기</DialogTitle>
                                  </DialogHeader>
                                  <div className="mx-auto w-full">
                                    <div className="relative mx-auto aspect-square w-full max-w-[480px] overflow-hidden rounded-lg border">
                                      <Image
                                        src={imageUrl!}
                                        alt={`${branchCode} 분기 이미지 미리보기`}
                                        fill
                                        sizes="(max-width: 640px) 480px, 480px"
                                        className="object-cover"
                                        priority={false}
                                      />
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <label htmlFor="branch-image-upload" className="w-full">
                                <Button
                                  asChild
                                  variant="default"
                                  className="h-12 w-full cursor-pointer text-base"
                                  disabled={imageUploading || uploadingBom || loadingLatest}
                                >
                                  <span className="inline-flex items-center justify-center gap-2">
                                    {imageUploading ? (
                                      <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        이미지 업로드 중...
                                      </>
                                    ) : (
                                      <>
                                        <CloudUpload className="h-4 w-4" />
                                        분기 이미지 업로드(선택)
                                      </>
                                    )}
                                  </span>
                                </Button>
                                <input
                                  ref={imageInputRef}
                                  id="branch-image-upload"
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                  disabled={imageUploading || uploadingBom || loadingLatest}
                                />
                              </label>
                            </div>
                          )}

                          {/* BOM 엑셀 업로드 (동일 사이즈) */}
                          <label htmlFor="file-upload" className="w-full">
                            <Button
                              asChild
                              variant="default"
                              className="h-12 w-full cursor-pointer text-base"
                              disabled={uploadingBom || loadingLatest}
                              aria-label="새로운 BOM 업로드"
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
                                    새로운 BOM 업로드
                                  </>
                                )}
                              </span>
                            </Button>
                            <input
                              ref={fileInputRef}
                              id="file-upload"
                              type="file"
                              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                              className="hidden"
                              onChange={handleFileUpload}
                              disabled={uploadingBom || loadingLatest}
                            />
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
                <Separator className="bg-border/80 my-6 h-[2px]" />
              </>
            )}

            {/* Step 3: 등록 버튼 */}
            {latestBranchTypeId && (
              <section aria-labelledby="section-register" className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button
                    onClick={handleRegister}
                    disabled={registering || loadingLatest || uploadingBom}
                    className="h-12 w-full text-lg font-bold"
                    aria-label="분기 레일 등록하기"
                  >
                    {registering ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        등록 중...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        등록하기
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={resetStateForNewEntry}
                    variant="destructive"
                    className="h-12 w-full text-lg font-bold"
                    aria-label="처음부터 다시 시작"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    처음부터
                  </Button>
                </div>
              </section>
            )}
          </CardContent>
        </Card>
      </div>
      <BomListModal<BranchDetailInfoBom>
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={bomData || []}
        headers={bomHeaders}
        keys={bomKeys as (keyof BranchDetailInfoBom)[]}
        title={`${branchCode}번 분기 BOM List`}
        description={`${branchCode}번 분기에 대한 자재 목록입니다.`}
      />
    </AuthGuard>
  );
}
