'use client';

import { useState, useEffect } from 'react';

interface CountdownResult {
  text: string;
  isUrgent: boolean;
  isExpired: boolean;
  hours: number;
  minutes: number;
  seconds: number;
}

export function useCountdown(deadline: Date | string): CountdownResult {
  const calculate = (): CountdownResult => {
    const now = new Date().getTime();
    const end = new Date(deadline).getTime();
    const diff = end - now;

    if (diff <= 0) {
      return { text: 'EXPIRÉ', isUrgent: true, isExpired: true, hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return {
      text: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      isUrgent: hours < 2,
      isExpired: false,
      hours,
      minutes,
      seconds,
    };
  };

  const [result, setResult] = useState<CountdownResult>(calculate);

  useEffect(() => {
    const interval = setInterval(() => {
      setResult(calculate());
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return result;
}
