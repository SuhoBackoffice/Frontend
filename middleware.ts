import { NextRequest, NextResponse } from 'next/server';
import { ROLE_LEVEL, UserRole } from '@/lib/auth/roles';
import { ROUTE_ROLE_MAP } from './lib/auth/role-routes';

function getRequiredRole(pathname: string): UserRole | null {
  const rule = ROUTE_ROLE_MAP.find(({ pattern }) => pattern.test(pathname));

  return rule?.minRole ?? null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 완전 공개 경로
  if (pathname === '/' || pathname.startsWith('/signup')) {
    return NextResponse.next();
  }

  const requiredRole = getRequiredRole(pathname);

  if (!requiredRole) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get('accessToken')?.value;
  const userRole = req.cookies.get('userRole')?.value as UserRole | undefined;

  if (!accessToken || !userRole) {
    return rewriteUnauthorized(req);
  }

  if (!ROLE_LEVEL[userRole]) {
    return rewriteUnauthorized(req);
  }

  if (ROLE_LEVEL[userRole] < ROLE_LEVEL[requiredRole]) {
    return rewriteForbidden(req);
  }

  return NextResponse.next();
}

/* ===== helpers ===== */

function rewriteUnauthorized(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = '/unauthorized';
  return NextResponse.rewrite(url);
}

function rewriteForbidden(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = '/forbidden';
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/project/:path*'],
};
