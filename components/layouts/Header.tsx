'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, FolderKanban, Info, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import logoLight from '../../public/logoLight.png';
import logoDark from '../../public/logoDark.png';

import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useAuthStore } from '@/lib/store/auth.store';
import { LoginDialog } from '../auth/LoginDialog';
import { LogoutDialog } from '../auth/LogoutDialog';
import { SignupButton } from '../auth/SingupButton';
import { NotificationBell } from './NotificationBell';
import { Skeleton } from '../ui/skeleton';

type NavSubItem = {
  href: string;
  text: string;
};

type NavItem = {
  text: string;
  icon: LucideIcon;
  items: NavSubItem[];
};

const navItems: NavItem[] = [
  {
    text: '프로젝트',
    icon: FolderKanban,
    items: [
      { href: '/project', text: '프로젝트 조회' },
      { href: '/project/register', text: '신규 프로젝트' },
    ],
  },
  {
    text: '관리',
    icon: Settings,
    items: [{ href: '/admin/version', text: '버전관리' }],
  },
  {
    text: '소개',
    icon: Info,
    items: [{ href: '/about', text: '소개보기' }],
  },
];

export default function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <>
      {/* 배경 흐림 오버레이 */}
      {activeMenu && (
        <div className="bg-background/60 fixed inset-0 top-[var(--header-height)] z-30 backdrop-blur-xs" />
      )}

      <header className="bg-primary/5 sticky top-0 z-40 border-b shadow-sm backdrop-blur-lg">
        <div className="container flex h-[var(--header-height)] items-center">
          <div className="grid w-full grid-cols-[auto_1fr_auto] items-center lg:grid-cols-[200px_1fr_200px]">
            {/* 로고 */}
            <div className="flex items-center justify-start">
              <Link href="/" className="relative h-8 w-28 lg:h-10 lg:w-40" aria-label="홈으로 이동">
                <Image
                  src={logoLight}
                  alt="홈으로 이동"
                  fill
                  sizes="(max-width: 1024px) 112px, 160px"
                  className="object-contain dark:hidden"
                  priority
                />
                <Image
                  src={logoDark}
                  alt="홈으로 이동"
                  fill
                  sizes="(max-width: 1024px) 112px, 160px"
                  className="hidden object-contain dark:block"
                  priority
                />
              </Link>
            </div>

            {/* 네비게이션 */}
            <nav className="flex w-full items-center justify-center gap-2 lg:justify-center lg:gap-8">
              {navItems.map((item) => {
                const isActive = item.items.some(
                  (sub) => pathname === sub.href || pathname.startsWith(sub.href + '/')
                );
                const isOpen = activeMenu === item.text;
                const Icon = item.icon;

                return (
                  <div
                    key={item.text}
                    className="relative"
                    onMouseEnter={() => setActiveMenu(item.text)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <button
                      className={cn(
                        'hover:text-primary flex items-center gap-1 font-bold transition-colors',
                        isActive && 'text-primary'
                      )}
                    >
                      {/* lg 미만: 아이콘만 */}
                      <Icon className="h-8 w-8 lg:hidden" />
                      {/* lg 이상: 텍스트 + chevron */}
                      <span className="hidden text-xl lg:inline">{item.text}</span>
                      <ChevronDown
                        className={cn(
                          'hidden h-4 w-4 transition-transform duration-200 lg:block',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </button>

                    {/* 드롭다운 */}
                    {isOpen && (
                      <div className="absolute top-full left-1/2 z-50 -translate-x-1/2 pt-2">
                        <div className="bg-background min-w-[180px] rounded-lg border shadow-lg">
                          <div className="p-1">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setActiveMenu(null)}
                                className={cn(
                                  'hover:bg-accent hover:text-accent-foreground block rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
                                  (pathname === subItem.href ||
                                    pathname.startsWith(subItem.href + '/')) &&
                                    'bg-accent text-accent-foreground'
                                )}
                              >
                                {subItem.text}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* 우측 버튼 영역 */}
            <div className="flex items-center justify-end gap-3">
              {!_hasHydrated ? (
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              ) : (
                <>
                  {isLoggedIn ? (
                    <>
                      <NotificationBell />
                      <LogoutDialog />
                    </>
                  ) : (
                    <>
                      <SignupButton />
                      <LoginDialog />
                    </>
                  )}
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
