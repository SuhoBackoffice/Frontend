'use client';

import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { useSyncAuth } from '@/lib/hooks/useSyncAuth';

export default function Providers({ children }: { children: React.ReactNode }) {
  useSyncAuth();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
