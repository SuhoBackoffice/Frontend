'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';

type NavItem = {
  label: string;
  href?: string | null;
  icon?: LucideIcon;
  children?: NavItem[];
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

  // 섹션 활성화 규칙:
  // - 개요(href === base): 정확히 일치할 때만 활성
  // - 나머지: 하위 경로까지 포함해 활성
  // - 링크 없는 섹션: 자식 중 하나가 활성일 때 활성
  const isSectionActive = (section: NavItem) => {
    // 1. '개요'와 같이 최상위 경로 링크는 정확히 일치할 때만 활성
    if (section.href === base) {
      return isActiveExact(section.href);
    }
    // 2. '자재 관리'와 같이 링크와 하위 메뉴를 모두 가진 경우, 정확히 일치할 때만 활성
    if (section.href && section.children && section.children.length > 0) {
      return isActiveExact(section.href);
    }
    // 3. '프로젝트 관리'와 같이 링크는 없고 하위 메뉴만 있는 경우, 자식 중 하나가 활성이면 활성 (글자색 변경용)
    if (!section.href && section.children) {
      return section.children.some((c) => isActiveDeep(c.href));
    }
    // 4. (미래를 위해) 하위 메뉴 없는 일반 링크는 하위 경로까지 포함하여 활성
    if (section.href) {
      return isActiveDeep(section.href);
    }
    return false;
  };

  return (
    <nav className="bg-card rounded-xl border p-3">
      <ul className="flex flex-col gap-3">
        {nav.map((section) => {
          // isSectionActive 함수 호출 방식을 section 객체 전체를 넘겨주도록 변경합니다.
          const sectionActive = isSectionActive(section);

          return (
            <li key={section.label}>
              {/* # 섹션 */}
              {section.href ? (
                // "개요", "자재 관리" 등 href가 있는 항목
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
                        {child.href ? (
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
