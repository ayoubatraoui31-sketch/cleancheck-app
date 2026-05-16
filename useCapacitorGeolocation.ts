'use client';

import { useState, useEffect, useCallback } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { isNativePlatform } from '@/lib/capacitor';

interface CapacitorLocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  locationName: string;
  isLoading: boolean;
  error: string | null;
}

export function useCapacitorGeolocation() {
  const [state, setState] = useState<CapacitorLocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    locationName: '',
    isLoading: true,
    error: null,
  });

  const getLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      let position;

      if (isNativePlatform()) {
        const perm = await Geolocation.requestPermissions();
        if (perm.location !== 'granted') {
          throw new Error('Permission de localisation refusée');
        }

        position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });
      } else {
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        });
      }

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      let locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          { headers: { 'User-Agent': 'CleanCheck/1.0' } }
        );
        const data = await res.json();
        if (data.display_name) {
          locationName = data.display_name.split(',').slice(0, 3).join(',');
        }
      } catch {
        // Fallback
      }

      setState({
        latitude: lat,
        longitude: lng,
        accuracy,
        locationName,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erreur de géolocalisation',
      }));
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { ...state, refresh: getLocation };
}
