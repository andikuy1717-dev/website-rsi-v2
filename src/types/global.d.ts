declare global {
  interface Window {
    __LOAD_COUNTER__?: number;
  }
}

declare module "*.css";

export {};
