'use client';

import { useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useRealtimeConstats(
  orgId: string,
  onUpdate: (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => void
) {
  const handleUpdate = useCallback(
    (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => {
      onUpdate(payload);
    },
    [onUpdate]
  );

  useEffect(() => {
    const channel = supabase
      .channel(`constats-${orgId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Constat',
          filter: `orgId=eq.${orgId}`,
        },
        handleUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId, handleUpdate]);
}
