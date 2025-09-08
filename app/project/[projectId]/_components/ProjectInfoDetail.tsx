'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProjectQuantityList } from '@/lib/api/project/project.api';
import { ApiError, ApiResponse, FileResponse } from '@/types/api.types';
import { ProjecInfoDetailResponse } from '@/types/project/project.types';
import { Download, Loader2 } from 'lucide-react';
import { use, useState } from 'react';
import { toast } from 'sonner';

interface ProjectDetailProps {
  promiseData: Promise<ApiResponse<ProjecInfoDetailResponse>>;
  projectId: number;
}

export default function ProjectInfoDetail({ promiseData, projectId }: ProjectDetailProps) {
  const data = use(promiseData).data!;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    try {
      const fileResponse: FileResponse = await getProjectQuantityList(projectId);

      const { blob, headers } = fileResponse;
      const contentDisposition = headers.get('content-disposition');
      let filename = `${data.name}.xlsx`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : '물량 리스트 다운로드 실패. 서버 상태가 좋지 않습니다.';
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">프로젝트 명 : [{data.name}]</CardTitle>
          <Button onClick={handleDownloadClick} disabled={isDownloading} className="w-[150px]">
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                물량 리스트
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-lg font-medium">버전</p>
            <p className="text-2xl font-semibold">{data.version}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-lg font-medium">지역</p>
            <p className="text-2xl font-semibold">{data.region}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-lg font-medium">시작일</p>
            <p className="text-2xl font-semibold">{data.startDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-lg font-medium">종료일</p>
            <p className="text-2xl font-semibold">{data.endDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
