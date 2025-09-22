import {
  GetMaterialSummaryRequest,
  GetMaterialSummaryResponse,
} from '@/types/material/material.types';
import { fetchApi } from '../api-client';
import { ApiResponse } from '@/types/api.types';

export async function getMaterialSummary(
  data: GetMaterialSummaryRequest
): Promise<ApiResponse<GetMaterialSummaryResponse>> {
  const { projectId } = data;
  return fetchApi<GetMaterialSummaryResponse>(`/material/${projectId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
