// utils/useGlobalLoading.ts
import { useEffect, useState } from "react";

declare global {
  interface Window {
    __LOAD_COUNTER__?: number;
  }
}

export function useGlobalLoading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.__LOAD_COUNTER__ = window.__LOAD_COUNTER__ || 0;

    const interval = setInterval(() => {
      setIsLoading((window.__LOAD_COUNTER__ || 0) > 0);
    }, 50); // cek tiap 50ms

    return () => clearInterval(interval);
  }, []);

  return isLoading;
}
