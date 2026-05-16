import { Capacitor } from '@capacitor/core';

export const isNativePlatform = () => Capacitor.isNativePlatform();
export const isAndroid = () => Capacitor.getPlatform() === 'android';
export const isIOS = () => Capacitor.getPlatform() === 'ios';
export const isWeb = () => !isNativePlatform();

export function getPlatform(): 'android' | 'ios' | 'web' {
  if (isAndroid()) return 'android';
  if (isIOS()) return 'ios';
  return 'web';
}
