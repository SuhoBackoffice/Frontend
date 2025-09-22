'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Settings2, Route, GitBranch, Boxes, PackagePlus } from 'lucide-react';

type NavItem = {
  label: string;
  href?: string | null;
  icon?: LucideIcon;
  children?: NavItem[];
};

// 경로 정규화: 트레일링 슬래시 제거
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
      children: [{ label: '자재 입고 등록', href: `${base}/material/register`, icon: PackagePlus }],
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
  const isSectionActive = (sectionHref?: string | null, children?: NavItem[]) => {
    if (sectionHref === base) return isActiveExact(sectionHref);
    if (sectionHref) return isActiveDeep(sectionHref);
    return children?.some((c) => isActiveDeep(c.href)) ?? false;
  };

  return (
    <nav className="bg-card rounded-xl border p-3">
      <ul className="flex flex-col gap-3">
        {nav.map((section) => {
          const sectionActive = isSectionActive(section.href, section.children);

          return (
            <li key={section.label}>
              {/* # 섹션 */}
              {section.href ? (
                <Button
                  asChild
                  variant={sectionActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start rounded-lg px-3 py-2 text-left text-lg font-semibold',
                    sectionActive && 'shadow-sm'
                  )}
                  aria-current={sectionActive ? 'page' : undefined}
                >
                  <Link href={section.href}>
                    {section.icon && <section.icon className="mr-2 h-5 w-5" />}
                    <span className="whitespace-nowrap">{section.label}</span>
                  </Link>
                </Button>
              ) : (
                <div className="flex items-center gap-2 px-2 py-1 text-lg font-semibold">
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
                            variant={childActive ? 'secondary' : 'ghost'}
                            className="w-full justify-start rounded-md px-2 py-1 text-sm"
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
