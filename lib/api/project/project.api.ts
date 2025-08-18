import { fetchApi } from '../api-client';
import { ApiResponse } from '@/types/api.types';
import { NewProjectRequest } from '@/types/project/project.types';

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
