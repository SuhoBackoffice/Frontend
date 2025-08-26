// 요청
export interface NewProjectRequest {
  versionId: number;
  region: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface GetProjectListRequest {
  keyword?: string;
  page?: number;
  size?: number;
  versionId?: number;
  startDate?: string;
  endDate?: string;
  sort?: string;
}

export interface GetProjectDetailRequest {
  projectId: number;
}

export interface PostProjectStraightRequest {
  length: number;
  straightTypeId: number;
  totalQuantity: number;
  isLoopRail: boolean;
}

export interface PatchProjectStraightRequest {
  totalQuantity: number;
}

// 응답
export interface ProjectSearchSortResponse {
  id: string;
  name: string;
}

export interface ProjectInfoResponse {
  id: number;
  version: string;
  region: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface ProjecInfoDetailResponse {
  version: string;
  region: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface ProjectInfoBranchResponse {
  projectBranchId: number;
  branchCode: string;
  branchVersion: string;
  totalQuantity: number;
  completedQuantity: number;
  branchTypeId: number;
}

export interface ProjectInfoStraightResponse {
  straightRailId: number;
  length: number;
  isLoopRail: boolean;
  straightType: string;
  totalQuantity: number;
  litzInfo: LitzWireSupportInfo;
  holePosition: number;
}

export interface LitzWireSupportInfo {
  litz1: number;
  litz2: number;
  litz3: number;
  litz4: number;
  litz5: number;
  litz6: number;
}
