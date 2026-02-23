import { fetchApi } from '../api-client';
import { ApiResponse } from '@/types/api.types';
import {
  StraightTypeResponse,
  StraightLoopTypeResponse,
  StraightDetailResponse,
  StraightBomItem,
} from '@/types/straight/straight.types';

export async function getNormalStraightType(): Promise<ApiResponse<StraightTypeResponse[]>> {
  return fetchApi<StraightTypeResponse[]>('/straight/type/normal', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getLoopStraightType(): Promise<ApiResponse<StraightLoopTypeResponse[]>> {
  return fetchApi<StraightLoopTypeResponse[]>('/straight/type/loop', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getStraightDetail(
  straightRailId: number,
  projectId: number
): Promise<ApiResponse<StraightDetailResponse>> {
  return fetchApi<StraightDetailResponse>(`/project/${projectId}/straight/${straightRailId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getStraightBom(
  straightRailId: number
): Promise<ApiResponse<StraightBomItem[]>> {
  return fetchApi<StraightBomItem[]>(`/straight/bom/${straightRailId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
