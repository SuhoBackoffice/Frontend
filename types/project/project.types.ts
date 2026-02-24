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

export interface PostProjectBranchRequest {
  branchTypeId: number;
  quantity: number;
}

export interface PatchProjectBranchRequest {
  totalQuantity: number;
}

export interface GetProjectBranchCapacityRequest {
  projectId: number;
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
  versionInfoId: number;
  version: string;
  region: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface ProjectInfoBranchResponse {
  projectBranchId: number;
  branchName: string;
  branchSerial: string;
  totalQuantity: number;
  completedQuantity: number;
}

export interface StraightListItem {
  straightRailId: number;
  serial: string;
  totalQuantity: number;
  completedQuantity: number;
  holePosition?: number;
}

export interface ProjectInfoStraightResponse {
  normalStraightList: StraightListItem[];
  loopStraightList: StraightListItem[];
}

export interface PostProjectBranchRegisterResponse {
  projectId: number;
}

export interface GetProjectBranchCapacityResponse {
  imageUrl: string;
  branchTypeId: number;
  code: string;
  name: string;
  totalQuantity: number;
  completedQuantity: number;
  capacity: number;
  branchBomShortageList: GetBranchBomShortageList[];
}

export interface GetBranchBomShortageList {
  drawingNumber: string;
  itemName: string;
  shortage: number;
}

export interface GetProjectOnGoingList {
  projectId: number;
  version: string;
  region: string;
  name: string;
  startDate: string;
  endDate: string;
}
