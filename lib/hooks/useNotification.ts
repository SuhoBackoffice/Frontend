'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../api/api-client';

export interface NotificationItem {
  userNotificationId: number;
  content: string;
  url: string;
  type: string;
  createdAt: string;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();

  const handleConfirmNotification = useCallback(
    async (id: number, url: string) => {
      try {
        await fetchApi(`/notification/${id}/read`, { method: 'PATCH' });
        setNotifications((prev) => prev.filter((n) => n.userNotificationId !== id));

        if (url) {
          let targetPath = url;

          try {
            if (url.startsWith('http')) {
              const urlObj = new URL(url);
              targetPath = urlObj.pathname + urlObj.search;
            }
          } catch (e) {
            console.error('URL 파싱 오류, 원본 값을 사용합니다.');
          }

          const finalPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;

          router.push(finalPath);
        }
      } catch (error) {
        console.error('알림 읽기 처리 실패:', error);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('로그인 되어있지 않음.');
      setNotifications([]);
      return;
    }
    console.log('로그인 되어있음.');

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/notification/subscribe`,
      { withCredentials: true }
    );

    eventSource.addEventListener('init', (e: MessageEvent) => {
      setNotifications(JSON.parse(e.data));
    });

    eventSource.addEventListener('notification', (e: MessageEvent) => {
      const newNoti: NotificationItem = JSON.parse(e.data);
      setNotifications((prev) => [newNoti, ...prev]);

      toast.info('새로운 알림이 도착했습니다.', {
        description: newNoti.content,
      });
    });

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [isLoggedIn]);

  return { notifications, handleConfirmNotification };
}
