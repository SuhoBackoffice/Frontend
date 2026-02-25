'use client';

import { useState } from 'react';
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
  Menu,
  FileSpreadsheet,
  Loader2,
  WarehouseIcon,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getProjectQuantityList } from '@/lib/api/project/project.api';
import { ApiError } from '@/types/api.types';
import { toast } from 'sonner';

const normalize = (p?: string | null) =>
  !p ? '' : p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p;

interface NavChildItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  disabled?: boolean;
  action?: 'download-quantity';
}

interface NavSection {
  label: string;
  href?: string;
  icon?: LucideIcon;
  children?: NavChildItem[];
}

function NavContent({
  projectId,
  isCollapsed = false,
  onLinkClick,
}: {
  projectId: number;
  isCollapsed?: boolean;
  onLinkClick?: () => void;
}) {
  const rawPath = usePathname();
  const pathname = normalize(rawPath);
  const base = `/project/${projectId}`;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadQuantityList = async () => {
    setIsDownloading(true);
    try {
      const fileResponse = await getProjectQuantityList(projectId);
      const { blob, headers } = fileResponse;
      const contentDisposition = headers.get('content-disposition');
      let filename = `물량리스트_${projectId}.xlsx`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : '물량 리스트 다운로드 실패. 서버 상태가 좋지 않습니다.';
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  const nav: NavSection[] = [
    {
      label: '개요',
      href: `${base}`,
      icon: LayoutDashboard,
      children: [{ label: '물량 리스트', icon: FileSpreadsheet, action: 'download-quantity' }],
    },
    {
      label: '업무 보고',
      icon: FileStack,
      children: [
        { label: '새 보고서 작성', href: `${base}/reports/new`, icon: FilePlus },
        { label: '보고 목록 조회', href: `${base}/reports`, icon: FileText },
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
        { label: '자재 현황', href: `${base}/material/stock`, icon: WarehouseIcon },
      ],
    },
  ];

  const isActiveExact = (href?: string | null) => !!href && pathname === normalize(href);
  const isActiveDeep = (href?: string | null) => {
    const h = normalize(href);
    return !!h && (pathname === h || pathname.startsWith(h + '/'));
  };

  const isContentActive = (section: any) => {
    if (section.href === base) return isActiveExact(section.href);
    if (section.href && isActiveDeep(section.href)) return true;
    if (section.children) return section.children.some((child: any) => isActiveDeep(child.href));
    return false;
  };

  return (
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
                onClick={onLinkClick}
              >
                <Link href={section.href}>
                  {section.icon && (
                    <section.icon className={cn('h-5 w-5', !isCollapsed && 'mr-2')} />
                  )}
                  {!isCollapsed && (
                    <span className="animate-in fade-in slide-in-from-left-2">{section.label}</span>
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
                  if (child.action === 'download-quantity') {
                    return (
                      <li key={child.label}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start rounded-md px-2 py-1 text-sm transition-colors"
                          onClick={handleDownloadQuantityList}
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <child.icon className="mr-2 h-4 w-4" />
                          )}
                          <span className="whitespace-nowrap">{child.label}</span>
                        </Button>
                      </li>
                    );
                  }

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
                          onClick={onLinkClick}
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
  );
}

export function ProjectSidenav({ projectId }: { projectId: number }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav
      className={cn(
        'bg-card relative hidden flex-col rounded-xl border p-5 pb-10 shadow-sm transition-all duration-300 ease-in-out lg:flex',
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
      <NavContent projectId={projectId} isCollapsed={isCollapsed} />
    </nav>
  );
}

export function MobileProjectNav({ projectId }: { projectId: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-4">
        <SheetHeader className="mb-4 text-left">
          <SheetTitle className="text-xl font-bold">SUHO PM</SheetTitle>
        </SheetHeader>
        <NavContent projectId={projectId} onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
