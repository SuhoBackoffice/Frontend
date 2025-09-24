'use server';

import { z } from 'zod';
import { postMaterialInbound } from '../api/material/material.api';
import { ApiError } from '@/types/api.types';
import { MaterialInboundItemRequest } from '@/types/material/material.types';

const materialItemSchema = z.object({
  drawingNumber: z.string().min(1, '도면 번호는 필수 입력입니다.'),
  itemName: z.string().min(1, '품명은 필수 입력입니다.'),
  quantity: z.coerce.number().int().min(1, '수량은 1 이상이어야 합니다.'),
});

const createInboundMaterialsSchema = z
  .string()
  .min(1, '최소 하나 이상의 자재 정보를 추가해주세요.')
  .transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '자재 데이터 형식이 올바르지 않습니다.',
      });
      return z.NEVER;
    }
  })
  .pipe(z.array(materialItemSchema).min(1, '최소 하나 이상의 자재 정보를 추가해주세요.'));

type RowError = {
  drawingNumber?: string;
  itemName?: string;
  quantity?: string;
};

export interface InboundMaterialFormState {
  message: string;
  errors?: RowError[];
  success?: boolean;
}

export async function createMaterialInboundAction(
  projectId: number,
  prevState: InboundMaterialFormState,
  formData: FormData
): Promise<InboundMaterialFormState> {
  const rawFormData = {
    materialsData: formData.get('materialsData'),
  };

  const validatedFields = createInboundMaterialsSchema.safeParse(rawFormData.materialsData);

  if (!validatedFields.success) {
    const rowErrors: RowError[] = [];
    validatedFields.error.issues.forEach((issue) => {
      const rowIndex = issue.path[0] as number;
      const fieldName = issue.path[1] as keyof RowError;

      if (typeof rowIndex === 'number' && fieldName) {
        if (!rowErrors[rowIndex]) {
          rowErrors[rowIndex] = {};
        }
        rowErrors[rowIndex][fieldName] = issue.message;
      }
    });

    return {
      message: '입력값을 다시 확인해주세요.',
      errors: rowErrors,
      success: false,
    };
  }

  try {
    const dataToSubmit: MaterialInboundItemRequest[] = validatedFields.data;
    const response = await postMaterialInbound({
      projectId,
      materials: dataToSubmit,
    });

    return {
      message: response.message || '자재 입고가 성공적으로 등록되었습니다.',
      errors: [],
      success: true,
    };
  } catch (e) {
    const message = e instanceof ApiError ? e.message : '자재 등록 실패. 서버 상태를 점검해주세요.';
    return {
      message,
      success: false,
    };
  }
}
