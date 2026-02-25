'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProjectDetail, postProjectBranchRegister } from '@/lib/api/project/project.api';
import { getBranchBomList } from '@/lib/api/branch/branch.api';
import { BranchDetailInfoBom } from '@/types/branch/branch.types';
import { ProjecInfoDetailResponse } from '@/types/project/project.types';
import { toast } from 'sonner';
import { ApiError } from '@/types/api.types';
import { cn } from '@/lib/utils';
import {
  PlusCircle,
  Trash2,
  Loader2,
  GitBranch,
  FileSpreadsheet,
  ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import BomListModal from '@/components/project/branch/BomListModal';
import BranchRegisterWizardModal, { WizardResult } from './BranchRegisterWizardModal';

interface BranchListItem {
  id: string;
  branchCode: string;
  quantity: number;
  branchTypeId: number;
  imageUrl: string | null;
  bomData: BranchDetailInfoBom[] | null;
  bomSource: 'latest' | 'uploaded';
}

interface Props {
  projectId: number;
}

// 공통 그리드 컬럼 정의: [번호 | 분기코드 | 수량 | BOM출처 | 이미지 | BOM확인 | 삭제]
const GRID_COLS =
  'grid-cols-[2rem_minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,1fr)_4.5rem_4.5rem_2.25rem]';

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

export default function BranchRegisterComponent({ projectId }: Props) {
  const router = useRouter();

  const [projectDetailData, setProjectDetailData] = useState<ProjecInfoDetailResponse | null>(null);
  const [loadingProject, setLoadingProject] = useState(false);
  const [items, setItems] = useState<BranchListItem[]>([]);
  const [registering, setRegistering] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  const [bomPreview, setBomPreview] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    data: BranchDetailInfoBom[] | null;
  }>({ isOpen: false, title: '', description: '', data: null });

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoadingProject(true);
        const response = await getProjectDetail({ projectId });
        setProjectDetailData(response.data!);
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

  const handleWizardComplete = (result: WizardResult) => {
    const newItem: BranchListItem = {
      id: crypto.randomUUID(),
      branchCode: result.branchCode,
      quantity: result.quantity,
      branchTypeId: result.branchTypeId,
      imageUrl: result.imageUrl,
      bomData: result.bomData,
      bomSource: result.bomSource,
    };
    setItems((prev) => [...prev, newItem]);
    setWizardOpen(false);
    toast.success(`${result.branchCode} 항목이 추가되었습니다.`);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenBomPreview = async (item: BranchListItem) => {
    if (item.bomData) {
      setBomPreview({
        isOpen: true,
        title: `${item.branchCode} BOM 목록`,
        description: `${item.branchCode} 분기 레일의 자재 목록입니다.`,
        data: item.bomData,
      });
      return;
    }

    const tid = toast.loading(`${item.branchCode} BOM 불러오는 중...`);
    try {
      const response = await getBranchBomList({ branchTypeId: item.branchTypeId });
      const data = response.data!;
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, bomData: data } : i)));
      setBomPreview({
        isOpen: true,
        title: `${item.branchCode} BOM 목록`,
        description: `${item.branchCode} 분기 레일의 자재 목록입니다.`,
        data,
      });
      toast.dismiss(tid);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'BOM 조회 실패.';
      toast.error(message, { id: tid });
    }
  };

  const handleRegister = async () => {
    if (items.length === 0) {
      toast.error('등록할 분기 레일 항목이 없습니다.');
      return;
    }
    try {
      setRegistering(true);
      const data = items.map((item) => ({
        branchTypeId: item.branchTypeId,
        quantity: item.quantity,
      }));
      const response = await postProjectBranchRegister(data, projectId);
      toast.success(response.message);
      router.push(`/project/${projectId}`);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : '등록 실패. 서버 상태가 좋지 않습니다.';
      toast.error(message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        {/* ── 헤더 ── */}
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <GitBranch className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">분기 레일 일괄 등록</CardTitle>
              <CardDescription className="mt-0.5">
                {loadingProject ? (
                  <span className="text-muted-foreground">프로젝트 정보 불러오는 중...</span>
                ) : (
                  <>
                    {projectDetailData?.name} 프로젝트에 분기 레일을 등록합니다.
                    {projectDetailData?.version && (
                      <span className="ml-2 text-xs">(버전: {projectDetailData.version})</span>
                    )}
                  </>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* 컬럼 헤더 */}
          {items.length > 0 && (
            <div className={cn('grid items-center gap-2 px-3', GRID_COLS)}>
              <div />
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                분기 코드
              </span>
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                수량
              </span>
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                BOM 출처
              </span>
              <span className="text-muted-foreground text-center text-xs font-semibold tracking-wider uppercase">
                이미지
              </span>
              <span className="text-muted-foreground text-center text-xs font-semibold tracking-wider uppercase">
                BOM
              </span>
              <div />
            </div>
          )}

          {/* 항목 목록 */}
          <div className="space-y-1.5">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  'bg-muted/30 grid items-center gap-2 rounded-lg border border-transparent p-3 transition-colors',
                  GRID_COLS
                )}
              >
                {/* 번호 */}
                <div className="flex h-9 items-center justify-center">
                  <span className="text-muted-foreground text-sm tabular-nums">{index + 1}</span>
                </div>

                {/* 분기 코드 */}
                <div className="flex h-9 items-center">
                  <span className="truncate text-sm font-medium">{item.branchCode}</span>
                </div>

                {/* 수량 */}
                <div className="flex h-9 items-center">
                  <span className="text-sm tabular-nums">{item.quantity.toLocaleString()}</span>
                </div>

                {/* BOM 출처 */}
                <div className="flex h-9 items-center gap-1.5">
                  <CheckCircle2 className="text-primary h-3.5 w-3.5 shrink-0" />
                  <span className="text-muted-foreground truncate text-xs">
                    {item.bomSource === 'latest' ? '최신 BOM 적용' : '신규 BOM 등록'}
                  </span>
                </div>

                {/* 이미지 */}
                <div className="flex h-9 items-center justify-center">
                  {item.imageUrl ? (
                    <CheckCircle2 className="text-primary h-4 w-4" />
                  ) : (
                    <ImageIcon className="text-muted-foreground/40 h-4 w-4" />
                  )}
                </div>

                {/* BOM 확인 */}
                <div className="flex h-9 items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary h-9 w-9"
                    onClick={() => handleOpenBomPreview(item)}
                    title="BOM 목록 보기"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                  </Button>
                </div>

                {/* 삭제 */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-9 w-9"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* 빈 상태 */}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
              <GitBranch className="text-muted-foreground/40 mb-3 h-10 w-10" />
              <p className="text-muted-foreground text-sm font-medium">
                등록된 분기 레일이 없습니다.
              </p>
              <p className="text-muted-foreground/60 mt-1 text-xs">
                아래 버튼으로 항목을 추가해주세요.
              </p>
            </div>
          )}

          {/* 항목 추가 */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setWizardOpen(true)}
            disabled={loadingProject || !projectDetailData}
            className="gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            항목 추가
          </Button>
        </CardContent>

        {/* ── 푸터 ── */}
        <CardFooter className="flex items-center justify-between border-t pt-6">
          <span className="text-muted-foreground text-sm">총 {items.length}개 항목</span>
          <Button
            type="button"
            onClick={handleRegister}
            disabled={items.length === 0 || registering || loadingProject}
            size="lg"
            className="min-w-44"
          >
            {registering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {items.length}개 레일 등록하기
          </Button>
        </CardFooter>
      </Card>

      {/* 마법사 모달 */}
      {projectDetailData && (
        <BranchRegisterWizardModal
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          versionInfoId={projectDetailData.versionInfoId}
          onComplete={handleWizardComplete}
        />
      )}

      {/* BOM 미리보기 */}
      <BomListModal<BranchDetailInfoBom>
        isOpen={bomPreview.isOpen}
        onClose={() => setBomPreview((prev) => ({ ...prev, isOpen: false }))}
        data={bomPreview.data}
        headers={BOM_HEADERS}
        keys={BOM_KEYS as unknown as (keyof BranchDetailInfoBom)[]}
        title={bomPreview.title}
        description={bomPreview.description}
      />
    </>
  );
}
