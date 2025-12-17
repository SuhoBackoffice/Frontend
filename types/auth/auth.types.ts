// 요청
export interface LoginRequest {
  loginId: string;
  password: string;
}

// 응답
export interface LoginResponse {
  username: string;
  role: string;
}
