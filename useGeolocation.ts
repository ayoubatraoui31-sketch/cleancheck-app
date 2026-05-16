'use client';

import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  locationName: string;
  isLoading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    locationName: '',
    isLoading: true,
    error: null,
  });

  const getLocation = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Géolocalisation non supportée par ce navigateur',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Reverse geocoding via Nominatim (OpenStreetMap)
        let locationName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'User-Agent': 'CleanCheck/1.0' } }
          );
          const data = await res.json();
          if (data.display_name) {
            locationName = data.display_name.split(',').slice(0, 3).join(',');
          }
        } catch {
          // Fallback sur coordonnées brutes
        }

        setState({
          latitude,
          longitude,
          accuracy,
          locationName,
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        const messages: Record<number, string> = {
          1: 'Permission de localisation refusée',
          2: 'Position indisponible',
          3: 'Délai d'attente dépassé',
        };
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: messages[error.code] || 'Erreur de géolocalisation',
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { ...state, refresh: getLocation };
}
