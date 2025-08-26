import {
  BranchDetailInfoBom,
  BranchInfoResponse,
  GetBranchBomListRequest,
  GetBranchLatestBomRequest,
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
