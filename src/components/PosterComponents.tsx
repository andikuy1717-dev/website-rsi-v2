"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

/*import { useEffect, useState } from "react";
import { fetchBanner } from "@/services/PosterService";

   const [poster, setPoster] = useState<any>(null);

   useEffect(() => {
    async function loadPoster() {
      const data = await fetchPoster(1);
      if (data.length > 0) {
        setPoster(data[0]);
      }
    }

    loadPoster();
  }, []);
  */

export default function PosterComponents({ show, setShow, setBannerHeight }: any) {
   const bannerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    if (bannerRef.current) {
      setBannerHeight(show ? bannerRef.current.offsetHeight : 0);
    }
  }, [show, setBannerHeight]);

  const handleClose = () => {
    localStorage.setItem("poster_closed_at", Date.now().toString());
    setShow(false);
    setBannerHeight(0);
  };

  if (!show) return null; // kalau sudah close, tidak render banner
  
  return (
    <div
      ref={bannerRef}
      className="sticky left-0 w-full shadow z-10 flex items-center bg-white overflow-hidden top-[19px] sm:top-[22px] md:top-[29px] lg:top-8 xl:top-[37px] h-[60px] sm:h-[60px] md:h-[60px] lg:h-[60px] xl:h-[60px]">

      {/* Wrapper relative untuk Image */}
      <div className="relative w-full h-full">
        <Image
          src="/dummy.jpg"
          alt="Banner Dummy"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      
      {/* Button Close */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-1 sm:top-2 sm:right-1 md:top-2 md:right-2 lg:top-2 lg:right-2 xl:top-2 xl:right-3 text-white text-3xl sm:text-3xl md:text-3xl font-light hover:opacity-80 transition cursor-pointer">
        ×
      </button>
    </div>
  );
}
