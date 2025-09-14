import { fetchApi } from '../api-client';
import { ApiResponse } from '@/types/api.types';
import { PostSignupRequest, UserInfoResponse } from '@/types/user/user.types';

export async function getUserInfo(): Promise<ApiResponse<UserInfoResponse>> {
  return fetchApi<UserInfoResponse>('/user/info', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function postSignup(data: PostSignupRequest): Promise<ApiResponse<null>> {
  return fetchApi<null>(`/user/signup`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
