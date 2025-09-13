import { ApiResponse } from '@/types/api.types';
import {
  DeleteUploadedFileRequest,
  PostFileUploadRequest,
  PostFileUploadResponse,
} from '@/types/file/file.types';
import { fetchApi } from '../api-client';

export async function postFileUpload({
  file,
  type,
}: PostFileUploadRequest): Promise<ApiResponse<PostFileUploadResponse>> {
  const qs = new URLSearchParams({
    type,
  });

  const form = new FormData();
  form.append('file', file);

  return fetchApi<PostFileUploadResponse>(`/file?${qs.toString()}`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
}

export async function deleteUploadedFile({
  fileUrl,
}: DeleteUploadedFileRequest): Promise<ApiResponse<null>> {
  const qs = new URLSearchParams({
    fileUrl,
  });

  return fetchApi<null>(`/file?${qs.toString()}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
