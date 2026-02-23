'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Package, CheckCircle2, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AddRailReportWizard from './AddRailReportWizard';

export default function RailReportSection({
  title,
  type,
  projectId,
  availableRails,
  reports,
  setReports,
  errors,
}: any) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const removeRow = (index: number) => {
    setReports(reports.filter((_: any, i: number) => i !== index));
  };

  const handleAddItem = (newItem: any) => {
    setReports([...reports, newItem]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
          <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          {title}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsWizardOpen(true)}
        >
          <Plus className="mr-1 h-4 w-4" /> 항목 추가
        </Button>
      </CardHeader>

      <CardContent>
        {reports.length === 0 ? (
          <div className="text-muted-foreground rounded-lg border-2 border-dashed bg-muted/30 py-12 text-center text-sm">
            추가된 생산 항목이 없습니다.
          </div>
        ) : (
          <div className="divide-y rounded-lg border">
            {reports.map((item: any, idx: number) => {
              const railId = type === 'straight' ? item.projectStraightId : item.projectBranchId;
              const railInfo = availableRails.find(
                (r: any) => (r.projectStraightId || r.projectBranchId) === railId
              );

              return (
                <div
                  key={idx}
                  className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted text-muted-foreground rounded-md p-2">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-black tracking-tight">
                          {railInfo?.straightSerial || railInfo?.branchSerial}
                        </p>
                        <p className="text-muted-foreground text-sm font-bold">
                          보고 수량:{' '}
                          <span className="text-foreground">{item.productionQuantity}개</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                        선택 완료
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeRow(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* 시리얼 번호 리스트 표시 영역 */}
                  <div className="flex flex-wrap gap-1.5 pl-14">
                    {item.serialLabels?.map((label: string, sIdx: number) => (
                      <div
                        key={sIdx}
                        className="text-muted-foreground inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium"
                      >
                        <Hash className="h-3 w-3 opacity-50" />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <AddRailReportWizard
        open={isWizardOpen}
        onOpenChange={setIsWizardOpen}
        type={type}
        projectId={projectId}
        availableRails={availableRails}
        existingReports={reports}
        onAdd={handleAddItem}
      />
    </Card>
  );
}
