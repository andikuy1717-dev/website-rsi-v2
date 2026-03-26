"use client";

import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";

export default function VisiMisiPage() {
  const visi = useFadeInOnScroll();
  const misi = useFadeInOnScroll();

  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const misiList = t.misi.list;

  return (
    <section className="min-h-screen px-6 md:px-20 py-1">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative">

        {/* BORDER TENGAH (desktop only) */}
        <div className="hidden md:block absolute left-1/2 top-0 h-full w-px bg-slate-400" />

        {/* ================= VISI ================= */}
        <div
            ref={visi.ref}
            className={`transition-all duration-700 ease-out text-center
                ${visi.isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-16"
                }
            `}
            >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">
                {t.visi.title}
            </h2>

            <div className="w-16 h-1 bg-blue-600 mx-auto mb-10 rounded-full" />

            <h3 className="text-2xl md:text-3xl font-semibold leading-snug text-slate-800 mb-6">
                {t.visi.headline}
                <br />
                <span className="text-blue-600">{t.visi.highlight}</span>
            </h3>

            <p className="text-slate-600">
                {t.visi.description.before}
            <span className="font-semibold text-slate-800">
                {t.visi.description.bold}
            </span>
                {t.visi.description.after}
            </p>
            
        </div>


        {/* ================= MISI ================= */}
        <div
            ref={misi.ref}
            className={`transition-all duration-700 ease-out delay-150 text-center md:text-left
                ${misi.isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-16"
                }
            `}
            >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 text-center">
                {t.misi.title}
            </h2>

            <div className="w-16 h-1 bg-blue-600 mx-auto mb-10 rounded-full" />

            <div className="space-y-6">
                {misiList.map((item, index) => (
                <div
                    key={index}
                    className="flex gap-4 items-start p-6 rounded-xl border border-slate-300 bg-white hover:shadow-md transition text-left"
                >
                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold shrink-0">
                    {index + 1}
                    </div>

                    <p className="text-slate-600 leading-relaxed">
                    {item}
                    </p>
                </div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
}
