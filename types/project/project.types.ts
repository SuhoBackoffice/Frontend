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

// 응답
export interface ProjectSearchSortResponse {
  id: string;
  name: string;
}

export interface ProjectInfoResponse {
  version: string;
  region: string;
  name: string;
  startDate: string;
  endDate: string;
}
