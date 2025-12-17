import { UserRole } from './roles';

export const ROUTE_ROLE_MAP: Array<{
  pattern: RegExp;
  minRole: UserRole;
}> = [
  // STAFF 전용
  {
    pattern: /^\/project\/[^/]+\/branch\/register$/,
    minRole: 'STAFF',
  },
  {
    pattern: /^\/project\/[^/]+\/straight\/register$/,
    minRole: 'STAFF',
  },
  {
    pattern: /^\/project\/register$/,
    minRole: 'STAFF',
  },

  // USER 이상
  {
    pattern: /^\/project(\/.*)?$/,
    minRole: 'USER',
  },
];
