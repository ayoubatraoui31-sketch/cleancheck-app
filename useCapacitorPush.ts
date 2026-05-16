'use client';

import { useState, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { isNativePlatform } from '@/lib/capacitor';

export function useCapacitorPush() {
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!isNativePlatform()) return;

    const initPush = async () => {
      try {
        const perm = await PushNotifications.requestPermissions();
        if (perm.receive === 'granted') {
          await PushNotifications.register();
        }

        PushNotifications.addListener('registration', (token) => {
          console.log('Push token:', token.value);
          setToken(token.value);
          fetch('/api/push/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token.value }),
          });
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          setNotifications((prev) => [notification, ...prev]);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          const constatId = action.notification.data?.constatId;
          if (constatId) {
            window.location.href = `/constats/${constatId}`;
          }
        });
      } catch (err) {
        console.error('Push init error:', err);
      }
    };

    initPush();
  }, []);

  return { token, notifications };
}
