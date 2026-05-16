'use client';

import { useState, useCallback, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { isNativePlatform } from '@/lib/capacitor';

interface UseCapacitorCameraReturn {
  preview: string | null;
  base64: string;
  isLoading: boolean;
  error: string | null;
  takePhoto: () => Promise<void>;
  pickPhoto: () => Promise<void>;
  reset: () => void;
}

export function useCapacitorCamera(): UseCapacitorCameraReturn {
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImage = useCallback(async (source: CameraSource) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isNativePlatform()) {
        const image = await Camera.getPhoto({
          quality: 85,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source,
          saveToGallery: false,
        });

        if (image.base64String) {
          const dataUrl = `data:image/jpeg;base64,${image.base64String}`;
          setPreview(dataUrl);
          setBase64(image.base64String);
        }
      } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = source === CameraSource.Camera ? 'environment' : undefined;

        const file = await new Promise<File | null>((resolve) => {
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            resolve(files?.[0] || null);
          };
          input.click();
        });

        if (file) {
          const reader = new FileReader();
          const base64String = await new Promise<string>((resolve) => {
            reader.onloadend = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]);
            };
            reader.readAsDataURL(file);
          });

          setPreview(`data:image/jpeg;base64,${base64String}`);
          setBase64(base64String);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur caméra');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const takePhoto = useCallback(() => handleImage(CameraSource.Camera), [handleImage]);
  const pickPhoto = useCallback(() => handleImage(CameraSource.Photos), [handleImage]);

  const reset = useCallback(() => {
    setPreview(null);
    setBase64('');
    setError(null);
  }, []);

  return { preview, base64, isLoading, error, takePhoto, pickPhoto, reset };
}
