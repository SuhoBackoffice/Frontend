import { ApiError } from '@/types/api.types';
import { postLogin } from '../api/auth/auth.api';
import { z } from 'zod';

const loginSchema = z.object({
  loginId: z.string().min(1, { message: '아이디를 입력해 주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해 주세요.' }),
});

export interface LoginFormState {
  message: string;
  errors?: {
    loginId?: string[];
    password?: string[];
  };
  formData?: {
    loginId: string;
    password: string;
  };
  success?: boolean;
}

export async function loginAction(prevState: LoginFormState, formData: FormData) {
  const rawFormData = {
    loginId: formData.get('loginId') as string,
    password: formData.get('password') as string,
  };

  const validatedFields = loginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: '로그인 정보를 다시 확인해주세요.',
      errors: validatedFields.error.flatten().fieldErrors,
      formData: rawFormData,
      success: false,
    };
  }

  try {
    const { loginId, password } = validatedFields.data;

    const response = await postLogin({ loginId, password });

    return {
      message: response.message,
      errors: {},
      formData: { loginId: '', password: '' },
      success: true,
    };
  } catch (e) {
    if (e instanceof ApiError) {
      return {
        message: e.message,
        errors: {},
        formData: rawFormData,
        success: false,
      };
    } else {
      return {
        message: '서버 연결 상태가 좋지 않습니다. 다시 시도해 주세요.',
        errors: {},
        formData: rawFormData,
        success: false,
      };
    }
  }
}
