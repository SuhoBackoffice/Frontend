import { fetchApi } from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { LoginRequest } from '@/types/user.types';

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
