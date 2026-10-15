"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
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

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

type ArticleFilter = "Semua" | "Artikel" | "Video";

const filters: ArticleFilter[] = ["Semua", "Artikel", "Video"];
const YOUTUBE_URL = "https://www.youtube.com/@rsimmanuelbdg";
const INSTAGRAM_URL = "https://www.instagram.com/immanuelhospitalbdg/";

export default function EdukasiKesehatanPage() {
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const [healthEducations, setHealthEducations] = useState<HealthEducationItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<HealthEducationItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<ArticleFilter>("Semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const [educationResult, eventResult] = await Promise.all([
          getHealthEducation(),
          getUpcomingEvents(),
        ]);
        if (!active) return;
        setHealthEducations(
          educationResult.success && Array.isArray(educationResult.data)
            ? [...educationResult.data].sort((a, b) => a.order - b.order)
            : [],
        );
        setUpcomingEvents(
          eventResult.success && Array.isArray(eventResult.data)
            ? [...eventResult.data].sort((a, b) => a.order - b.order)
            : [],
        );
      } catch (error) {
        console.error("Gagal mengambil data halaman edukasi:", error);
        if (active) {
          setHealthEducations([]);
          setUpcomingEvents([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchPageData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedArticle) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedArticle(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedArticle]);

  const getImageUrl = (imageUrl?: string | null): string => {
    if (!imageUrl?.trim()) return "";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return `https://app.rsimmanuel.net${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  const formatPublishedDate = (date: string | null) => {
    if (!date) return "-";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(parsed);
  };

  const formatEventDate = (date: string) => {
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return { day: "-", month: "" };
    return {
      day: new Intl.DateTimeFormat("id-ID", { day: "numeric" }).format(parsed),
      month: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(parsed),
    };
  };

  const matchesFilter = (item: HealthEducationItem) => {
    if (activeFilter === "Semua") return true;
    const isVideo = (item.content_type ?? "").toLowerCase().includes("video");
    return activeFilter === "Video" ? isVideo : !isVideo;
  };

  const visibleArticles = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id-ID");
    return healthEducations.filter((item) => {
      const matchesQuery = !query ||
        `${item.title} ${item.description ?? ""}`.toLocaleLowerCase("id-ID").includes(query);
      return matchesQuery && matchesFilter(item);
    });
  }, [healthEducations, activeFilter, search]);

  const featured = visibleArticles.find((item) => item.order === 1) ?? visibleArticles[0];
  const otherArticles = visibleArticles.filter((item) => item.id !== featured?.id);

  const formatDetailDescription = (text: string) => (
    <div className="space-y-4">
      {text.split("\n").map((line, index) => {
        const value = line.trim();
        if (!value) return <div key={index} className="h-1" />;
        if (/^\d+\.\s/.test(value)) {
          return <h3 key={index} className="mt-5 text-base font-bold text-[#1B2C78] md:text-lg">{value}</h3>;
        }
        if (/^[-•]\s/.test(value)) {
          return (
            <div key={index} className="ml-2 flex gap-3 text-sm leading-relaxed text-slate-700 md:text-base">
              <span className="shrink-0 font-bold text-[#1B2C78]">•</span>
              <p>{value.replace(/^[-•]\s*/, "")}</p>
            </div>
          );
        }
        return <p key={index} className="text-sm leading-relaxed text-slate-700 md:text-base">{value}</p>;
      })}
    </div>
  );

  const ArticleMeta = ({ item }: { item: HealthEducationItem }) => (
    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
      <span className="rounded-full bg-[#E9EDFA] px-2.5 py-1 font-semibold text-[#1B2C78]">
        {item.content_type?.toLowerCase().includes("video") ? "Video" : "Artikel"}
      </span>
      <span>{formatPublishedDate(item.published_at)}</span>
    </div>
  );

  return (
    <main className={`${plusJakartaSans.className} min-h-screen bg-white text-[#172453]`}>
      {/* HERO: gutters, breadcrumb, and heading align with Cari Dokter */}
      <section className="bg-[#182772] px-6 pb-20 pt-20 text-white sm:px-8 sm:pb-24 md:px-12 lg:px-16 xl:px-20">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="flex max-w-[780px] flex-col gap-3">
              <p className="font-normal leading-none text-white/75 sm:text-sm">
                Beranda / Edukasi Kesehatan
              </p>
              <div>
                <h1 className="mb-3 text-[32px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[42px] md:text-[48px] lg:text-[52px] lg:leading-[1.1]">
                  {t.infoSehat}
                </h1>
                <p className="max-w-[720px] text-[14px] font-normal leading-[1.6] text-[#C2CEEB] sm:text-base md:text-[17px]">
                  Artikel kesehatan dan penelitian klinis dari tim medis, perawat, dan edukator kesehatan RS Immanuel Bandung. Beberapa dilengkapi video dari YouTube kami.
                </p>
              </div>
            </div>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit shrink-0 items-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#172453] transition hover:bg-[#F1F3FA]"
            >
              <span className="text-lg leading-none text-[#D5231D]" aria-hidden="true">▶</span>
              Tonton Channel YouTube
            </a>
          </div>
        </div>
      </section>
      {/* ARTICLE LIST AND FILTERS */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 md:px-12 lg:px-16 lg:py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${activeFilter === filter ? "border-[#172453] bg-[#172453] text-white" : "border-[#D9DFEF] bg-white text-[#172453] hover:bg-[#F5F7FC]"}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <label className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#D9DFEF] bg-white px-4 text-slate-500 md:max-w-[390px]">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari artikel..."
              className="w-full bg-transparent text-sm text-[#172453] outline-none placeholder:text-slate-400"
              aria-label="Cari artikel"
            />
          </label>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center" aria-label="Memuat edukasi kesehatan">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1B2C78]" />
          </div>
        ) : visibleArticles.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E6F0] bg-[#F8F9FC] py-16 text-center text-sm text-slate-500">
            {healthEducations.length === 0 ? "Belum ada informasi edukasi kesehatan." : "Artikel tidak ditemukan. Coba kata kunci atau kategori lain."}
          </div>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1.55fr_1fr]">
            {featured && (
              <article className="overflow-hidden rounded-[24px] border border-[#E3E6EF] bg-white">
                <button type="button" onClick={() => setSelectedArticle(featured)} className="block w-full text-left">
                  <div className="aspect-[16/9] w-full overflow-hidden bg-[repeating-linear-gradient(135deg,#e9edf8_0px,#e9edf8_13px,#dce3f3_13px,#dce3f3_26px)]">
                    {getImageUrl(featured.background_image_url) ? (
                      <img src={getImageUrl(featured.background_image_url)} alt={featured.title} className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]" />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-sm font-semibold text-slate-500">Thumbnail artikel utama (foto / ilustrasi, minim teks)</div>
                    )}
                  </div>
                  <div className="p-5 sm:p-7">
                    <ArticleMeta item={featured} />
                    <h2 className="mt-3 line-clamp-2 text-[24px] font-extrabold leading-[1.2] text-[#172453] sm:text-[30px] lg:text-[34px]">
                      {featured.title}
                    </h2>
                    {featured.description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500 sm:text-base">{featured.description}</p>}
                    <span className="mt-4 inline-flex text-sm font-bold text-[#1B2C78]">Baca artikel →</span>
                  </div>
                </button>
              </article>
            )}

            <div className="flex flex-col gap-5">
              {otherArticles.map((item) => (
                <article key={item.id} className="flex min-h-[190px] overflow-hidden rounded-[24px] border border-[#E3E6EF] bg-white">
                  <button type="button" onClick={() => setSelectedArticle(item)} className="flex w-full text-left">
                    <div className="w-[38%] shrink-0 self-stretch overflow-hidden bg-[repeating-linear-gradient(135deg,#e9edf8_0px,#e9edf8_13px,#dce3f3_13px,#dce3f3_26px)] sm:w-[42%]">
                      {getImageUrl(item.background_image_url) ? (
                        <img src={getImageUrl(item.background_image_url)} alt={item.title} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                      ) : (
                        <div className="flex h-full min-h-[190px] items-center justify-center px-2 text-center text-xs font-medium text-slate-500">Thumbnail</div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-5">
                      <ArticleMeta item={item} />
                      <h2 className="mt-3 line-clamp-2 text-[18px] font-bold leading-[1.25] text-[#172453] sm:text-[20px]">{item.title}</h2>
                      <span className="mt-3 text-sm font-bold text-[#1B2C78]">Baca artikel →</span>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* UPCOMING EVENTS */}
      <section className="mx-auto w-full max-w-[1440px] px-5 pb-8 sm:px-8 md:px-12 lg:px-16">
        {upcomingEvents.length === 0 ? (
          <div className="flex flex-col gap-5 rounded-[24px] border border-dashed border-[#D6DDF0] bg-[#F7F8FC] p-6 sm:p-8 md:flex-row md:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#E9EDFA] text-[#1B2C78]">
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth="1.9" aria-hidden="true">
                <rect x="3.5" y="5" width="17" height="16" rx="2" />
                <path d="M7.5 3v4M16.5 3v4M4 9.5h16" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-[22px] font-bold leading-[1.25] text-[#172453] sm:text-[24px]">Kegiatan Mendatang</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500 sm:text-base">Belum ada kegiatan terjadwal. Ikuti Instagram kami untuk info seminar dan penyuluhan terbaru.</p>
            </div>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl border border-[#D6DDF0] bg-white px-5 text-sm font-bold text-[#1B2C78] transition hover:bg-[#EEF1FA]">
              Ikuti @immanuelhospitalbdg
            </a>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#D6DDF0] bg-[#F7F8FC] p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9EDFA] text-[#1B2C78]" aria-hidden="true">▦</div>
              <h2 className="text-[22px] font-bold text-[#172453] sm:text-[24px]">Kegiatan Mendatang</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingEvents.map((event) => {
                const date = formatEventDate(event.event_date);
                return (
                  <div key={event.id} className="flex gap-4 rounded-2xl bg-white p-4">
                    <div className="flex h-[72px] w-[58px] shrink-0 flex-col items-center justify-center rounded-2xl bg-[#E9EDFA] text-[#1B2C78]">
                      <span className="text-xl font-bold leading-none">{date.day}</span>
                      <span className="mt-1 text-xs font-semibold">{date.month}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[#172453]">{event.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{event.start_time}–{event.end_time} · {event.location}</p>
                      {event.category && <span className="mt-2 inline-block rounded-full bg-[#E2F5F1] px-2.5 py-1 text-xs font-semibold text-[#258B88]">{event.category}</span>}
                    </div>
                    {event.registration_url && <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="self-center text-sm font-bold text-[#1B2C78]">Daftar →</a>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* PROMO CARDS */}
      <section className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-5 px-5 pb-12 sm:px-8 md:px-12 lg:grid-cols-2 lg:gap-6 lg:px-16">
        <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="group rounded-[24px] bg-[#F3F4FA] p-6 transition hover:bg-[#ECEEF7] sm:p-8">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#D5231D] text-white">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-current" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <h2 className="mt-4 text-[23px] font-bold leading-[1.25] text-[#172453] sm:text-[24px]">Tonton di YouTube</h2>
          <p className="mt-3 max-w-[620px] text-sm leading-relaxed text-slate-500 sm:text-base">Ratusan video edukasi kesehatan, tips dokter spesialis, dan prosedur medis tersedia di channel YouTube kami.</p>
          <span className="mt-5 inline-flex rounded-xl border border-[#D6DDF0] bg-white px-5 py-3 text-sm font-bold text-[#172453] transition group-hover:bg-[#F9FAFD]">Subscribe Channel →</span>
        </a>

        <a href="https://wa.me/6282120803478" target="_blank" rel="noopener noreferrer" className="group rounded-[24px] bg-[#141F55] p-6 text-white transition hover:bg-[#101943] sm:p-8">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#E5AD17] text-[#172453]">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true"><path d="M20 11.4a7.8 7.8 0 0 1-8 7.6 8.8 8.8 0 0 1-3.5-.7L4 19l1.1-3.2A7.3 7.3 0 0 1 4 11.4a7.8 7.8 0 0 1 8-7.4 7.8 7.8 0 0 1 8 7.4Z" /></svg>
          </div>
          <h2 className="mt-4 text-[23px] font-bold leading-[1.25] sm:text-[24px]">Ada pertanyaan?</h2>
          <p className="mt-3 max-w-[620px] text-sm leading-relaxed text-white/75 sm:text-base">Tim edukasi dan promosi kami siap membantu menjawab pertanyaan seputar kesehatan dan program RS Immanuel.</p>
          <span className="mt-5 inline-flex rounded-xl bg-[#E5AD17] px-5 py-3 text-sm font-bold text-[#172453] transition group-hover:bg-[#F0BC29]">Chat WhatsApp Sekarang</span>
        </a>
      </section>

      {/* ARTICLE MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 p-3 sm:p-5" onClick={() => setSelectedArticle(null)}>
          {selectedArticle.content_type?.toLowerCase() === "image" ? (
            <div className="relative max-h-[92vh] max-w-6xl" onClick={(event) => event.stopPropagation()}>
              {selectedArticle.image_url && <img src={getImageUrl(selectedArticle.image_url)} alt={selectedArticle.title || "Konten gambar"} className="block max-h-[92vh] max-w-full rounded-2xl object-contain" />}
              <button type="button" onClick={() => setSelectedArticle(null)} aria-label="Tutup" className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-2xl text-white hover:bg-black/80">×</button>
            </div>
          ) : (
            <article className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <header className="relative h-[220px] shrink-0 overflow-hidden bg-slate-300 sm:h-[280px]">
                {selectedArticle.image_url && <img src={getImageUrl(selectedArticle.image_url)} alt={selectedArticle.title} className="absolute inset-0 h-full w-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <button type="button" onClick={() => setSelectedArticle(null)} aria-label="Tutup" className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white hover:bg-black/80">×</button>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                  <p className="mb-2 text-xs text-white/80 sm:text-sm">{formatPublishedDate(selectedArticle.published_at)}</p>
                  <h2 className="text-[24px] font-extrabold leading-[1.15] sm:text-[32px]">{selectedArticle.title}</h2>
                </div>
              </header>
              <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
                {selectedArticle.detail_description && formatDetailDescription(selectedArticle.detail_description)}
              </div>
            </article>
          )}
        </div>
      )}
    </main>
  );
}





