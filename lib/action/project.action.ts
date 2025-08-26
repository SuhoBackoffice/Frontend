import { ApiError } from '@/types/api.types';
import { z } from 'zod';
import { postNewProject, postProjectStraightRegister } from '../api/project/project.api';
import { PostProjectStraightRequest } from '@/types/project/project.types';

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

// 프로젝트 직선 등록 action
const straightRailSchema = z.object({
  length: z.coerce
    .number()
    .min(300, '길이는 300mm 이상이어야 합니다.')
    .max(3600, '길이는 3600mm 이하이어야 합니다.'),
  straightTypeId: z.coerce.number().int().positive('유효한 타입을 선택해주세요.'),
  totalQuantity: z.coerce.number().int().positive('수량은 1 이상이어야 합니다.'),
  isLoopRail: z.boolean().default(false),
});

const createStraightsSchema = z
  .string()
  .min(1, '최소 하나 이상의 레일 정보를 추가해주세요.')
  .transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '데이터 형식이 올바르지 않습니다.',
      });
      return z.NEVER;
    }
  })
  .pipe(z.array(straightRailSchema).min(1, '최소 하나 이상의 레일 정보를 추가해주세요.'));

type RowError = {
  length?: string;
  straightTypeId?: string;
  totalQuantity?: string;
};

export interface CreateStraightsFormState {
  message: string;
  errors?: RowError[];
  success?: boolean;
}

export async function createProjectStraightAction(
  projectId: number,
  prevState: CreateStraightsFormState,
  formData: FormData
): Promise<CreateStraightsFormState> {
  const rawFormData = {
    straightsData: formData.get('straightsData'),
  };

  const validatedFields = createStraightsSchema.safeParse(rawFormData.straightsData);

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
    const dataToSubmit: PostProjectStraightRequest[] = validatedFields.data;
    const response = await postProjectStraightRegister(dataToSubmit, projectId);
    return {
      message: response.message || '직선 레일이 성공적으로 등록되었습니다.',
      success: true,
    };
  } catch (e) {
    const message =
      e instanceof ApiError ? e.message : '서버 연결 상태가 좋지 않습니다. 다시 시도해 주세요.';
    return {
      message,
      success: false,
    };
  }
}
