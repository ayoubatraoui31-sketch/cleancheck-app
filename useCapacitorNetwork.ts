'use client';

import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { isNativePlatform } from '@/lib/capacitor';

export function useCapacitorNetwork() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    if (!isNativePlatform()) {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    const setupNetwork = async () => {
      const status = await Network.getStatus();
      setIsOnline(status.connected);
      setConnectionType(status.connectionType);

      const listener = Network.addListener('networkStatusChange', (status) => {
        setIsOnline(status.connected);
        setConnectionType(status.connectionType);
      });

      return () => listener.remove();
    };

    let cleanup: (() => void) | undefined;
    setupNetwork().then((fn) => { cleanup = fn; });

    return () => cleanup?.();
  }, []);

  return { isOnline, connectionType };
}
