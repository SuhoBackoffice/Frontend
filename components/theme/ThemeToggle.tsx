'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-md"
      onClick={toggleTheme}
      aria-label="테마 변경"
    >
      <Sun className="h-6 w-6 scale-200 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-6 w-6 scale-0 rotate-90 transition-all dark:scale-200 dark:rotate-0" />
    </Button>
  );
}
