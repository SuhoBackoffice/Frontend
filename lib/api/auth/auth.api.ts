import { fetchApi } from '../api-client';
import { ApiResponse } from '@/types/api.types';
import { LoginRequest } from '@/types/auth/auth.types';

export async function postLogin(data: LoginRequest): Promise<ApiResponse<null>> {
  return fetchApi<null>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
