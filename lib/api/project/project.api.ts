import { fetchApi } from '../api-client';
import { ApiResponse } from '@/types/api.types';
import { NewProjectRequest, ProjectSearchSortRequest } from '@/types/project/project.types';

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

export async function getProjectSearchSort(): Promise<ApiResponse<ProjectSearchSortRequest[]>> {
  return fetchApi<ProjectSearchSortRequest[]>('/project/sort-type', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
