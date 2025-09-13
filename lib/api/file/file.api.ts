import { ApiResponse } from '@/types/api.types';
import { PostFileUploadRequest, PostFileUploadResponse } from '@/types/file/file.types';
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
