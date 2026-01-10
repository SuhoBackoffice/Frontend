'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotification } from '@/lib/hooks/useNotification';

export function NotificationBell() {
  const { notifications, handleConfirmNotification } = useNotification();
  const hasNotifications = notifications.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="알림 확인">
          <Bell className="h-5 w-5 scale-180" />

          {hasNotifications && (
            <span className="bg-primary text-primary-foreground ring-background absolute -top-0.5 -right-0.5 flex h-4 w-7 items-center justify-center rounded-full text-[9px] font-black ring-2">
              NEW
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="border-border w-80 rounded-2xl p-2 shadow-2xl">
        <div className="border-border/50 border-b px-4 py-3">
          <h3 className="text-sm font-black">미확인 알림</h3>
        </div>

        <div className="custom-scrollbar max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-muted-foreground/50 py-12 text-center text-sm font-bold">
              새로운 알림이 없습니다.
            </div>
          ) : (
            notifications.map((noti) => (
              <DropdownMenuItem
                key={noti.userNotificationId}
                onClick={() => handleConfirmNotification(noti.userNotificationId, noti.url)}
                className="focus:bg-accent focus:text-accent-foreground flex cursor-pointer flex-col items-start gap-1 rounded-xl p-4 transition-colors"
              >
                <div className="mb-1 flex w-full items-center justify-between">
                  <span className="text-primary text-[10px] font-black tracking-widest uppercase">
                    {noti.type}
                  </span>
                  <span className="text-muted-foreground text-[10px] font-medium">
                    {noti.createdAt}
                  </span>
                </div>
                <p className="text-sm leading-snug font-bold">{noti.content}</p>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
