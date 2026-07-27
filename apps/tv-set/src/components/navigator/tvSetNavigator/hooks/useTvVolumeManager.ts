import { useState, useRef, useCallback, useEffect } from "react";

export const OVERLAY_HIDE_TIMEOUT = 2500; // 2.5 seconds

export const useTvVolumeManager = (initialVolume: number = 50) => {
  const [volume, setVolume] = useState<number>(initialVolume);
  const [isVolumeOverlayVisible, setIsVolumeOverlayVisible] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showOverlayWithTimer = useCallback(() => {
    setIsVolumeOverlayVisible(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsVolumeOverlayVisible(false);
    }, OVERLAY_HIDE_TIMEOUT);
  }, []);

  const increaseVolume = useCallback(() => {
    setVolume((prev) => Math.min(100, prev + 5));
    showOverlayWithTimer();
  }, [showOverlayWithTimer]);

  const decreaseVolume = useCallback(() => {
    setVolume((prev) => Math.max(0, prev - 5));
    showOverlayWithTimer();
  }, [showOverlayWithTimer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    volume,
    isVolumeOverlayVisible,
    increaseVolume,
    decreaseVolume,
  };
};
