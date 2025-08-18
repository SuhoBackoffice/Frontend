import { fetchApi } from '../api-client';
import { ApiResponse } from '@/types/api.types';
import { VersionInfoResponse } from '@/types/version/version.types';

export async function getVersionInfo(): Promise<ApiResponse<VersionInfoResponse[]>> {
  return fetchApi<VersionInfoResponse[]>('/version', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
