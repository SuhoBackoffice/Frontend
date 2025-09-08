export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T | null;
}

export interface FileResponse {
  blob: Blob;
  headers: Headers;
}

export interface PagingResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}

export class ApiError extends Error {
  public status: number;
  public code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}
