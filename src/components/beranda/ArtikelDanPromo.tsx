"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getHealthEducation,
  HealthEducationItem,
} from "@/services/HealthEducationService";
import { getPromos, PromoItem } from "@/services/PromoService";

type SliderItem =
  | (HealthEducationItem & { itemType: "edukasi" })
  | (PromoItem & { itemType: "promo" });

export default function ArtikeldanPromo() {
  const router = useRouter();

  const [items, setItems] = useState<SliderItem[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [articleResult, promoResult] = await Promise.all([
          getHealthEducation(),
          getPromos(),
        ]);

        const articles: SliderItem[] =
          articleResult.success && Array.isArray(articleResult.data)
            ? articleResult.data.map((item) => ({
                ...item,
                itemType: "edukasi" as const,
              }))
            : [];

        const promos: SliderItem[] =
          promoResult.success && Array.isArray(promoResult.data)
            ? promoResult.data.map((item) => ({
                ...item,
                itemType: "promo" as const,
              }))
            : [];

        const combinedData = [...articles, ...promos].sort((a, b) => {
          const dateA = new Date(
            a.itemType === "edukasi" ? a.published_at || 0 : a.published_at || 0
          ).getTime();

          const dateB = new Date(
            b.itemType === "edukasi" ? b.published_at || 0 : b.published_at || 0
          ).getTime();

          return dateB - dateA;
        });

        setItems(combinedData);
      } catch (error) {
        console.error("Gagal mengambil artikel dan promo:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `https://app.rsimmanuel.net${imageUrl}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "";

    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(date));
    } catch {
      return "";
    }
  };

  const goToDetail = (item: SliderItem) => {
    if (item.itemType === "edukasi") {
      router.push("/edukasi-kesehatan");
      return;
    }

    router.push("/promo");
  };

  if (loading) {
    return (
      <section className="bg-white px-6 py-16 sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-8xl justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#21368B]" />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }


  return (
    <section className="bg-white px-6 py-16 sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto max-w-8xl">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wider text-[#E5BC38]">
              INFORMASI TERBARU
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#21368B] md:text-3xl">
              Artikel & Promo Kesehatan
            </h2>
          </div>
        </div>

        {/* HORIZONTAL SCROLL: 1 mobile, 2 tablet, 4 desktop */}
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-5 pt-2 [scrollbar-color:#21368B_#E5E7EB] [scrollbar-width:auto] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#21368B] [&::-webkit-scrollbar-thumb:hover]:bg-[#182970]">
        {items.map((item) => {
            const isPromo = item.itemType === "promo";

            return (
            <article
                key={`${item.itemType}-${item.id}`}
                className="group min-w-0 shrink-0 snap-start basis-[85%] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:basis-[calc(50%-12px)] xl:basis-[calc((100%-72px)/4)]"
            >
                {/* IMAGE */}
                <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={getImageUrl(item.image_url)}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* LABEL KANAN */}
                <span
                    className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm ${
                    isPromo
                        ? "border-[#F0C63A] bg-[#FFF8D9] text-[#8A6500]"
                        : "border-[#91B4FF] bg-[#EEF4FF] text-[#21368B]"
                    }`}
                >
                    {isPromo ? "Promo" : "Edukasi"}
                </span>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                <p className="text-xs text-gray-500">
                    {isPromo
                    ? `Berlaku sampai ${formatDate(item.expired_at)}`
                    : formatDate(item.published_at)}
                </p>

                <h3 className="mt-2 line-clamp-2 min-h-[48px] text-lg font-bold leading-snug text-gray-800">
                    {item.title}
                </h3>

                <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-relaxed text-gray-600">
                    {item.description}
                </p>

                <button
                    type="button"
                    onClick={() => goToDetail(item)}
                    className="mt-5 rounded-lg bg-[#21368B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#182970]"
                >
                    {isPromo ? "Lihat Promo" : "Baca Artikel"}
                </button>
                </div>
            </article>
            );
        })}
        </div>
    </div>
    
    </section>
  );
}