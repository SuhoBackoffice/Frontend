import { fetchApi } from '../api-client';
import { ApiResponse } from '@/types/api.types';
import {
  PostWorkReportStatusRequest,
  PostWorkReportRequest,
  GetProjectWorkReportListRequest,
  PostWorkReportResponse,
  GetWorkReportDetailResponse,
  GetProjectWorkReportListResponse,
  GetReportableStraightResponse,
  GetReportableStraightSerialResponse,
  GetReportableBranchResponse,
  GetReportableBranchSerialResponse,
} from '@/types/work/report.types';

/**
 * 보고서 승인 / 반려 처리
 */
export async function postWorkReportStatus(
  reportId: number,
  data: PostWorkReportStatusRequest
): Promise<ApiResponse<null>> {
  return fetchApi<null>(`/work/report/${reportId}/status`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 일일 프로젝트 업무 보고 등록
 */
export async function postProjectWorkReport(
  projectId: number,
  data: PostWorkReportRequest
): Promise<ApiResponse<PostWorkReportResponse>> {
  console.log('data : ' + data);
  return fetchApi<PostWorkReportResponse>(`/work/report/project/${projectId}`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 일일 업무 보고 상세 조회
 */
export async function getWorkReportDetail(
  reportId: number
): Promise<ApiResponse<GetWorkReportDetailResponse>> {
  return fetchApi<GetWorkReportDetailResponse>(`/work/report/${reportId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 프로젝트 업무 보고 목록 조회
 */
export async function getProjectWorkReportList(
  params: GetProjectWorkReportListRequest
): Promise<ApiResponse<GetProjectWorkReportListResponse[]>> {
  const { projectId, status } = params;

  const queryParams = new URLSearchParams();
  if (status) {
    queryParams.append('status', status);
  }

  const queryString = queryParams.toString();

  return fetchApi<GetProjectWorkReportListResponse[]>(
    `/work/report/project/${projectId}${queryString ? `?${queryString}` : ''}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * 프로젝트에서 보고 가능한 직선 레일 목록 조회
 */
export async function getReportableStraightList(
  projectId: number
): Promise<ApiResponse<GetReportableStraightResponse[]>> {
  return fetchApi<GetReportableStraightResponse[]>(`/work/report/project/${projectId}/straight`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 프로젝트에서 보고 가능한 직선 레일 시리얼 목록 조회
 */
export async function getReportableStraightSerialList(
  projectId: number,
  straightId: number
): Promise<ApiResponse<GetReportableStraightSerialResponse[]>> {
  return fetchApi<GetReportableStraightSerialResponse[]>(
    `/work/report/project/${projectId}/straight/${straightId}/serial`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * 프로젝트에서 보고 가능한 분기 레일 목록 조회
 */
export async function getReportableBranchList(
  projectId: number
): Promise<ApiResponse<GetReportableBranchResponse[]>> {
  return fetchApi<GetReportableBranchResponse[]>(`/work/report/project/${projectId}/branch`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 프로젝트에서 보고 가능한 분기 레일 시리얼 목록 조회
 */
export async function getReportableBranchSerialList(
  projectId: number,
  branchId: number
): Promise<ApiResponse<GetReportableBranchSerialResponse[]>> {
  return fetchApi<GetReportableBranchSerialResponse[]>(
    `/work/report/project/${projectId}/branch/${branchId}/serial`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
