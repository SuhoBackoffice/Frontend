import { Badge } from '@/components/ui/badge';
import { BranchWorkReportResponse } from '@/types/work/report.types';
import { GitBranch } from 'lucide-react';

export const BranchReportList = ({ reports }: { reports: BranchWorkReportResponse[] }) => {
  const totalQty = reports.reduce((sum, r) => sum + r.productionQuantity, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5" />
        <h3 className="text-2xl font-bold">분기레일 생산 실적</h3>
        <Badge className="text-base font-bold">total : {totalQty} SET</Badge>
      </div>

      <div className="space-y-2">
        {reports?.length > 0 ? (
          reports.map((item) => (
            <div
              key={item.branchSerial}
              className="flex flex-col gap-3 rounded-lg border px-4 py-3 md:flex-row md:items-center md:justify-between"
            >
              {/* Left */}
              <div className="space-y-2">
                <p className="text-lg font-semibold tracking-tight">{item.branchSerial}</p>

                <div className="flex flex-wrap gap-1.5">
                  {item.productionSerials.map((s) => (
                    <span
                      key={s.projectBranchSerialId}
                      className="bg-muted text-muted-foreground rounded-md border px-2 py-0.5 text-[11px] font-medium"
                    >
                      {s.serial}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right */}
              <div className="flex items-end gap-1 self-end md:self-auto">
                <span className="text-2xl font-bold">{item.productionQuantity}</span>
                <span className="text-muted-foreground text-xs font-medium uppercase">QTY</span>
              </div>
            </div>
          ))
        ) : (
          <div className="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-10">
            <p className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
              분기 레일 생산 정보 없음
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
