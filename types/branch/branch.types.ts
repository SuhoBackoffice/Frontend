// 공통
export interface BranchSerialInfo {
  serial: string;
  serialState: string;
  productionState: string;
  producedAt: string | null;
  inactiveReason: string | null;
}

export interface BranchDetailResponse {
  serial: string;
  totalQuantity: number;
  completedQuantity: number;
  code: string;
  name: string;
  branchVersion: string;
  imageUrl: string | null;
  serialInfoList: BranchSerialInfo[];
}

// 요청
export interface GetBranchLatestBomRequest {
  branchCode: string;
  versionInfoId: string;
}

export interface GetBranchBomListRequest {
  branchTypeId: number;
}

export interface UploadBranchBomRequest {
  branchCode: string;
  versionInfoId: number;
  file: File;
  imageUrl?: string | null;
}

// 응답
export interface BranchInfoResponse {
  branchTypeId: number;
  versionName: string;
  versionId: number;
  branchCode: string;
  version: string;
  branchDetailinfoDtoList: BranchDetailInfoBom[];
}

export interface BranchDetailInfoBom {
  branchBomId: number;
  itemType: string;
  drawingNumber: string;
  itemName: string;
  specification: string;
  unitQuantity: number;
  unit: string;
  suppliedMaterial: boolean;
}

export interface UploadBranchBomResponse {
  branchTypeId: number;
}
