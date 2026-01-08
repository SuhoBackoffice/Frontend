'use server';

import { z } from 'zod';
import { ApiError } from '@/types/api.types';
import { PostWorkReportRequest, PostWorkReportStatusRequest } from '@/types/work/report.types';
import { postProjectWorkReport, postWorkReportStatus } from '../api/work/report.api';

/**
 * 업무 보고 등록 스키마
 */
const createWorkReportSchema = z.object({
  workSummary: z.string().max(1000, '업무 요약은 1000자 이내로 입력해주세요.'),
  workDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식이 올바르지 않습니다 (YYYY-MM-DD).'),
  straightReportList: z.array(
    z.object({
      projectStraightId: z.number(),
      productionQuantity: z.number().min(1, '생산 수량은 1개 이상이어야 합니다.'),
      projectStraightSerialIdList: z
        .array(z.number())
        .min(1, '최소 하나 이상의 시리얼을 선택해야 합니다.'),
    })
  ),
  branchReportList: z.array(
    z.object({
      projectBranchId: z.number(),
      productionQuantity: z.number().min(1, '생산 수량은 1개 이상이어야 합니다.'),
      projectBranchSerialIdList: z
        .array(z.number())
        .min(1, '최소 하나 이상의 시리얼을 선택해야 합니다.'),
    })
  ),
});

/**
 * 보고서 상태 변경 스키마
 */
const updateReportStatusSchema = z
  .object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
    rejectReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.status === 'REJECTED' && (!data.rejectReason || data.rejectReason.trim() === '')) {
        return false;
      }
      return true;
    },
    {
      message: '반려 시에는 반려 사유를 반드시 입력해야 합니다.',
      path: ['rejectReason'],
    }
  );

export type ReportActionState = {
  success: boolean;
  message: string;
  data?: any;
  errors?: any;
};

/**
 * 업무 보고서 등록 액션
 */
export async function createWorkReportAction(
  projectId: number,
  formData: PostWorkReportRequest
): Promise<ReportActionState> {
  const validated = createWorkReportSchema.safeParse(formData);

  if (!validated.success) {
    return {
      success: false,
      message: '입력값을 다시 확인해주세요.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await postProjectWorkReport(projectId, validated.data);

    return {
      success: response.isSuccess,
      message: response.message,
      data: response.data,
    };
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : '업무 보고 등록 중 서버 오류가 발생했습니다.';
    return { success: false, message };
  }
}

/**
 * 업무 보고서 상태 변경 액션 (승인/반려)
 */
export async function updateWorkReportStatusAction(
  reportId: number,
  formData: PostWorkReportStatusRequest
): Promise<ReportActionState> {
  const validated = updateReportStatusSchema.safeParse(formData);

  if (!validated.success) {
    return {
      success: false,
      message: '처리 결과가 올바르지 않습니다.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await postWorkReportStatus(reportId, formData);

    return {
      success: response.isSuccess,
      message: response.message,
    };
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : '상태 변경 처리 중 오류가 발생했습니다.';
    return { success: false, message };
  }
}
