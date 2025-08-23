import { fetchApi } from '../api-client';
import { ApiResponse, PagingResponse } from '@/types/api.types';
import {
  //요청
  NewProjectRequest,
  GetProjectListRequest,
  GetProjectDetailRequest,
  //응답
  ProjectSearchSortResponse,
  ProjectInfoResponse,
  ProjecInfoDetailResponse,
  ProjectInfoStraightResponse,
  ProjectInfoBranchResponse,
} from '@/types/project/project.types';

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
  params: GetProjectDetailRequest
): Promise<ApiResponse<ProjectInfoStraightResponse[]>> {
  const { projectId } = params;
  return fetchApi<ProjectInfoStraightResponse[]>(`/project/${projectId}/straight`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getProjectBranchDetail(
  params: GetProjectDetailRequest
): Promise<ApiResponse<ProjectInfoBranchResponse[]>> {
  const { projectId } = params;
  return fetchApi<ProjectInfoBranchResponse[]>(`/project/${projectId}/branch`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
