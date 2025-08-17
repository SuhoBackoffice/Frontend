'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // (팁) 삼항 연산자를 사용하면 코드를 더 간결하게 만들 수 있습니다.
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
      <Sun className="h-6 w-6 scale-150 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-6 w-6 scale-0 rotate-90 transition-all dark:scale-150 dark:rotate-0" />
    </Button>
  );
}
