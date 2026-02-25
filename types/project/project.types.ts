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
  sort?: string;
  dir?: 'ASC' | 'DESC';
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
  imageUrl: string | null;
  projectBranchId: number;
  serial: string;
  name: string;
  totalQuantity: number;
  completedQuantity: number;
  capacity: number;
  remainingQuantity: number;
  effectiveCapacity: number;
}

export interface BranchCapacitySortType {
  sort: string;
  description: string;
}

export interface GetBranchCapacityDetailRequest {
  projectId: number;
  projectBranchId: number;
  sort?: string;
  dir?: 'ASC' | 'DESC';
  onlyShortage?: boolean;
}

export interface BranchBomShortageItem {
  drawingNumber: string;
  itemName: string;
  itemType: string;
  specification: string;
  unitQuantity: number;
  unit: string;
  suppliedMaterial: boolean;
  stockQuantity: number;
  requiredQuantity: number;
  shortageQuantity: number;
  isShortage: boolean;
  availableCapacity: number;
}

export interface GetBranchCapacityDetailResponse {
  serial: string;
  code: string;
  name: string;
  totalQuantity: number;
  completedQuantity: number;
  remainingQuantity: number;
  capacity: number;
  effectiveCapacity: number;
  bomShortageList: BranchBomShortageItem[];
}

export interface GetProjectOnGoingList {
  projectId: number;
  version: string;
  region: string;
  name: string;
  startDate: string;
  endDate: string;
}

// ── 직선레일 Capacity ──────────────────────────────────────────────────────────

export interface GetProjectStraightCapacityRequest {
  projectId: number;
  sort?: string;
  dir?: 'ASC' | 'DESC';
}

export interface GetStraightCapacityDetailRequest {
  projectId: number;
  projectStraightId: number;
  sort?: string;
  dir?: 'ASC' | 'DESC';
  onlyShortage?: boolean;
}

export interface GetProjectStraightCapacityResponse {
  projectStraightId: number;
  serial: string;
  length: number;
  isLoopRail: boolean;
  totalQuantity: number;
  completedQuantity: number;
  capacity: number;
  remainingQuantity: number;
  effectiveCapacity: number;
}

export interface StraightCapacitySortType {
  sort: string;
  description: string;
}

export interface StraightBomShortageItem {
  materialCode: string;
  itemName: string;
  unitQuantity: number;
  stockQuantity: number;
  requiredQuantity: number;
  shortageQuantity: number;
  isShortage: boolean;
  availableCapacity: number;
}

export interface GetStraightCapacityDetailResponse {
  serial: string;
  length: number;
  isLoopRail: boolean;
  totalQuantity: number;
  completedQuantity: number;
  remainingQuantity: number;
  capacity: number;
  effectiveCapacity: number;
  bomShortageList: StraightBomShortageItem[];
}
