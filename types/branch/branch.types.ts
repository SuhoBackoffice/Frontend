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
