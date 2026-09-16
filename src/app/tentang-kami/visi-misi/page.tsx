"use client";

import { useEffect, useState } from "react";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import {
  getVisionMission,
  VisionMissionItem,
} from "@/services/VisionMissionService";

export default function VisiMisiPage() {
  const visi = useFadeInOnScroll();
  const misi = useFadeInOnScroll();

  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const [vision, setVision] = useState<VisionMissionItem[]>([]);
  const [missions, setMissions] = useState<VisionMissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisionMission = async () => {
      try {
        setLoading(true);

        const result = await getVisionMission();

        if (result.success && result.data) {
          const sortedVision = [...(result.data.vision || [])].sort(
            (a, b) => a.order - b.order
          );

          const sortedMissions = [...(result.data.missions || [])].sort(
            (a, b) => a.order - b.order
          );

          setVision(sortedVision);
          setMissions(sortedMissions);
        } else {
          setVision([]);
          setMissions([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data visi dan misi:", error);
        setVision([]);
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVisionMission();
  }, []);

  return (
    <section className="min-h-screen px-6 py-1 md:px-20">
      {loading && (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#21368B]" />
        </div>
      )}

      {!loading && (
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-2">
          {/* BORDER TENGAH — DESKTOP */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-slate-400 md:block" />

          {/* VISI */}
          <div
            ref={visi.ref}
            className={`text-center transition-all duration-700 ease-out ${
            visi.isVisible || !loading
                ? "translate-x-0 opacity-100"
                : "-translate-x-16 opacity-0"
            }`}
          >
            <h2 className="mb-6 text-4xl font-extrabold text-slate-800 md:text-5xl">
              {t.visi.title}
            </h2>

            <div className="mx-auto mb-10 h-1 w-16 rounded-full bg-blue-600" />

            {vision.length > 0 ? (
              <div className="space-y-5">
                {vision.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-300 bg-white p-7 shadow-sm"
                  >
                    <p className="text-lg leading-relaxed text-slate-700 md:text-xl">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Belum ada data visi.</p>
            )}
          </div>

          {/* MISI */}
          <div
            ref={misi.ref}
            className={`text-center transition-all delay-150 duration-700 ease-out md:text-left ${
            misi.isVisible || !loading
                ? "translate-x-0 opacity-100"
                : "translate-x-16 opacity-0"
            }`}
          >
            <h2 className="mb-6 text-center text-4xl font-extrabold text-slate-800 md:text-5xl">
              {t.misi.title}
            </h2>

            <div className="mx-auto mb-10 h-1 w-16 rounded-full bg-blue-600" />

            {missions.length > 0 ? (
              <div className="space-y-6">
                {missions.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 rounded-xl border border-slate-300 bg-white p-6 text-left transition hover:shadow-md"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                      {index + 1}
                    </div>

                    <p className="leading-relaxed text-slate-600">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 md:text-left">
                Belum ada data misi.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}