'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'hover:text-primary font-medium transition-colors',
        isActive ? 'text-primary' : 'text-muted-foreground',
        className
      )}
    >
      {children}
    </Link>
  );
}
