import { fetchApi } from '../api-client';
import { ApiResponse } from '@/types/api.types';
import { UserInfoResponse } from '@/types/user/user.types';

export async function getUserInfo(): Promise<ApiResponse<UserInfoResponse>> {
  return fetchApi<UserInfoResponse>('/user/info', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
