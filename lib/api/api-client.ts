const API_BASE_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;

import { ApiResponse, ApiError } from '@/types/api.types';

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options });

  if (response.ok) {
    return response.json() as Promise<ApiResponse<T>>;
  }

  const errBody = await response.json().catch(() => null);
  const message = errBody?.message ?? response.statusText;
  const code = errBody?.code ?? response.status.toString();
  throw new ApiError(response.status, message, code);
}
