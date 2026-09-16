"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import {
  getHealthEducation,
  HealthEducationItem,
} from "@/services/HealthEducationService";

import {
  getUpcomingEvents,
  UpcomingEventItem,
} from "@/services/UpcomingEventService";

export default function EdukasiKesehatanPage() {
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const [healthEducations, setHealthEducations] = useState<
    HealthEducationItem[]
  >([]);

  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedArticle, setSelectedArticle] =
  useState<HealthEducationItem | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
        try {
        setLoading(true);

        const [healthEducationResult, upcomingEventResult] = await Promise.all([
            getHealthEducation(),
            getUpcomingEvents(),
        ]);

        if (
            healthEducationResult.success &&
            Array.isArray(healthEducationResult.data)
        ) {
            const sortedHealthEducations = [...healthEducationResult.data].sort(
            (a, b) => a.order - b.order
            );

            setHealthEducations(sortedHealthEducations);
        } else {
            setHealthEducations([]);
        }

        if (
            upcomingEventResult.success &&
            Array.isArray(upcomingEventResult.data)
        ) {
            const sortedUpcomingEvents = [...upcomingEventResult.data].sort(
            (a, b) => a.order - b.order
            );

            setUpcomingEvents(sortedUpcomingEvents);
        } else {
            setUpcomingEvents([]);
        }
        } catch (error) {
        console.error("Gagal mengambil data halaman edukasi:", error);
        setHealthEducations([]);
        setUpcomingEvents([]);
        } finally {
        setLoading(false);
        }
    };

    fetchPageData();
  }, []);

  const featured = healthEducations.find((item) => item.order === 1);

  const others = healthEducations.filter((item) => item.order !== 1);

  const getImageUrl = (imageUrl?: string | null): string => {
    if (!imageUrl?.trim()) {
        return "";
    }

    if (
        imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://")
    ) {
        return imageUrl;
    }

    return `https://app.rsimmanuel.net${imageUrl}`;
  };

  const formatPublishedDate = (date: string | null) => {
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

  const openArticle = (item: HealthEducationItem) => {
    setSelectedArticle(item);
    document.body.style.overflow = "hidden";
  };

    const closeArticle = () => {
    setSelectedArticle(null);
    document.body.style.overflow = "";
  };

  const formatDetailDescription = (text: string) => {
    const lines = text.split("\n");

    return (
        <div className="space-y-5">
        {lines.map((line, index) => {
            const trimmedLine = line.trim();

            // Baris kosong
            if (!trimmedLine) {
            return <div key={index} className="h-1" />;
            }

            // Numbered list: 1. xxx / 2. xxx / 3. xxx
            if (/^\d+\.\s/.test(trimmedLine)) {
            return (
                <h3
                key={index}
                className="text-base md:text-lg font-bold text-[#21368B] mt-5"
                >
                {trimmedLine}
                </h3>
            );
            }

            // Bullet list: - xxx
            if (/^-\s/.test(trimmedLine)) {
            return (
                <div
                key={index}
                className="flex gap-3 ml-2 text-sm md:text-base text-gray-700 leading-relaxed"
                >
                <span className="text-[#21368B] font-bold shrink-0">
                    •
                </span>

                <p>{trimmedLine.replace(/^-\s*/, "")}</p>
                </div>
            );
            }

            // Bullet list: • xxx
            if (/^•\s/.test(trimmedLine)) {
            return (
                <div
                key={index}
                className="flex gap-3 ml-2 text-sm md:text-base text-gray-700 leading-relaxed"
                >
                <span className="text-[#21368B] font-bold shrink-0">
                    •
                </span>

                <p>{trimmedLine.replace(/^•\s*/, "")}</p>
                </div>
            );
            }

            // Paragraf biasa
            return (
            <p
                key={index}
                className="text-sm md:text-base text-gray-700 leading-relaxed"
            >
                {trimmedLine}
            </p>
            );
        })}
        </div>
    );
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
    <main className="min-h-screen">
      {/* HERO */}
      <section className="bg-[#21368B] text-white py-20 px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto max-w-8xl text-left">
          <h1 className="text-3xl md:text-5xl font-bold">
            {t.infoSehat}
          </h1>

          <p className="mt-4 max-w-xl text-sm md:text-lg text-white/80 leading-relaxed">
            Artikel kesehatan, dan penelitian klinis dari tim medis, perawat,
            dan edukator kesehatan RS Immanuel Bandung. Beberapa dilengkapi
            video dari YouTube kami.
          </p>

          {/* YOUTUBE */}
          <a
            href="https://www.youtube.com/@rsimmanuelbdg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5"
          >
            <img
              src="/youtube_kami.png"
              alt="YouTube RS Immanuel Bandung"
              className="w-40 md:w-auto h-auto cursor-pointer transition-transform duration-200 hover:scale-105"
            />
          </a>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-8xl px-6 sm:px-8 md:px-12 lg:px-16 py-12">
        {/* LOADING */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#21368B] rounded-full animate-spin" />
          </div>
        )}

        {/* EMPTY */}
        {!loading && healthEducations.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Belum ada informasi edukasi kesehatan.
          </div>
        )}

        {/* FEATURED - ORDER 1 */}
        {!loading && featured && (
        <div className="mb-12">
            <div className="relative isolate w-full h-[320px] md:h-[380px] rounded-2xl overflow-hidden shadow-md">

            {/* BACKGROUND IMAGE */}
            {getImageUrl(featured.background_image_url) && (
                <img
                    src={getImageUrl(featured.background_image_url)!}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/45" />

            {/* TOMBOL BACA ARTIKEL */}
            <button
            type="button"
            onClick={() => openArticle(featured)}
            className="absolute top-5 right-5 md:top-7 md:right-7 z-30 cursor-pointer"
            >
            <img
                src="/baca_artikel.png"
                alt="Baca Artikel"
                className="w-28 h-auto transition-transform duration-200 hover:scale-105"
            />
            </button>

            {/* CONTENT */}
            <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10 text-white">

                <p className="text-sm text-white/80 mb-2">
                {formatPublishedDate(featured.published_at)}
                </p>

                <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                {featured.title}
                </h2>

                {featured.description && (
                <p className="mt-3 max-w-3xl text-sm md:text-base text-white/90 leading-relaxed line-clamp-2">
                    {featured.description}
                </p>
                )}

            </div>
            </div>
        </div>
        )}

       {/* OTHER CONTENT + KEGIATAN MENDATANG */}
        {!loading && (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_370px]">
            {/* LIST ARTIKEL */}
            <div>
            {others.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {others.map((item) => (
                    <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
                    >
                    <div className="w-full aspect-[16/9] overflow-hidden">
                       {getImageUrl(item.background_image_url) && (
                            <img
                                src={getImageUrl(item.background_image_url)!}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        )}
                    </div>

                    <div className="p-5">
                        <p className="text-xs text-gray-500 md:text-sm">
                        {formatPublishedDate(item.published_at)}
                        </p>

                        <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-gray-800 md:text-xl">
                        {item.title}
                        </h2>

                        {item.description && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                            {item.description}
                        </p>
                        )}

                        <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={() => openArticle(item)}
                            className="inline-block"
                        >
                            <img
                            src="/baca.png"
                            alt="Baca Artikel"
                            className="h-auto w-12 cursor-pointer transition-transform duration-200 hover:scale-105"
                            />
                        </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>

            {/* SIDEBAR KANAN */}
            <aside className="space-y-6">
            {/* CARD KEGIATAN MENDATANG */}
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

            {/* CARD YOUTUBE — BORDER TERPISAH */}
            <a
                href="https://www.youtube.com/@rsimmanuelbdg"
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-2xl border border-red-300 bg-gradient-to-br from-[#FF1C11] to-[#C90906] p-6 text-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
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

                <div className="mt-6 rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-[#D50D09] transition group-hover:bg-[#FFF1F0] md:text-base">
                Subscribe Channel →
                </div>
            </a>

            {/* CARD WHATSAPP */}
            <a
            href="https://wa.me/6282120803478"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-[#2D4B91] bg-gradient-to-br from-[#21368B] to-[#122A63] p-6 text-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
            <h2 className="flex items-center gap-2 font-serif text-xl font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-sm">
                ●●●
                </span>
                Ada Pertanyaan?
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
                Tim edukasi dan promosi kami siap membantu menjawab pertanyaan seputar
                kesehatan dan program RS Immanuel.
            </p>

            <div className="mt-6 rounded-xl bg-[#E4B72B] px-5 py-3 text-center text-sm font-bold text-white transition group-hover:bg-[#F2C530] md:text-base">
                Chat WhatsApp Sekarang
            </div>
            </a>
            </aside>
            </div>
        )}
      </section>

      {/* POPUP DETAIL ARTIKEL */}
        {selectedArticle && (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
            onClick={closeArticle}
        >
            {selectedArticle.content_type?.toLowerCase() === "image" ? (
            /* =========================================
                POPUP IMAGE
                CATEGORY = IMAGE
                ========================================= */
            <div
                className="relative max-w-6xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* IMAGE FULL */}
                {selectedArticle.image_url && (
                <img
                    src={getImageUrl(selectedArticle.image_url)}
                    alt={selectedArticle.title || "Image"}
                    className="block max-h-[90vh] max-w-full object-contain rounded-2xl"
                />
                )}

                {/* CLOSE */}
                <button
                type="button"
                onClick={closeArticle}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white transition hover:bg-black/80 cursor-pointer"
                >
                ×
                </button>
            </div>
            ) : (
            /* =========================================
                POPUP ARTIKEL BIASA
                CATEGORY != IMAGE
                ========================================= */
            <div
                className="relative w-full max-w-4xl h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER IMAGE */}
                <div className="relative w-full h-[220px] md:h-[280px] overflow-hidden">

                {/* IMAGE */}
                {selectedArticle.image_url && (
                    <img
                    src={getImageUrl(selectedArticle.image_url)}
                    alt={selectedArticle.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    />
                )}

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/45" />

                {/* CLOSE */}
                <button
                    type="button"
                    onClick={closeArticle}
                    className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white transition hover:bg-black/80 cursor-pointer"
                >
                    ×
                </button>

                {/* TITLE + DATE */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-5 md:p-8 text-white">

                    {/* DATE */}
                    <p className="text-xs md:text-sm text-white/80 mb-2">
                    {formatPublishedDate(selectedArticle.published_at)}
                    </p>

                    {/* TITLE */}
                    <h2 className="text-xl md:text-3xl font-bold leading-tight">
                    {selectedArticle.title}
                    </h2>

                </div>
                </div>

                {/* DETAIL ONLY SCROLL */}
                <div className="h-[calc(85vh-220px)] md:h-[calc(85vh-280px)] overflow-y-auto">
                <div className="p-6 md:p-8">

                    {/* DETAIL DESCRIPTION */}
                    {selectedArticle.detail_description && (
                    <div>
                        {formatDetailDescription(
                        selectedArticle.detail_description
                        )}
                    </div>
                    )}

                </div>
                </div>
            </div>
            )}
        </div>
        )}

    </main>
  );
}