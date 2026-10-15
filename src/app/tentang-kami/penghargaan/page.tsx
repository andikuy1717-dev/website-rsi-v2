"use client";

import { useEffect, useState } from "react";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { getAwards, AwardItem } from "@/services/AwardService";

function AwardTimelineItem({
  item,
  index,
}: {
  item: AwardItem;
  index: number;
}) {
  const anim = useFadeInOnScroll();
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={anim.ref}
      className={`relative flex flex-col items-center md:flex-row ${
        isLeft ? "md:justify-start" : "md:justify-end"
      }`}
    >
      {/* DOT */}
      <div className="absolute left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-white bg-[#d6ad52]" />

      {/* CARD */}
      <div
        className={`w-full overflow-hidden rounded-2xl border border-slate-300 bg-white p-8 shadow-sm transition-all duration-700 md:w-[45%] ${
          anim.isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        } ${isLeft ? "md:mr-auto" : "md:ml-auto"}`}
      >
        <span className="text-lg font-bold text-blue-600">{item.year}</span>

        <h3 className="mb-4 mt-2 text-xl font-semibold text-slate-800">
          {item.title}
        </h3>

        <p className="leading-relaxed text-slate-600">{item.description}</p>
      </div>
    </div>
  );
}

export default function PenghargaanPage() {
  const header = useFadeInOnScroll();
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);

        const result = await getAwards();

        if (result.success && Array.isArray(result.data)) {
          const sortedAwards = [...result.data].sort(
            (a, b) => a.order - b.order
          );

          setAwards(sortedAwards);
        } else {
          setAwards([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data penghargaan:", error);
        setAwards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  return (
    <section className="min-h-screen px-6 md:px-20">
      {/* HEADER */}
      <div
        ref={header.ref}
        className={`mx-auto mb-24 max-w-3xl text-center transition-all duration-700 ${
          header.isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h1 className="mb-6 text-4xl font-extrabold text-slate-800 md:text-5xl">
          {t.penghargaan}
        </h1>

        <p className="text-lg text-slate-600">{t.kalimatPenghargaan}</p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#21368B]" />
        </div>
      )}

      {/* EMPTY */}
      {!loading && awards.length === 0 && (
        <div className="py-16 text-center text-slate-500">
          Belum ada data penghargaan.
        </div>
      )}

      {/* TIMELINE */}
      {!loading && awards.length > 0 && (
        <div className="relative mx-auto max-w-5xl">
          {/* PIPA VERTIKAL */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-400" />

          <div className="space-y-20">
            {awards.map((item, index) => (
              <AwardTimelineItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}