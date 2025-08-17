export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T | null;
}

export class ApiError extends Error {
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}
