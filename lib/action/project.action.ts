import { ApiError } from '@/types/api.types';
import { z } from 'zod';
import { postNewProject } from '../api/project/project.api';

const yyyyMmDdSchema = z
  .string()
  .min(1, { message: '날짜를 선택해주세요.' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: '날짜 형식이 올바르지 않습니다 (YYYY-MM-DD).',
  });

const newProjectSchema = z
  .object({
    versionId: z.coerce.number().min(1, 'Version 정보를 입력해 주세요.'),
    region: z.string().min(1, '프로젝트 지역은 필수 입니다.'),
    name: z.string().min(1, '프로젝트 명칭은 필수 입니다.'),
    startDate: yyyyMmDdSchema,
    endDate: yyyyMmDdSchema,
  })
  .refine(
    (data) => {
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: '종료일은 시작일보다 빠를 수 없습니다.',
      path: ['endDate'],
    }
  );

export interface NewProjectFormState {
  message: string;
  errors?: {
    versionId?: string[];
    region?: string[];
    name?: string[];
    startDate?: string[];
    endDate?: string[];
  };
  formData?: {
    versionId: string;
    region: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  success?: boolean;
}

export async function createProjectAction(
  prevState: NewProjectFormState,
  formData: FormData
): Promise<NewProjectFormState> {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = newProjectSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: '입력값을 다시 확인해주세요.',
      errors: validatedFields.error.flatten().fieldErrors,
      formData: {
        ...rawFormData,
        versionId: rawFormData.versionId || '',
      } as NewProjectFormState['formData'],
      success: false,
    };
  }

  try {
    const response = await postNewProject(validatedFields.data);

    return {
      message: response.message,
      errors: {},
      formData: {
        versionId: '',
        region: '',
        name: '',
        startDate: '',
        endDate: '',
      },
      success: true,
    };
  } catch (e) {
    if (e instanceof ApiError) {
      return {
        message: e.message,
        errors: {},
        formData: rawFormData as NewProjectFormState['formData'],
        success: false,
      };
    } else {
      return {
        message: '서버 연결 상태가 좋지 않습니다. 다시 시도해 주세요.',
        errors: {},
        formData: rawFormData as NewProjectFormState['formData'],
        success: false,
      };
    }
  }
}
