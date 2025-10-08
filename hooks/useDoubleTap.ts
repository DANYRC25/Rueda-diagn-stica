import { useRef } from 'react';

export function useDoubleTap(callback: () => void, delay = 300) {
  const lastTap = useRef<number | null>(null);

  return () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < delay) {
      callback();
    }
    lastTap.current = now;
  };
}
