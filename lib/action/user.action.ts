'use server';

import { z } from 'zod';
import { postSignup } from '../api/user/user.api';
import { ApiError } from '@/types/api.types';

const postSignupSchema = z
  .object({
    loginId: z.string().min(1, { message: '로그인 아이디를 입력해 주세요.' }),
    password: z.string().min(1, { message: '비밀번호를 입력해 주세요.' }),
    passwordCheck: z.string().min(1, { message: '비밀번호 확인을 입력해 주세요.' }),
    username: z
      .string()
      .min(1, { message: '이름을 입력해 주세요.' })
      .max(10, { message: '이름은 10자리 미만이어야 합니다.' }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

export interface SignupFormState {
  success: boolean;
  message: string;
  errors?: {
    loginId?: string[];
    password?: string[];
    passwordCheck?: string[];
    username?: string[];
  };
  formData?: {
    loginId: string;
    username: string;
  };
}

export async function postSignupAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = postSignupSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력값을 다시 확인해주세요.',
      errors: validatedFields.error.flatten().fieldErrors,
      formData: {
        loginId: String(rawFormData.loginId),
        username: String(rawFormData.username),
      },
    };
  }

  try {
    const { loginId, password, username } = validatedFields.data;
    const response = await postSignup({ loginId, password, username });

    return {
      success: true,
      message: response.message,
    };
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : '회원가입 실패, 서버 상태가 좋지 않습니다.';
    return {
      success: false,
      message: message,
      formData: {
        loginId: String(rawFormData.loginId),
        username: String(rawFormData.username),
      },
    };
  }
}
