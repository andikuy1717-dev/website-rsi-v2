"use client";

import { useEffect, useState } from "react";
import { getBannerPopup, BannerItem } from "@/services/BannerService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function BannerPopup() {
  const [open, setOpen] = useState(false);
  const [banners, setBanners] = useState<BannerItem[]>([]);

  useEffect(() => {
    async function loadBanner() {
      const result = await getBannerPopup();

      if (
        result.status === "success" &&
        result.data &&
        result.data.length > 0
      ) {
        setBanners(result.data);
        setOpen(true);
      }
    }

    loadBanner();
  }, []);

  if (!open || banners.length === 0) return null;

  return (
    <div className="banner-backdrop fixed inset-0 z-99999 bg-black/70 flex items-center justify-center p-4"
        onClick={() => setOpen(false)}
        >
      <div className="banner-popup relative max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}>

        <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{
                    crossFade: true,
                }}
                loop
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
            >
            {banners.map((banner) => (
                <SwiperSlide key={banner.id}>
                    <div className="flex items-center justify-center h-[85vh]">

                        <img
                            src={banner.image_url}
                            alt={banner.title}
                            className="
                                max-w-full
                                max-h-full
                                object-contain
                                rounded-xl
                            "
                        />

                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}