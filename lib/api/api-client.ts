const API_BASE_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;

import { ApiResponse, ApiError, FileResponse } from '@/types/api.types';

export async function fetchApi(
  _endpoint: string,
  options: RequestInit & { isBlob: true }
): Promise<FileResponse>;

export async function fetchApi<T>(
  _endpoint: string,
  _options?: RequestInit & { isBlob?: false }
): Promise<ApiResponse<T>>;

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit & { isBlob?: boolean } = {}
): Promise<ApiResponse<T> | FileResponse> {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
  }

  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
      .join('; ');

    if (cookieHeader) {
      headers.set('Cookie', cookieHeader);
    }
  }

  const finalOptions: RequestInit = {
    ...options,
    headers: headers,
    credentials: 'include',
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);

  if (response.ok) {
    if (options.isBlob) {
      return {
        blob: await response.blob(),
        headers: response.headers,
      };
    }
    return response.json() as Promise<ApiResponse<T>>;
  }

  const errBody = await response.json().catch(() => null);
  const message = errBody?.message ?? response.statusText;
  const code = errBody?.code ?? response.status.toString();
  throw new ApiError(response.status, message, code);
}
