"use client";

import { useEffect, useRef, useState } from "react";

export function useFadeInOnScroll(forceVisibleOnMobile = false) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    // ===== langsung visible di mobile =====
    if (forceVisibleOnMobile && window.innerWidth < 768) {
      setIsVisible(true);
      return; // skip observer
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2, // 20% kelihatan baru animasi
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [forceVisibleOnMobile]);

  return { ref, isVisible };
}
