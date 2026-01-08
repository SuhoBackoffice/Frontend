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
  ChevronRight,
  ChevronLeft,
  FilePlus,
  FileText,
  FileStack,
} from 'lucide-react';
import { useState } from 'react';

type NavItem = {
  label: string;
  href?: string | null;
  icon?: LucideIcon;
  children?: NavItem[];
  disabled?: boolean;
};

const normalize = (p?: string | null) =>
  !p ? '' : p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p;

export function ProjectSidenav({ projectId }: { projectId: number }) {
  const rawPath = usePathname();
  const pathname = normalize(rawPath);
  const base = `/project/${projectId}`;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const nav: NavItem[] = [
    { label: '개요', href: `${base}`, icon: LayoutDashboard },
    {
      label: '업무 보고',
      icon: FileStack,
      children: [
        { label: '새 보고서 작성', href: `${base}/reports/new`, icon: FilePlus },
        { label: '보고 내역 조회', href: `${base}/reports`, icon: FileText },
      ],
    },
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

  /**
   * 섹션(부모)의 활성화 여부를 결정하는 로직
   */
  const isContentActive = (section: NavItem) => {
    if (section.href === base) {
      return isActiveExact(section.href);
    }
    if (section.href && isActiveDeep(section.href)) {
      return true;
    }
    if (section.children) {
      return section.children.some((child) => isActiveDeep(child.href));
    }
    return false;
  };

  return (
    <nav
      className={cn(
        'bg-card relative flex h-full flex-col rounded-xl border p-3 shadow-sm transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[70px]' : 'w-[240px]'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hover:bg-accent bg-background absolute top-6 -right-3 z-10 h-6 w-6 rounded-full border shadow-sm"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <ul className="flex flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto">
        {nav.map((section) => {
          const isExact = isActiveExact(section.href);
          const isHighlight = isContentActive(section);

          return (
            <li key={section.label} className="group">
              {section.href ? (
                <Button
                  asChild
                  variant={isExact ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start rounded-lg px-3 py-2 text-left text-lg font-semibold transition-all',
                    isCollapsed && 'justify-center px-0',
                    !isExact && isHighlight && 'text-primary hover:text-primary hover:bg-accent'
                  )}
                >
                  <Link href={section.href}>
                    {section.icon && (
                      <section.icon className={cn('h-5 w-5', !isCollapsed && 'mr-2')} />
                    )}
                    {!isCollapsed && (
                      <span className="animate-in fade-in slide-in-from-left-2">
                        {section.label}
                      </span>
                    )}
                  </Link>
                </Button>
              ) : (
                <div
                  className={cn(
                    'flex items-center gap-2 px-2 py-1 text-lg font-semibold transition-colors',
                    isHighlight ? 'text-primary' : 'text-foreground',
                    isCollapsed && 'justify-center px-0'
                  )}
                >
                  {section.icon && <section.icon className="h-5 w-5" />}
                  {!isCollapsed && (
                    <span className="animate-in fade-in slide-in-from-left-2">{section.label}</span>
                  )}
                </div>
              )}

              {!isCollapsed && section.children && section.children.length > 0 && (
                <ul className="animate-in fade-in zoom-in-95 mt-2 space-y-1 border-l pl-4">
                  {section.children.map((child) => {
                    const childActive = isActiveExact(child.href);
                    return (
                      <li key={child.label}>
                        {child.disabled ? (
                          <div className="text-muted-foreground flex w-full cursor-not-allowed items-center justify-between rounded-md px-2 py-1 text-sm opacity-70">
                            <div className="flex items-center">
                              {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                              <span className="whitespace-nowrap">{child.label}</span>
                            </div>
                            <Badge variant="destructive" className="origin-right scale-75">
                              준비 중
                            </Badge>
                          </div>
                        ) : (
                          <Button
                            asChild
                            variant={childActive ? 'default' : 'ghost'}
                            className={cn(
                              'w-full justify-start rounded-md px-2 py-1 text-sm transition-colors',
                              childActive && 'opacity-90 shadow-sm'
                            )}
                          >
                            <Link href={child.href!}>
                              {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                              <span className="whitespace-nowrap">{child.label}</span>
                            </Link>
                          </Button>
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

      {!isCollapsed && (
        <div className="text-muted-foreground animate-in fade-in mt-auto border-t px-2 pt-4 text-[10px]">
          © 2026 SUHO Project Management
        </div>
      )}
    </nav>
  );
}
