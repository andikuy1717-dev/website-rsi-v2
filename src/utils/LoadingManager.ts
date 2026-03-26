// utils/loadingManager.ts

declare global {
  interface Window {
    __LOAD_COUNTER__?: number;
  }
}

if (typeof window !== "undefined" && window.__LOAD_COUNTER__ === undefined) {
  window.__LOAD_COUNTER__ = 0;
}

export function startLoading() {
  if (typeof window === "undefined") return;
  window.__LOAD_COUNTER__ = (window.__LOAD_COUNTER__ || 0) + 1;
}

export function endLoading() {
  if (typeof window === "undefined") return;
  window.__LOAD_COUNTER__ = Math.max((window.__LOAD_COUNTER__ || 1) - 1, 0);
}
