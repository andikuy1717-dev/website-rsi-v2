"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";


export default function TopProgressBar() {
  useEffect(() => {
    const interval = setInterval(() => {
      if ((window.__LOAD_COUNTER__ ?? 0) > 0) {
        if (!NProgress.isStarted()) NProgress.start();
      } else {
        if (NProgress.isStarted()) NProgress.done();
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return null;
}
