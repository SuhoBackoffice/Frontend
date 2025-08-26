'use server';

import { z } from 'zod';
import { patchProjectStraight } from '../api/project/project.api';
import { ApiError } from '@/types/api.types';

const updateStraightSchema = z.object({
  totalQuantity: z.coerce.number().int().positive('수량은 1 이상이어야 합니다.'),
});

export type UpdateStraightState = {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof updateStraightSchema>['fieldErrors'];
};

export async function updateStraightRailAction(
  projectStraightId: number,
  formData: { totalQuantity: number | '' } // formData를 인자로 직접 받도록 변경
): Promise<UpdateStraightState> {
  const validated = updateStraightSchema.safeParse(formData);

  if (!validated.success) {
    return {
      success: false,
      message: '입력값을 다시 확인해주세요.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const payload = validated.data;
    const response = await patchProjectStraight(payload, projectStraightId);

    return {
      success: response.isSuccess, // API 응답에 따라 success 값 설정
      message: response.message,
    };
  } catch (err) {
    const message = err instanceof ApiError ? err.message : '서버 오류로 업데이트 실패';
    return {
      success: false,
      message,
    };
  }
}
