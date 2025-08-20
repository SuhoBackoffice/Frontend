import { fetchApi } from '../api-client';
import { ApiResponse, PagingResponse } from '@/types/api.types';
import {
  NewProjectRequest,
  ProjectSearchSortResponse,
  GetProjectListRequest,
  ProjectInfoResponse,
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
