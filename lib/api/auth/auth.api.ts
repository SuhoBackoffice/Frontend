import { fetchApi } from '../api-client';
import { ApiResponse } from '@/types/api.types';
import { LoginRequest, LoginResponse } from '@/types/auth/auth.types';

export async function postLogin(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  return fetchApi<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function postLogout(): Promise<ApiResponse<null>> {
  return fetchApi<null>('/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
