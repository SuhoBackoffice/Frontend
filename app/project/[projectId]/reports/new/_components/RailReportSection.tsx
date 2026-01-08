'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Package, CheckCircle2 } from 'lucide-react';
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
    <Card className="border-none bg-transparent py-4 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between px-0 pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          {title}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsWizardOpen(true)}
          className="border-primary text-primary hover:bg-primary/5 rounded-full px-4"
        >
          <Plus className="mr-1 h-4 w-4" /> 항목 추가
        </Button>
      </CardHeader>

      <CardContent className="px-0">
        {reports.length === 0 ? (
          <div className="text-muted-foreground bg-muted/5 rounded-2xl border-2 border-dashed py-12 text-center text-sm">
            추가된 생산 항목이 없습니다.
          </div>
        ) : (
          <div className="divide-border border-border divide-y border-y">
            {reports.map((item: any, idx: number) => {
              const railId = type === 'straight' ? item.projectStraightId : item.projectBranchId;
              const railInfo = availableRails.find(
                (r: any) => (r.projectStraightId || r.projectBranchId) === railId
              );
              const serialCount =
                type === 'straight'
                  ? item.projectStraightSerialIdList.length
                  : item.projectBranchSerialIdList.length;

              return (
                <div
                  key={idx}
                  className="group hover:bg-muted/30 flex items-center justify-between rounded-lg px-2 py-4 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-muted text-muted-foreground rounded-md p-2">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold">
                        {railInfo?.straightSerial || railInfo?.branchSerial}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        보고 수량:{' '}
                        <span className="text-foreground font-medium">{serialCount}개</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                      선택 완료
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive opacity-0 transition-all group-hover:opacity-100"
                      onClick={() => removeRow(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
