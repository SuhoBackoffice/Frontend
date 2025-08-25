import { fetchApi } from '../api-client';
import { ApiResponse } from '@/types/api.types';
import { StraightTypeResponse, StraightLoopTypeResponse } from '@/types/straight/straight.types';

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
