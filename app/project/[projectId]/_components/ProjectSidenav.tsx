'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Settings2,
  Route,
  GitBranch,
  Boxes,
  PackagePlus,
  ChartColumnBig,
  Factory,
  ClipboardList,
} from 'lucide-react';

type NavItem = {
  label: string;
  href?: string | null;
  icon?: LucideIcon;
  children?: NavItem[];
  disabled?: boolean; // 비활성 상태를 위한 속성 추가
};

const normalize = (p?: string | null) =>
  !p ? '' : p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p;

export function ProjectSidenav({ projectId }: { projectId: number }) {
  const rawPath = usePathname();
  const pathname = normalize(rawPath);
  const base = `/project/${projectId}`;

  const nav: NavItem[] = [
    { label: '개요', href: `${base}`, icon: LayoutDashboard },
    {
      label: '프로젝트 관리',
      icon: Settings2,
      children: [
        { label: '직선 레일 추가', href: `${base}/straight/register`, icon: Route },
        { label: '분기 레일 추가', href: `${base}/branch/register`, icon: GitBranch },
      ],
    },
    {
      label: '생산 관리',
      icon: Factory,
      children: [
        { label: '분기 레일', href: `${base}/branch/capacity`, icon: ClipboardList },
        // '직선 레일' 항목을 비활성화 처리
        {
          label: '직선 레일',
          href: `${base}/straight/capacity`,
          icon: ClipboardList,
          disabled: true,
        },
      ],
    },
    {
      label: '자재 관리',
      href: `${base}/material`,
      icon: Boxes,
      children: [
        { label: '자재 입고 등록', href: `${base}/material/register`, icon: PackagePlus },
        { label: '자재 입고 이력', href: `${base}/material/history`, icon: ChartColumnBig },
      ],
    },
  ];

  const isActiveExact = (href?: string | null) => !!href && pathname === normalize(href);

  const isActiveDeep = (href?: string | null) => {
    const h = normalize(href);
    return !!h && (pathname === h || pathname.startsWith(h + '/'));
  };

  const isSectionActive = (section: NavItem) => {
    if (section.href === base) {
      return isActiveExact(section.href);
    }
    if (section.href && section.children && section.children.length > 0) {
      return isActiveExact(section.href);
    }
    if (!section.href && section.children) {
      return section.children.some((c) => isActiveDeep(c.href));
    }
    if (section.href) {
      return isActiveDeep(section.href);
    }
    return false;
  };

  return (
    <nav className="bg-card rounded-xl border p-3">
      <ul className="flex flex-col gap-3">
        {nav.map((section) => {
          const sectionActive = isSectionActive(section);

          return (
            <li key={section.label}>
              {/* # 섹션 */}
              {section.href ? (
                <Button
                  asChild
                  variant={sectionActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start rounded-lg px-3 py-2 text-left text-lg font-semibold',
                    sectionActive && 'opacity-80'
                  )}
                  aria-current={sectionActive ? 'page' : undefined}
                >
                  <Link href={section.href}>
                    {section.icon && <section.icon className="mr-2 h-5 w-5" />}
                    <span className="whitespace-nowrap">{section.label}</span>
                  </Link>
                </Button>
              ) : (
                <div
                  className={cn(
                    'flex items-center gap-2 px-2 py-1 text-lg font-semibold',
                    sectionActive ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {section.icon && <section.icon className="h-5 w-5" />}
                  <span className="whitespace-nowrap">{section.label}</span>
                </div>
              )}

              {/* ## 하위 항목 */}
              {section.children && section.children.length > 0 && (
                <ul className="mt-2 space-y-1 border-l pl-4">
                  {section.children.map((child) => {
                    const childActive = isActiveDeep(child.href);
                    return (
                      <li key={child.label}>
                        {child.disabled ? (
                          // 비활성화된 항목 렌더링
                          <div
                            className={cn(
                              'text-muted-foreground flex w-full cursor-not-allowed items-center justify-between rounded-md px-2 py-1 text-sm opacity-70'
                            )}
                          >
                            <div className="flex items-center">
                              {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                              <span className="whitespace-nowrap">{child.label}</span>
                            </div>
                            <Badge variant="destructive">준비 중</Badge>
                          </div>
                        ) : child.href ? (
                          // 활성화된 링크 렌더링
                          <Button
                            asChild
                            variant={childActive ? 'default' : 'ghost'}
                            className={cn(
                              'w-full justify-start rounded-md px-2 py-1 text-sm',
                              childActive && 'opacity-80'
                            )}
                            aria-current={childActive ? 'page' : undefined}
                          >
                            <Link href={child.href}>
                              {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                              <span className="whitespace-nowrap">{child.label}</span>
                            </Link>
                          </Button>
                        ) : (
                          // 링크가 없는 텍스트 항목 렌더링
                          <div className="text-muted-foreground flex items-center gap-2 rounded-md px-2 py-1 text-sm">
                            {child.icon && <child.icon className="h-4 w-4" />}
                            <span className="whitespace-nowrap">{child.label}</span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
