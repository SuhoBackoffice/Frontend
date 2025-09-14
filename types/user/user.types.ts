// 요청
export interface PostSignupRequest {
  loginId: string;
  password: string;
  username: string;
}

// 응답
export interface UserInfoResponse {
  id: number;
  username: string;
  role: string;
}
