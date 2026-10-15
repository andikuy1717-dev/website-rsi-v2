"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getPromos, PromoItem } from "@/services/PromoService";
import {
  getUpcomingEvents,
  UpcomingEventItem,
} from "@/services/UpcomingEventService";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const YOUTUBE_URL = "https://www.youtube.com/@rsimmanuelbdg";
const INSTAGRAM_URL = "https://www.instagram.com/immanuelhospitalbdg/";
type PromoFilter = "Semua promo" | string;

export default function PromoPage() {
  const [promos, setPromos] = useState<PromoItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<PromoFilter>("Semua promo");

  useEffect(() => {
    let active = true;
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const [promoResult, eventResult] = await Promise.all([
          getPromos(),
          getUpcomingEvents(),
        ]);
        if (!active) return;
        setPromos(
          promoResult.success && Array.isArray(promoResult.data)
            ? [...promoResult.data].sort((a, b) => a.order - b.order)
            : [],
        );
        setUpcomingEvents(
          eventResult.success && Array.isArray(eventResult.data)
            ? [...eventResult.data].sort((a, b) => a.order - b.order)
            : [],
        );
      } catch (error) {
        console.error("Gagal mengambil data promo:", error);
        if (active) {
          setPromos([]);
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
    if (!selectedPromo) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPromo(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedPromo]);

  const getImageUrl = (imageUrl?: string | null) => {
    if (!imageUrl?.trim()) return "";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return `https://app.rsimmanuel.net${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  const formatDate = (date: string | null) => {
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

  const categories = useMemo(
    () => [...new Set(promos.map((promo) => promo.category).filter(Boolean))],
    [promos],
  );
  const visiblePromos = useMemo(
    () => activeFilter === "Semua promo"
      ? promos
      : promos.filter((promo) => promo.category === activeFilter),
    [promos, activeFilter],
  );
  const featuredPromo = visiblePromos.find((promo) => promo.order === 1) ?? visiblePromos[0];
  const otherPromos = visiblePromos.filter((promo) => promo.id !== featuredPromo?.id);

  const formatDetailDescription = (text: string) => (
    <div className="space-y-2">
      {text.split("\n").map((line, index) => {
        const value = line.trim();
        if (!value) return null;
        if (/^[-•✓✔]\s*/.test(value)) {
          return (
            <p key={index} className="flex gap-2 text-sm leading-relaxed text-slate-600">
              <span className="shrink-0 text-[#1B2C78]">✓</span>
              <span>{value.replace(/^[-•✓✔]\s*/, "")}</span>
            </p>
          );
        }
        return <p key={index} className="text-sm leading-relaxed text-slate-600">{value}</p>;
      })}
    </div>
  );

  const PromoCard = ({ promo }: { promo: PromoItem }) => (
    <article className="overflow-hidden rounded-[24px] border border-[#E3E7F0] bg-white transition hover:shadow-md">
      <button type="button" onClick={() => setSelectedPromo(promo)} className="block w-full text-left">
        <div className="aspect-[16/9] overflow-hidden bg-[repeating-linear-gradient(135deg,#e9edf8_0px,#e9edf8_13px,#dce3f3_13px,#dce3f3_26px)]">
          {getImageUrl(promo.image_url) ? (
            <img src={getImageUrl(promo.image_url)} alt={promo.title} className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]" />
          ) : (
            <div className="flex h-full items-center justify-center text-center text-sm font-semibold text-slate-500">Foto promo (tanpa teks di atas foto)</div>
          )}
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#F8E39A] px-3 py-1 text-xs font-bold text-[#172453]">{promo.category}</span>
            {promo.expired_at && <span className="text-xs text-slate-500">Berakhir {formatDate(promo.expired_at)}</span>}
          </div>
          <h2 className="mt-3 line-clamp-2 text-xl font-bold leading-[1.25] text-[#172453]">{promo.title}</h2>
          <span className="mt-3 inline-flex text-sm font-bold text-[#1B2C78]">Lihat promo →</span>
        </div>
      </button>
    </article>
  );

  return (
    <main className={`${plusJakartaSans.className} min-h-screen bg-white text-[#172453]`}>
      {/* HERO — full-width background, content aligned to max-w */}
      <section className="w-full bg-[#182772] text-white">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12 md:px-10 lg:px-12 lg:pb-24 lg:pt-14 xl:px-16 2xl:px-20">
          <div className="flex min-w-0 max-w-[780px] flex-col gap-3">
            {/* BREADCRUMB */}
            <p className="text-xs font-normal leading-relaxed text-white/75 sm:text-sm">
              Beranda / Promo
            </p>

            <div>
              {/* JUDUL */}
              <h1 className="mb-3 text-[32px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[38px] md:text-[44px] lg:text-[48px] xl:text-[52px]">
                Promo Kesehatan
              </h1>

              {/* DESKRIPSI */}
              <p className="max-w-[720px] text-sm font-normal leading-[1.7] text-[#C2CEEB] sm:text-base lg:text-[17px]">
                Temukan berbagai promo layanan kesehatan RS Immanuel Bandung
                untuk Anda dan keluarga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO CONTENT */}
      <section className="mx-auto w-full max-w-[1440px] px-6 py-8 sm:px-8 md:px-12 lg:px-16 xl:px-20 lg:py-10">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center" aria-label="Memuat promo">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1B2C78]" />
          </div>
        ) : promos.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E6F0] bg-[#F8F9FC] py-16 text-center text-sm text-slate-500">
            Belum ada promo yang tersedia.
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveFilter("Semua promo")}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition sm:text-sm ${activeFilter === "Semua promo" ? "border-[#172453] bg-[#172453] text-white" : "border-[#D9DFEF] bg-white text-[#172453] hover:bg-[#F5F7FC]"}`}
              >
                Semua promo ({promos.length})
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveFilter(category)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${activeFilter === category ? "border-[#172453] bg-[#172453] text-white" : "border-[#D9DFEF] bg-white text-[#172453] hover:bg-[#F5F7FC]"}`}
                >
                  {category}
                </button>
              ))}
            </div>

            {visiblePromos.length === 0 ? (
              <div className="rounded-2xl border border-[#E2E6F0] bg-[#F8F9FC] py-16 text-center text-sm text-slate-500">Belum ada promo dalam kategori ini.</div>
            ) : (
              <>
                {featuredPromo && (
                  <article className="mb-12 grid overflow-hidden rounded-[24px] border border-[#E3E7F0] bg-white lg:min-h-[460px] lg:grid-cols-[1fr_1.08fr]">
                    <div className="aspect-[16/9] overflow-hidden bg-[repeating-linear-gradient(135deg,#e9edf8_0px,#e9edf8_13px,#dce3f3_13px,#dce3f3_26px)] lg:aspect-auto lg:min-h-[460px]">
                      {getImageUrl(featuredPromo.image_url) ? (
                        <img src={getImageUrl(featuredPromo.image_url)} alt={featuredPromo.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full min-h-[230px] items-center justify-center px-4 text-center text-sm font-semibold text-slate-600 lg:min-h-full">Foto promo (tanpa teks di atas foto)</div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-col p-5 sm:p-7 lg:p-8">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#F8E39A] px-3 py-1 text-xs font-bold text-[#172453]">{featuredPromo.category}</span>
                        {featuredPromo.expired_at && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0EA] px-3 py-1 text-xs font-medium text-[#A64E35]">
                            <span aria-hidden="true">◷</span> Berakhir {formatDate(featuredPromo.expired_at)}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 text-[24px] font-extrabold leading-[1.2] text-[#172453] sm:text-[30px] lg:text-[32px]">{featuredPromo.title}</h2>
                      {featuredPromo.description && <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{featuredPromo.description}</p>}

                      {featuredPromo.detail_description && (
                        <div className="mt-4 rounded-2xl bg-[#F3F4FA] p-4 sm:p-5">
                          <p className="mb-2 text-sm font-bold text-[#172453]">Detail promo:</p>
                          <div className="line-clamp-5">{formatDetailDescription(featuredPromo.detail_description)}</div>
                        </div>
                      )}

                      <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Informasi promo</p>
                          <p className="mt-1 text-sm font-bold text-[#172453]">Hubungi kami untuk detail dan ketersediaan</p>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                          {featuredPromo.whatsapp_url && (
                            <a href={featuredPromo.whatsapp_url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#D9DFEF] bg-white px-4 py-2 text-sm font-bold text-[#172453] transition hover:bg-[#F5F7FC]">
                              Tanya via WhatsApp
                            </a>
                          )}
                          <button type="button" onClick={() => setSelectedPromo(featuredPromo)} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1B2C78] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#142153]">
                            Ambil Promo
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )}

                {otherPromos.length > 0 && (
                  <div className="mb-12">
                    <h2 className="mb-5 text-[24px] font-extrabold leading-[1.2] text-[#172453] sm:text-[28px]">Promo lainnya</h2>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {otherPromos.map((promo) => <PromoCard key={promo.id} promo={promo} />)}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>

      {/* EVENTS + CONTACT CARDS */}
      <section className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-5 px-6 pb-12 sm:px-8 md:px-12 lg:grid-cols-3 lg:gap-6 lg:px-16 xl:px-20">
        <div className="rounded-[24px] border border-dashed border-[#D6DDF0] bg-[#F7F8FC] p-5 sm:p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E9EDFA] text-[#1B2C78]" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.8"><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3v4M16.5 3v4M4 9.5h16" /></svg>
          </div>
          <h2 className="mt-3 text-[18px] font-bold leading-[1.3] text-[#172453] sm:text-[20px]">Kegiatan Mendatang</h2>
          {upcomingEvents.length === 0 ? (
            <>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Belum ada kegiatan terjadwal. Pantau Instagram kami untuk info terbaru.</p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-bold text-[#1B2C78]">@immanuelhospitalbdg →</a>
            </>
          ) : (
            <div className="mt-3 space-y-3">
              {upcomingEvents.slice(0, 2).map((event) => {
                const date = formatEventDate(event.event_date);
                return (
                  <div key={event.id} className="flex items-start gap-3 border-t border-[#E3E7F0] pt-3">
                    <div className="flex h-12 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-[#E9EDFA] text-[#1B2C78]">
                      <span className="text-sm font-bold leading-none">{date.day}</span>
                      <span className="mt-1 text-[10px] font-semibold">{date.month}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#172453]">{event.title}</h3>
                      <p className="mt-1 text-xs text-slate-500">{event.start_time}–{event.end_time}</p>
                    </div>
                  </div>
                );
              })}
              {upcomingEvents[0]?.registration_url && <a href={upcomingEvents[0].registration_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-sm font-bold text-[#1B2C78]">Info dan pendaftaran →</a>}
            </div>
          )}
        </div>

        <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="group rounded-[24px] bg-[#F3F4FA] p-5 transition hover:bg-[#ECEEF7] sm:p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D5231D] text-white">
            <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 fill-current" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <h2 className="mt-3 text-[18px] font-bold leading-[1.3] text-[#172453] sm:text-[20px]">Tonton di YouTube</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Video edukasi kesehatan, tips dokter spesialis, dan prosedur medis.</p>
          <span className="mt-4 inline-flex text-sm font-bold text-[#1B2C78]">Subscribe Channel →</span>
        </a>

        <a href="https://wa.me/6282120803478" target="_blank" rel="noopener noreferrer" className="group rounded-[24px] bg-[#141F55] p-5 text-white transition hover:bg-[#101943] sm:p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5AD17] text-[#172453]" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8"><path d="M20 11.4a7.8 7.8 0 0 1-8 7.6 8.8 8.8 0 0 1-3.5-.7L4 19l1.1-3.2A7.3 7.3 0 0 1 4 11.4a7.8 7.8 0 0 1 8-7.4 7.8 7.8 0 0 1 8 7.4Z" /></svg>
          </div>
          <h2 className="mt-3 text-[18px] font-bold leading-[1.3] sm:text-[20px]">Ada pertanyaan?</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75">Tim kami siap menjawab pertanyaan seputar promo dan program RS Immanuel.</p>
          <span className="mt-4 inline-flex rounded-xl bg-[#E5AD17] px-4 py-2.5 text-sm font-bold text-[#172453] transition group-hover:bg-[#F0BC29]">Chat WhatsApp</span>
        </a>
      </section>

      {/* PROMO DETAIL MODAL */}
      {selectedPromo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 p-3 sm:p-5" onClick={() => setSelectedPromo(null)}>
          <article className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <header className="relative h-[220px] shrink-0 overflow-hidden bg-slate-300 sm:h-[280px]">
              {getImageUrl(selectedPromo.image_url) && <img src={getImageUrl(selectedPromo.image_url)} alt={selectedPromo.title} className="absolute inset-0 h-full w-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <button type="button" onClick={() => setSelectedPromo(null)} aria-label="Tutup detail promo" className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white transition hover:bg-black/80">×</button>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#F8E39A] px-3 py-1 text-xs font-bold text-[#172453]">{selectedPromo.category}</span>
                  {selectedPromo.expired_at && <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">Berakhir {formatDate(selectedPromo.expired_at)}</span>}
                </div>
                <h2 className="text-[24px] font-extrabold leading-[1.15] sm:text-[32px]">{selectedPromo.title}</h2>
              </div>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
              {selectedPromo.description && <p className="mb-5 text-sm leading-relaxed text-slate-600 sm:text-base">{selectedPromo.description}</p>}
              {selectedPromo.detail_description && formatDetailDescription(selectedPromo.detail_description)}
            </div>
            {selectedPromo.whatsapp_url && (
              <footer className="shrink-0 border-t border-slate-200 bg-white p-4 sm:p-5">
                <a href={selectedPromo.whatsapp_url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[#1B2C78] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#142153]">Tanya dan ambil promo via WhatsApp</a>
              </footer>
            )}
          </article>
        </div>
      )}
    </main>
  );
}
