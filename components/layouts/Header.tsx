'use client';

import Link from 'next/link';
import Image from 'next/image';
import logoImage from '../../public/logo.png';
import NavLink from './NavLink';

import { ThemeToggle } from '../theme/ThemeToggle';
import { useAuthStore } from '@/lib/store/auth.store';

import { LoginDialog } from '../auth/LoginDialog';
import { LogoutDialog } from '../auth/LogoutDialog';
import { SignupButton } from '../auth/SingupButton';

const navItems = [
  { href: '/project', text: '프로젝트' },
  { href: '/project/register', text: '신규 프로젝트' },
  { href: '/about', text: '소개' },
];

export default function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <header className="bg-background/70 sticky top-0 z-40 border-b backdrop-blur-lg">
      <div className="container flex h-[var(--header-height)] items-center px-4">
        <div className="grid w-full grid-cols-[200px_1fr_200px] items-center">
          {/* 홈 페이지 */}
          <div className="flex items-center justify-start">
            <Link href="/" className="relative h-10 w-40">
              <Image
                src={logoImage}
                alt="홈으로 이동"
                fill
                style={{ objectFit: 'contain' }}
                priority
                sizes="160px"
              />
            </Link>
          </div>

          {/* 네비게이션 파트 */}
          <nav className="flex w-full items-center justify-start gap-8">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} className="text-2xl">
                {item.text}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            {/* 로그인 상태에 따른 버튼 관리 */}
            {isLoggedIn ? (
              <LogoutDialog />
            ) : (
              <>
                <SignupButton />
                <LoginDialog />
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
