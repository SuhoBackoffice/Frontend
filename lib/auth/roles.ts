export const ROLE_LEVEL = {
  USER: 1,
  STAFF: 2,
  ADMIN: 3,
} as const;

export type UserRole = keyof typeof ROLE_LEVEL;
