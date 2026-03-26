"use client";

import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";

export default function PenghargaanPage() {
  const header = useFadeInOnScroll();
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const penghargaanData = [
  {
    tahun: "2016",
    judul: t.akreditasiParipurna,
    deskripsi:t.deskripsiParipurna
  },
  {
    tahun: "2018",
    judul: t.re_akreditasiParipurna,
    deskripsi: t.deskripsire_Paripurna
  },
  {
    tahun: "2020",
    judul: t.penghargaanJawaBarat,
    deskripsi: t.deskripsiPenghargaanJawaBarat
  },
  {
    tahun: "2021",
    judul: "WSO Angels Awards",
    deskripsi: t.deskripsiWsoAngel
  },
  {
    tahun: "2021",
    judul: t.penghargaanBapeten,
    deskripsi: t.deskripsiPenghargaanBapeten
  }
];

  return (
    <section className="min-h-screen px-6 md:px-20">

      {/* HEADER */}
      <div
        ref={header.ref}
        className={`max-w-3xl mx-auto text-center mb-24 transition-all duration-700
          ${header.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">
          {t.penghargaan}
        </h1>
        <p className="text-lg text-slate-600">
          {t.kalimatPenghargaan}
        </p>
      </div>

      {/* TIMELINE */}
      <div className="relative max-w-5xl mx-auto">

        {/* PIPA VERTIKAL */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-slate-400 -translate-x-1/2" />

        <div className="space-y-20">
          {penghargaanData.map((item, index) => {
            const anim = useFadeInOnScroll();
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                ref={anim.ref}
                className={`relative flex flex-col md:flex-row items-center
                  ${isLeft ? "md:justify-start" : "md:justify-end"}
                `}
              >
                {/* DOT */}
                <div className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-blue-600 border-4 border-white" />

                {/* CARD */}
                <div
                  className={`w-full md:w-[45%] bg-white border border-slate-300 rounded-2xl p-8 shadow-sm overflow-hidden transition-all duration-700
                    ${anim.isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                    }
                    ${isLeft ? "md:mr-auto" : "md:ml-auto"}
                  `}
                >
                  <span className="text-blue-600 font-bold text-lg">
                    {item.tahun}
                  </span>

                  <h3 className="text-xl font-semibold text-slate-800 mt-2 mb-4">
                    {item.judul}
                  </h3>

                  <p className="text-slate-600 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
