import {
  GetMaterialInboundDetailHistoryResponse,
  GetMaterialInboundDetailHistroyRequest,
  GetMaterialInboundHistoryResponse,
  GetMaterialInboundHistroyRequest,
  GetMaterialSearchRequest,
  GetMaterialSearchResponse,
  GetMaterialSummaryRequest,
  GetMaterialSummaryResponse,
  PostMaterialInboundRequest,
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

export async function getMaterialHistory(
  data: GetMaterialInboundHistroyRequest
): Promise<ApiResponse<GetMaterialInboundHistoryResponse[]>> {
  const { projectId, keyword } = data;

  const queryParams = new URLSearchParams();
  if (keyword !== undefined && keyword !== null) {
    queryParams.append('keyword', keyword);
  }

  const queryString = queryParams.toString();
  const url = `/material/history/${projectId}${queryString ? `?${queryString}` : ''}`;

  return fetchApi<GetMaterialInboundHistoryResponse[]>(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getMaterialDetailHistroy(
  data: GetMaterialInboundDetailHistroyRequest
): Promise<ApiResponse<GetMaterialInboundDetailHistoryResponse[]>> {
  const { projectId, keyword, date } = data;

  const queryParams = new URLSearchParams();
  if (keyword !== undefined && keyword !== null) {
    queryParams.append('keyword', keyword);
  }

  queryParams.append('date', date);

  const queryString = queryParams.toString();
  const url = `/material/history/detail/${projectId}${queryString ? `?${queryString}` : ''}`;

  return fetchApi<GetMaterialInboundDetailHistoryResponse[]>(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getMaterialSearch(
  data: GetMaterialSearchRequest
): Promise<ApiResponse<GetMaterialSearchResponse[]>> {
  const { projectId, keyword } = data;

  const queryParams = new URLSearchParams();
  queryParams.append('keyword', keyword);

  const queryString = queryParams.toString();
  const url = `/material/inbound/${projectId}${queryString ? `?${queryString}` : ''}`;

  return fetchApi<GetMaterialSearchResponse[]>(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function postMaterialInbound(
  data: PostMaterialInboundRequest
): Promise<ApiResponse<null>> {
  const { projectId, materials } = data;
  return fetchApi<null>(`/material/inbound/${projectId}`, {
    method: 'POST',
    body: JSON.stringify(materials),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
