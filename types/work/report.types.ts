export interface PostWorkReportStatusRequest {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectReason?: string;
}

export interface PostWorkReportRequest {
  workSummary: string;
  workDate: string;
  straightReportList: StraightWorkReportRequest[];
  branchReportList: BranchWorkReportRequest[];
}

export interface StraightWorkReportRequest {
  projectStraightId: number;
  productionQuantity: number;
  projectStraightSerialIdList: number[];
}

export interface BranchWorkReportRequest {
  projectBranchId: number;
  productionQuantity: number;
  projectBranchSerialIdList: number[];
}

export interface GetProjectWorkReportListRequest {
  projectId: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface PostWorkReportResponse {
  workReportId: number;
}

export interface GetWorkReportDetailResponse {
  reportUserName: string;
  workSummary: string;
  workDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectReason: string | null;
  projectId: number;
  region: string;
  projectName: string;
  straightReports: StraightWorkReportResponse[];
  branchReports: BranchWorkReportResponse[];
  owner: boolean;
}

export interface StraightWorkReportResponse {
  straightSerial: string;
  projectStraightId: number;
  productionQuantity: number;
  productionSerials: StraightProductionSerial[];
}

export interface StraightProductionSerial {
  projectStraightSerialId: number;
  serial: string;
}

export interface BranchWorkReportResponse {
  branchSerial: string;
  projectBranchId: number;
  productionQuantity: number;
  productionSerials: BranchProductionSerial[];
}

export interface BranchProductionSerial {
  projectBranchSerialId: number;
  serial: string;
}

export interface GetProjectWorkReportListResponse {
  workReportId: number;
  reportUserName: string;
  workSummary: string;
  workDate: string;
  status: string;
}

/**
 * 보고 가능한 직선 레일 목록
 */
export interface GetReportableStraightResponse {
  projectStraightId: number;
  straightSerial: string;
  totalQuantity: number;
  completedQuantity: number;
  pendingQuantity: number;
  availableQuantity: number;
}

/**
 * 보고 가능한 직선 레일 시리얼 목록
 */
export interface GetReportableStraightSerialResponse {
  straightSerialId: number;
  serial: string;
}

/**
 * 보고 가능한 분기 레일 목록
 */
export interface GetReportableBranchResponse {
  projectBranchId: number;
  branchSerial: string;
  totalQuantity: number;
  completedQuantity: number;
  pendingQuantity: number;
  availableQuantity: number;
}

/**
 * 보고 가능한 분기 레일 시리얼 목록
 */
export interface GetReportableBranchSerialResponse {
  branchSerialId: number;
  serial: string;
}
