'use server';

import { z } from 'zod';
import { patchProjectBranch } from '../api/project/project.api';
import { ApiError } from '@/types/api.types';

const updateBranchSchema = z.object({
  totalQuantity: z.coerce.number().int().positive('수량은 1 이상이어야 합니다.'),
});

export type UpdateStraightState = {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof updateBranchSchema>['fieldErrors'];
};

export async function updateBranchRailAction(
  projectBranchId: number,
  formData: { totalQuantity: number | '' }
): Promise<UpdateStraightState> {
  const validated = updateBranchSchema.safeParse(formData);

  if (!validated.success) {
    return {
      success: false,
      message: '입력값을 다시 확인해주세요.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const payload = validated.data;
    const response = await patchProjectBranch(payload, projectBranchId);

    return {
      success: response.isSuccess,
      message: response.message,
    };
  } catch (err) {
    const message = err instanceof ApiError ? err.message : '서버 오류로 분기레일 업데이트 실패';
    return {
      success: false,
      message,
    };
  }
}
