import { fetchApi } from '../api-client';
import { ApiResponse, FileResponse, PagingResponse } from '@/types/api.types';
import {
  //요청
  NewProjectRequest,
  GetProjectListRequest,
  GetProjectDetailRequest,
  PostProjectStraightRequest,
  GetProjectBranchCapacityRequest,
  GetBranchCapacityDetailRequest,
  //응답
  ProjectSearchSortResponse,
  ProjectInfoResponse,
  ProjecInfoDetailResponse,
  ProjectInfoStraightResponse,
  ProjectInfoBranchResponse,
  PatchProjectStraightRequest,
  PostProjectBranchRequest,
  PostProjectBranchRegisterResponse,
  PatchProjectBranchRequest,
  GetProjectBranchCapacityResponse,
  BranchCapacitySortType,
  GetBranchCapacityDetailResponse,
  GetProjectOnGoingList,
} from '@/types/project/project.types';
import { BranchDetailResponse } from '@/types/branch/branch.types';

export async function postNewProject(data: NewProjectRequest): Promise<ApiResponse<null>> {
  return fetchApi<null>('/project/new', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getProjectSearchSort(): Promise<ApiResponse<ProjectSearchSortResponse[]>> {
  return fetchApi<ProjectSearchSortResponse[]>('/project/sort-type', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getProjectList(
  params: GetProjectListRequest
): Promise<ApiResponse<PagingResponse<ProjectInfoResponse>>> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  const url = `/project${queryString ? `?${queryString}` : ''}`;

  return fetchApi<PagingResponse<ProjectInfoResponse>>(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getProjectDetail(
  params: GetProjectDetailRequest
): Promise<ApiResponse<ProjecInfoDetailResponse>> {
  const { projectId } = params;
  return fetchApi<ProjecInfoDetailResponse>(`/project/${projectId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getProjectStraightDetail(
  projectId: number,
  length?: string
): Promise<ApiResponse<ProjectInfoStraightResponse>> {
  const url = length
    ? `/project/${projectId}/straight?length=${length}`
    : `/project/${projectId}/straight`;
  return fetchApi<ProjectInfoStraightResponse>(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getProjectBranchDetail(
  projectId: number,
  keyword?: string
): Promise<ApiResponse<ProjectInfoBranchResponse[]>> {
  const url = keyword
    ? `/project/${projectId}/branch?keyword=${keyword}`
    : `/project/${projectId}/branch`;
  return fetchApi<ProjectInfoBranchResponse[]>(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getProjectBranchDetailById(
  projectId: number,
  projectBranchId: number
): Promise<ApiResponse<BranchDetailResponse>> {
  return fetchApi<BranchDetailResponse>(`/project/${projectId}/branch/${projectBranchId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function postProjectStraightRegister(
  data: PostProjectStraightRequest[],
  projectId: number
): Promise<ApiResponse<null>> {
  return fetchApi<null>(`/project/${projectId}/straight`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function deleteProjectStraight(projectStraightId: number): Promise<ApiResponse<null>> {
  return fetchApi<null>(`/project/straight/${projectStraightId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function patchProjectStraight(
  data: PatchProjectStraightRequest,
  projectStraightId: number
): Promise<ApiResponse<null>> {
  return fetchApi<null>(`/project/straight/${projectStraightId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function postProjectBranchRegister(
  data: PostProjectBranchRequest[],
  projectId: number
): Promise<ApiResponse<PostProjectBranchRegisterResponse>> {
  return fetchApi<PostProjectBranchRegisterResponse>(`/project/${projectId}/branch`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function deleteProjectBranch(projectBranchId: number): Promise<ApiResponse<null>> {
  return fetchApi<null>(`/project/branch/${projectBranchId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function patchProjectBranch(
  data: PatchProjectBranchRequest,
  projectBranchId: number
): Promise<ApiResponse<null>> {
  return fetchApi<null>(`/project/branch/${projectBranchId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getProjectQuantityList(projectId: number): Promise<FileResponse> {
  return fetchApi(`/project/${projectId}/quantity-list`, {
    method: 'GET',
    isBlob: true,
  });
}

export function getProjectBranchCapacity(
  data: GetProjectBranchCapacityRequest
): Promise<ApiResponse<GetProjectBranchCapacityResponse[]>> {
  const { projectId, sort, dir } = data;
  const queryParams = new URLSearchParams();
  if (sort) queryParams.append('sort', sort);
  if (dir) queryParams.append('dir', dir);
  const queryString = queryParams.toString();
  const url = `/project/${projectId}/branch/capacity${queryString ? `?${queryString}` : ''}`;

  return fetchApi<GetProjectBranchCapacityResponse[]>(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getProjectBranchCapacitySortTypes(): Promise<ApiResponse<BranchCapacitySortType[]>> {
  return fetchApi<BranchCapacitySortType[]>('/project/branch/capacity/types', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getProjectBranchCapacityDetail(
  data: GetBranchCapacityDetailRequest
): Promise<ApiResponse<GetBranchCapacityDetailResponse>> {
  const { projectId, projectBranchId, sort, dir, onlyShortage } = data;
  const queryParams = new URLSearchParams();
  if (sort) queryParams.append('sort', sort);
  if (dir) queryParams.append('dir', dir);
  if (onlyShortage !== undefined) queryParams.append('onlyShortage', String(onlyShortage));
  const queryString = queryParams.toString();
  const url = `/project/${projectId}/branch/${projectBranchId}/capacity${queryString ? `?${queryString}` : ''}`;

  return fetchApi<GetBranchCapacityDetailResponse>(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getProjectBranchCapacityAnalyzeSortTypes(): Promise<ApiResponse<BranchCapacitySortType[]>> {
  return fetchApi<BranchCapacitySortType[]>('/project/branch/capacity/analyze/types', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getOnGoingProjectList(): Promise<ApiResponse<GetProjectOnGoingList[]>> {
  return fetchApi<GetProjectOnGoingList[]>(`/project/ongoing`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
