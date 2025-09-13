import {
  BranchDetailInfoBom,
  BranchInfoResponse,
  GetBranchBomListRequest,
  GetBranchLatestBomRequest,
  UploadBranchBomRequest,
  UploadBranchBomResponse,
} from '@/types/branch/branch.types';
import { fetchApi } from '../api-client';
import { ApiResponse } from '@/types/api.types';

export async function getBranchLatestBomList(
  params: GetBranchLatestBomRequest
): Promise<ApiResponse<BranchInfoResponse>> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  const url = `/branch/bom/latest${queryString ? `?${queryString}` : ''}`;

  return fetchApi<BranchInfoResponse>(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getBranchBomList(
  params: GetBranchBomListRequest
): Promise<ApiResponse<BranchDetailInfoBom[]>> {
  const { branchTypeId } = params;
  return fetchApi<BranchDetailInfoBom[]>(`/branch/bom/${branchTypeId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function uploadBranchBom({
  branchCode,
  versionInfoId,
  imageUrl,
  file,
}: UploadBranchBomRequest): Promise<ApiResponse<UploadBranchBomResponse>> {
  const qs = new URLSearchParams({
    branchCode,
    versionInfoId: String(versionInfoId),
  });

  if (imageUrl) {
    qs.append('imageUrl', imageUrl);
  }

  const form = new FormData();
  form.append('file', file);

  return fetchApi<UploadBranchBomResponse>(`/branch/bom/upload?${qs.toString()}`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
}
