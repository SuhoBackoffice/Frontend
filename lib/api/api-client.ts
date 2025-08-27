const API_BASE_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;

import { ApiResponse, ApiError } from '@/types/api.types';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);

  if (!headers.has('Contet-Typne')) {
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
    return response.json() as Promise<ApiResponse<T>>;
  }

  const errBody = await response.json().catch(() => null);
  const message = errBody?.message ?? response.statusText;
  const code = errBody?.code ?? response.status.toString();
  throw new ApiError(response.status, message, code);
}
