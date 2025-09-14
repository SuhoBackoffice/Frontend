'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export function SignupButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant="ghost" size="icon" aria-label="회원가입">
          <Link href="/signup">
            <UserPlus className="h-5 w-5 scale-150" />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">회원가입</TooltipContent>
    </Tooltip>
  );
}
