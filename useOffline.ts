'use client';

import { useState, useEffect, useCallback } from 'react';

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkPending = useCallback(async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        setPendingCount(event.data.count || 0);
      };
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_PENDING_COUNT' },
        [channel.port2]
      );
    }
  }, []);

  useEffect(() => {
    checkPending();
    const interval = setInterval(checkPending, 5000);
    return () => clearInterval(interval);
  }, [checkPending]);

  const triggerSync = useCallback(async () => {
    if (!navigator.serviceWorker?.controller) return;
    setIsSyncing(true);

    const registration = await navigator.serviceWorker.ready;
    if ('sync' in registration) {
      await (registration as any).sync.register('sync-constats');
    }

    setTimeout(() => {
      setIsSyncing(false);
      checkPending();
    }, 2000);
  }, [checkPending]);

  return { isOnline, isSyncing, pendingCount, triggerSync };
}
