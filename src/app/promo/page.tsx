"use client";

import { useEffect, useState } from "react";
import { getPromos, PromoItem } from "@/services/PromoService";
import {
  getUpcomingEvents,
  UpcomingEventItem,
} from "@/services/UpcomingEventService";
import { useRouter } from "next/navigation";


export default function PromoPage() {
  const [promos, setPromos] = useState<PromoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPageData = async () => {
        try {
        setLoading(true);

        const [promoResult, eventResult] = await Promise.all([
            getPromos(),
            getUpcomingEvents(),
        ]);

        if (promoResult.success && Array.isArray(promoResult.data)) {
            setPromos([...promoResult.data].sort((a, b) => a.order - b.order));
        } else {
            setPromos([]);
        }

        if (eventResult.success && Array.isArray(eventResult.data)) {
            setUpcomingEvents(
            [...eventResult.data].sort((a, b) => a.order - b.order)
            );
        } else {
            setUpcomingEvents([]);
        }
        } catch (error) {
        console.error("Gagal mengambil data promo:", error);
        setPromos([]);
        setUpcomingEvents([]);
        } finally {
        setLoading(false);
        }
    };

    fetchPageData();
  }, []);

  const featuredPromo = promos.find((promo) => promo.order === 1);
  const otherPromos = promos.filter((promo) => promo.order !== 1);

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `https://app.rsimmanuel.net${imageUrl}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";

    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(date));
    } catch {
      return "-";
    }
  };

  const formatDetailDescription = (text: string) => {
    return (
      <div className="space-y-5">
        {text.split("\n").map((line, index) => {
          const trimmedLine = line.trim();

          if (!trimmedLine) {
            return <div key={index} className="h-1" />;
          }

          return (
            <p
              key={index}
              className="text-sm leading-relaxed text-gray-700 md:text-base"
            >
              {trimmedLine}
            </p>
          );
        })}
      </div>
    );
  };

  const openPromo = (promo: PromoItem) => {
    setSelectedPromo(promo);
    document.body.style.overflow = "hidden";
  };

  const closePromo = () => {
    setSelectedPromo(null);
    document.body.style.overflow = "";
  };

  const formatEventDate = (date: string) => {
    const eventDate = new Date(`${date}T00:00:00`);

    return {
        day: new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        }).format(eventDate),
        month: new Intl.DateTimeFormat("id-ID", {
        month: "short",
        }).format(eventDate),
    };
  };

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-[#21368B] px-6 py-20 text-white sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto max-w-8xl">
        
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">
            Promo Kesehatan
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-lg">
            Temukan berbagai promo layanan kesehatan RS Immanuel Bandung untuk
            Anda dan keluarga.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-8xl px-6 py-12 sm:px-8 md:px-12 lg:px-16">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#21368B]" />
          </div>
        )}

        {!loading && promos.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            Belum ada promo yang tersedia.
          </div>
        )}

        {/* PROMO UNGGULAN */}
        {!loading && featuredPromo && (
          <div className="mb-12">
            <div className="relative isolate h-[360px] w-full overflow-hidden rounded-2xl shadow-md md:h-[420px]">
              <img
                src={getImageUrl(featuredPromo.image_url)}
                alt={featuredPromo.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

              <button
                type="button"
                onClick={() => openPromo(featuredPromo)}
                className="absolute right-5 top-5 z-20 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#21368B] shadow-md transition hover:scale-105 md:right-8 md:top-8 cursor-pointer"
              >
                Lihat Promo
              </button>

              <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white md:p-10">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#E5BC38] px-3 py-1 text-xs font-semibold text-[#21368B]">
                    {featuredPromo.category}
                  </span>

                  {featuredPromo.expired_at && (
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      Berlaku sampai {formatDate(featuredPromo.expired_at)}
                    </span>
                  )}
                </div>

                <h2 className="max-w-3xl text-2xl font-bold leading-tight md:text-4xl">
                  {featuredPromo.title}
                </h2>

                {featuredPromo.description && (
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/90 md:text-base">
                    {featuredPromo.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PROMO LAINNYA + SIDEBAR */}
        {!loading && (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_370px]">
            {/* LIST PROMO */}
            <div>
            {otherPromos.length > 0 && (
                <>
                <h2 className="mb-6 text-2xl font-bold text-[#21368B]">
                    Promo Lainnya
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {otherPromos.map((promo) => (
                    <article
                        key={promo.id}
                        className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="aspect-[16/9] w-full overflow-hidden">
                        <img
                            src={getImageUrl(promo.image_url)}
                            alt={promo.title}
                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        />
                        </div>

                        <div className="p-5">
                        <div className="flex items-center justify-between gap-3">
                            <span className="rounded-full bg-[#E8EEFF] px-3 py-1 text-xs font-semibold text-[#21368B]">
                            {promo.category}
                            </span>

                            {promo.expired_at && (
                            <span className="text-xs text-gray-500">
                                s/d {formatDate(promo.expired_at)}
                            </span>
                            )}
                        </div>

                        <h2 className="mt-4 line-clamp-2 text-xl font-semibold text-gray-800">
                            {promo.title}
                        </h2>

                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                            {promo.description}
                        </p>

                        <button
                            type="button"
                            onClick={() => openPromo(promo)}
                            className="mt-5 rounded-lg bg-[#21368B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#182970]"
                        >
                            Lihat Detail
                        </button>
                        </div>
                    </article>
                    ))}
                </div>
                </>
            )}
            </div>

            {/* SIDEBAR KANAN */}
            <aside className="space-y-6">
            {/* KEGIATAN MENDATANG */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
                <h2 className="mb-5 font-serif text-2xl font-bold text-[#21368B]">
                Kegiatan Mendatang
                </h2>

                <div className="space-y-4">
                {upcomingEvents.map((event) => {
                    const date = formatEventDate(event.event_date);

                    return (
                    <div key={event.id} className="flex gap-3">
                        <div className="flex h-[76px] w-[58px] shrink-0 flex-col items-center justify-center rounded-2xl bg-[#F0F4FC] text-[#21368B]">
                        <span className="text-xl font-bold leading-none">
                            {date.day}
                        </span>
                        <span className="mt-1 text-xs font-medium">
                            {date.month}
                        </span>
                        </div>

                        <div className="min-w-0">
                        <h3 className="text-sm font-semibold leading-snug text-gray-800">
                            {event.title}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            {event.start_time}–{event.end_time}
                        </p>

                        <p className="text-xs text-gray-400">{event.location}</p>

                        <span className="mt-2 inline-block rounded-md border border-[#55B8B4] bg-[#D7F5F2] px-2 py-0.5 text-xs font-medium text-[#258B88]">
                            {event.category}
                        </span>
                        </div>
                    </div>
                    );
                })}
                </div>

                {upcomingEvents[0]?.registration_url && (
                <a
                    href={upcomingEvents[0].registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#00B948] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#009E3D]"
                >
                    <span>●</span>
                    Daftar via WhatsApp
                </a>
                )}
            </div>

            {/* YOUTUBE */}
            <a
                href="https://www.youtube.com/@rsimmanuelbdg"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-red-300 bg-gradient-to-br from-[#FF1C11] to-[#C90906] p-6 text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                <svg
                    viewBox="0 0 24 24"
                    className="ml-0.5 h-6 w-6 fill-white"
                    aria-hidden="true"
                >
                    <path d="M8 5v14l11-7z" />
                </svg>
                </div>

                <h2 className="mt-5 font-serif text-2xl font-bold">
                Tonton di YouTube
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-white/85 md:text-base">
                Ratusan video edukasi kesehatan, tips dokter spesialis, dan prosedur
                medis tersedia di channel YouTube kami.
                </p>

                <div className="mt-6 rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-[#D50D09]">
                Subscribe Channel →
                </div>
            </a>

            {/* PERTANYAAN WHATSAPP */}
            <a
                href="https://wa.me/6282120803478"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-[#2D4B91] bg-gradient-to-br from-[#21368B] to-[#122A63] p-6 text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
                <h2 className="flex items-center gap-2 font-serif text-xl font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-xs">
                    ●●●
                </span>
                Ada Pertanyaan?
                </h2>

                <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
                Tim edukasi dan promosi kami siap membantu menjawab pertanyaan
                seputar kesehatan dan program RS Immanuel.
                </p>

                <div className="mt-6 rounded-xl bg-[#E4B72B] px-5 py-3 text-center text-sm font-bold text-white transition group-hover:bg-[#F2C530]">
                Chat WhatsApp Sekarang
                </div>
            </a>
            </aside>
        </div>
        )}
      </section>

      {/* MODAL DETAIL PROMO */}
      {selectedPromo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          onClick={closePromo}
        >
          <div
            className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-[220px] w-full overflow-hidden md:h-[280px]">
              <img
                src={getImageUrl(selectedPromo.image_url)}
                alt={selectedPromo.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50" />

              <button
                type="button"
                onClick={closePromo}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white transition hover:bg-black/80"
                aria-label="Tutup detail promo"
              >
                ×
              </button>

              <div className="absolute bottom-0 left-0 right-0 z-10 p-5 text-white md:p-8">
                <p className="mb-2 text-xs text-white/80 md:text-sm">
                  Berlaku sampai: {formatDate(selectedPromo.expired_at)}
                </p>

                <h2 className="text-xl font-bold leading-tight md:text-3xl">
                  {selectedPromo.title}
                </h2>
              </div>
            </div>

            {/* ISI DETAIL YANG BISA DI-SCROLL */}
            <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="p-6 md:p-8">
                {selectedPromo.detail_description &&
                formatDetailDescription(selectedPromo.detail_description)}
            </div>
            </div>
          
            {/* FOOTER BUTTON — TIDAK IKUT SCROLL */}
            <div className="shrink-0 border-t border-gray-200 bg-white p-4 md:p-5">
              {selectedPromo.whatsapp_url && (
                <a
                  href={selectedPromo.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00B948] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#009E3D]"
                >
                  {/* Icon WhatsApp */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M12.04 2C6.5 2 2 6.46 2 12c0 1.77.46 3.5 1.34 5.03L2 22l5.13-1.3A10 10 0 1 0 12.04 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.04.77.81-2.95-.2-.3A8.2 8.2 0 1 1 12.04 20.2Zm4.5-6.14c-.25-.13-1.47-.73-1.7-.81-.23-.09-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06a6.73 6.73 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.01-.38.11-.51.11-.11.25-.3.37-.45.13-.15.17-.25.25-.42.09-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.45.06-.68.32-.23.25-.9.88-.9 2.15s.92 2.5 1.05 2.67c.13.17 1.8 2.74 4.36 3.84.61.26 1.09.42 1.46.54.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.57.21-1.06.15-1.17-.06-.1-.23-.17-.48-.3Z" />
                  </svg>

                  Tanya via WhatsApp
                </a>
              )}

            </div>
          </div>
        </div>
      )}
    </main>
  );
}