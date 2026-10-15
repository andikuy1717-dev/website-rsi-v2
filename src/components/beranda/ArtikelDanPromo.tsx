"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import {
  getHealthEducation,
  HealthEducationItem,
} from "@/services/HealthEducationService";
import { getPromos, PromoItem } from "@/services/PromoService";

type SliderItem =
  | (PromoItem & { itemType: "promo" })
  | (HealthEducationItem & { itemType: "edukasi" });

// DATA FALLBACK SESUAI GAMBAR MOCKUP (PROMO DULU, BARU EDUKASI)
const fallbackItems: SliderItem[] = [
  {
    id: 1,
    title: "Promo Medical Checkup",
    description: "Pemeriksaan kesehatan komprehensif untuk mengetahui kondisi tubuh lebih dini.",
    image_url: "",
    itemType: "promo",
    expired_at: "2026-09-30",
  } as any,
  {
    id: 2,
    title: "4 Olahraga Untuk Lansia",
    description: "Panduan aktivitas fisik yang aman dan bermanfaat bagi kesehatan tubuh lansia.",
    image_url: "",
    itemType: "edukasi",
    published_at: "2026-08-31",
  } as any,
  {
    id: 3,
    title: "STOP TBC!",
    description: "Kenali gejala awal tuberkulosis dan langkah pencegahan efektif sejak dini.",
    image_url: "",
    itemType: "edukasi",
    published_at: "2026-08-27",
  } as any,
];

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
          articleResult?.success && Array.isArray(articleResult.data)
            ? articleResult.data.map((item) => ({
                ...item,
                itemType: "edukasi" as const,
              }))
            : [];

        const promos: SliderItem[] =
          promoResult?.success && Array.isArray(promoResult.data)
            ? promoResult.data.map((item) => ({
                ...item,
                itemType: "promo" as const,
              }))
            : [];

        // 🔥 LOGIKA BARU: PROMO DULUAN, BARU EDUKASI
        const combinedData = [...promos, ...articles].sort((a, b) => {
          // 1. Jika beda tipe, dahulukan 'promo' di posisi terdepan
          if (a.itemType !== b.itemType) {
            return a.itemType === "promo" ? -1 : 1;
          }

          // 2. Jika tipenya sama, urutkan berdasarkan tanggal terbaru
          const dateA = new Date(
            a.itemType === "promo" 
              ? a.published_at || a.expired_at || 0 
              : a.published_at || 0
          ).getTime();

          const dateB = new Date(
            b.itemType === "promo" 
              ? b.published_at || b.expired_at || 0 
              : b.published_at || 0
          ).getTime();

          return dateB - dateA;
        });

        if (combinedData.length > 0) {
          // Ambil 3 item teratas untuk tampilan grid
          setItems(combinedData.slice(0, 3));
        } else {
          setItems(fallbackItems);
        }
      } catch (error) {
        console.error("Gagal mengambil artikel dan promo:", error);
        setItems(fallbackItems);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `https://app.rsimmanuel.net${imageUrl}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(date));
    } catch {
      return "";
    }
  };

  const goToDetail = (item: SliderItem) => {
    if (item.itemType === "edukasi") {
      // Arahkan ke halaman edukasi kesehatan
      router.push("/edukasi-kesehatan");
      return;
    }
    // Arahkan ke halaman promo
    router.push("/promo");
  };

  return (
    <section className="w-full bg-white py-20 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        {/* HEADER SECTION */}
        <div className="mb-10 sm:mb-14">
          
          {/* EYEBROW: GARIS EMAS #E0A91B + TEKS KAPITAL */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="w-5 h-[3px] bg-[#E0A91B] rounded-full shrink-0" />
            <span className="text-[13px] font-bold text-[#1B2A78] uppercase tracking-[1.5px]">
              Informasi Terbaru
            </span>
          </div>

          {/* ROW: H2 JUDUL SECTION & LINK LIHAT SEMUA */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold text-[#111C52] leading-[1.15] tracking-[-0.8px]">
              Artikel & Promo Kesehatan
            </h2>

            <Link
              href="/promo"
              className="inline-flex items-center gap-2 text-[#1B2A78] hover:text-[#111C52] font-semibold text-[15px] transition-colors shrink-0 group cursor-pointer"
            >
              <span>Lihat semua</span>
              <FiArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-[#E3E6EF] overflow-hidden animate-pulse flex flex-col h-[380px]"
              >
                <div className="h-[210px] bg-gray-200" />
                <div className="p-6 flex flex-col gap-3">
                  <div className="h-4 w-32 bg-gray-200 rounded-md" />
                  <div className="h-6 w-full bg-gray-200 rounded-md" />
                  <div className="h-4 w-4/5 bg-gray-200 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* GRID 3 KARTU ARTIKEL & PROMO */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((item, index) => {
              const isPromo = item.itemType === "promo";
              const imgUrl = getImageUrl(item.image_url);

              return (
                <article
                  key={`${item.itemType}-${item.id || index}`}
                  onClick={() => goToDetail(item)}
                  className="bg-white rounded-3xl border border-[#E3E6EF] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  {/* WADAH FOTO THUMBNAIL */}
                  <div className="relative w-full h-[210px] sm:h-[220px] bg-gradient-to-br from-[#EAEEFB]/60 via-[#F3F5FB] to-[#D5DAEA]/40 overflow-hidden flex items-center justify-center border-b border-[#E3E6EF] select-none">
                    
                    {/* Pola diagonal placeholder */}
                    <div 
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: "repeating-linear-gradient(45deg, #1B2A78 0, #1B2A78 1.5px, transparent 0, transparent 18px)"
                      }}
                    />

                    {/* Fallback label teks */}
                    <p className="text-[#545B75] text-[13px] sm:text-[14px] font-medium z-0 px-4 text-center">
                      {isPromo
                        ? "Visual promo MCU"
                        : "Thumbnail khusus (bukan infografis)"}
                    </p>

                    {/* Gambar asli jika tersedia */}
                    {imgUrl && (
                      <img
                        src={imgUrl}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 z-10"
                        onError={(e: any) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>

                  {/* KONTEN KARTU */}
                  <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                    <div>
                      {/* ROW: BADGE RESMI + TANGGAL */}
                      <div className="flex items-center gap-3 mb-3">
                        {/* BADGE PROMO: Emas Muda #F6DE95, Teks Navy #111C52 | BADGE EDUKASI: Biru Muda #EAEEFB, Teks #1B2A78 */}
                        <span
                          className={`px-2.5 py-1 rounded-md text-[12px] font-semibold leading-none shadow-2xs ${
                            isPromo
                              ? "bg-[#F6DE95] text-[#111C52]"
                              : "bg-[#EAEEFB] text-[#1B2A78]"
                          }`}
                        >
                          {isPromo ? "Promo" : "Edukasi"}
                        </span>

                        {/* TANGGAL: Teks Sekunder #545B75 */}
                        <span className="text-[#545B75] text-[12px] sm:text-[13px] font-medium">
                          {isPromo
                            ? item.expired_at
                              ? `Berlaku s.d. ${formatDate(item.expired_at)}`
                              : "Promo Terbatas"
                            : formatDate(item.published_at || null)}
                        </span>
                      </div>

                      {/* H3 JUDUL KARTU: 20px / 1.3 / Bold 700, Navy Gelap #111C52 */}
                      <h3 className="text-[19px] sm:text-[20px] font-bold text-[#111C52] leading-[1.3] mb-2.5 group-hover:text-[#1B2A78] transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      {/* DESKRIPSI KARTU: 14-15px / 1.6 / 400, Teks Sekunder #545B75 */}
                      <p className="text-[#545B75] text-[14px] sm:text-[14.5px] leading-[1.6] font-normal line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                  </div>

                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}