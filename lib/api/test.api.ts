import { fetchApi } from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';

export async function getServerHealthCheck(): Promise<ApiResponse<null>> {
  return fetchApi<null>('/auth/health', {
    method: 'GET',
    credentials: 'include',
  });
}

export async function getServerHealthErrorCheck(): Promise<ApiResponse<null>> {
  return fetchApi<null>('/auth/health-exception', {
    method: 'GET',
    credentials: 'include',
  });
}
