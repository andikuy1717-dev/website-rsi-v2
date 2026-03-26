"use client";

import Image from "next/image";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";

export default function FilosofiLogoPage() {
  const content = useFadeInOnScroll();

  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  return (
    <section className="min-h-screen px-6 md:px-20">
      <div
        ref={content.ref}
        className={`relative w-full max-w-7xl mx-auto
        transition-all duration-700
        ${content.isVisible ? "opacity-100" : "opacity-0 translate-y-10"}
        `}
      >
        {/* GRID UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-10 sm:gap-y-8 md:gap-y-10 lg:gap-y-1 gap-x-12 items-center">

          {/* ATAS – NILAI (HORIZONTAL) */}
            <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
                
                <div>
                <h3 className="font-semibold text-yellow-700">
                    Heman
                </h3>
                <p className="text-slate-600 text-sm">
                   {t.penuhKasihSayang}
                </p>
                </div>

                <div>
                <h3 className="font-semibold text-yellow-700">
                    Geten
                </h3>
                <p className="text-slate-600 text-sm">
                    {t.penuhPerhatian}
                </p>
                </div>

                <div>
                <h3 className="font-semibold text-yellow-700">
                    Kapapancen
                </h3>
                <p className="text-slate-600 text-sm">
                    {t.kepadaKewajiban}
                </p>
                </div>

            </div>
        </div>

          {/* KIRI – MERAH */}
          <div className="text-center lg:text-left space-y-2">
            <h3 className="text-blue-800 font-semibold">Biru</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
                {t.biruArti}
            </p>
          </div>

          {/* TENGAH – LOGO */}
          <div className="flex justify-center">
            <div
              className="
                relative
                w-60 h-60
                sm:w-[300px] sm:h-[300px]
                lg:w-[420px] lg:h-[440px]
              "
            >
              <Image
                src="/Logo RSI(2).png"
                alt="Logo RSI"
                fill
                priority
                sizes="(max-width: 640px) 240px,
                       (max-width: 1024px) 300px,
                       320px"
                className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>

          {/* KANAN – KUNING */}
          <div className="text-center lg:text-right space-y-2">
            <h3 className="text-yellow-600 font-semibold">Kuning</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
                {t.kuningArti}
            </p>
          </div>

          {/* BAWAH – BIRU */}
          <div className="lg:col-span-3 text-center space-y-2">
            <h3 className="text-red-600 font-semibold">Merah</h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
              {t.merahArti}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
