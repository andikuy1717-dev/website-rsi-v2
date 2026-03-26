"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll"; // pastikan path sesuai

export default function KataPengantarPage() {
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  // ===== Hook fade in =====
  const judulAnim = useFadeInOnScroll(true);
  const direksiAnim = useFadeInOnScroll(true);

  return (
    <div className="max-w-6xl mx-auto">

      {/* ================= JUDUL ================= */}
      <div ref={judulAnim.ref} className={`text-center mb-10 transform transition-all duration-700 ${ judulAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h1 className="text-[18px] sm:text-[22px] md:text-[28px] font-semibold text-gray-700">
          {t.jajaranDireksi}
        </h1>
        <p className="mt-2 text-gray-600 text-base md:text-lg">
          2023 – 2027
        </p>
      </div>

      {/* ================= FOTO DIREKSI ================= */}
      <div ref={direksiAnim.ref} className={`grid grid-cols-1 md:grid-cols-3 gap-30 mb-14 text-center transform transition-all duration-700 ${ direksiAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

        {/* DIREKTUR UTAMA */}
        <div className="flex flex-col items-center">
          <div className="w-56 h-72 md:w-48 md:h-72 lg:w-56 lg:h-72 relative rounded-xl overflow-hidden shadow-lg border-2 border-gray-400 bg-linear-to-tr from-gray-400 via-gray-500 to-gray-600">
            <Image
              src="/direktur_dummy.webp"
              alt="Direktur Utama"
              fill
              className="object-cover"
            />
          </div>

        {/* Nameplate */}
        <div className="relative mt-4 w-full px-6 py-3 text-center bg-linear-to-r from-gray-300 via-gray-400 to-gray-500 shadow-lg overflow-hidden">
            {/* potongan sudut */}
            <span className="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full" />
            <span className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full" />
            <span className="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full" />
            <span className="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full" />

            <p className="md:text-[11px] lg:text-[13px] xl:text-[14px] font-extrabold text-black tracking-wide">
                dr. Danurrendra, Sp.B
            </p>
            <p className="md:text-[10px] lg:text-[12px] font-medium text-gray-800">
                {t.direkturUtama}
            </p>
        </div>

        </div>

        {/* DIREKTUR PELAYANAN */}
        <div className="flex flex-col items-center">
          <div className="w-56 h-72 md:w-48 md:h-72 lg:w-56 lg:h-72 relative rounded-xl overflow-hidden shadow-lg border-2 border-gray-400 bg-linear-to-tr from-gray-400 via-gray-500 to-gray-600">
            <Image
              src="/direktur_pelayanan_dummy.jfif"
              alt="Direktur Pelayanan"
              fill
              className="object-cover"
            />
          </div>

        {/* Nameplate */}
        <div className="relative mt-4 w-full px-6 py-3 text-center bg-linear-to-r from-gray-300 via-gray-400 to-gray-500 shadow-lg overflow-hidden">
            {/* potongan sudut */}
            <span className="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full" />
            <span className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full" />
            <span className="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full" />
            <span className="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full" />

            <p className="md:text-[11px] lg:text-[13px] xl:text-[14px] font-extrabold text-black tracking-wide">
                dr. Andri Octavallen, Sp.EM., FICEP., AIFO-K
            </p>
            <p className="md:text-[10px] lg:text-[12px] font-medium text-gray-800">
                {t.direkturPelayanan}
            </p>
        </div>

        </div>

        {/* DIREKTUR ADMINISTRASI */}
        <div className="flex flex-col items-center">
          <div className="w-56 h-72 md:w-48 md:h-72 lg:w-56 lg:h-72 relative rounded-xl overflow-hidden shadow-lg border-2 border-gray-400 bg-linear-to-tr from-gray-400 via-gray-500 to-gray-600">
            <Image
              src="/direktur_umum_dummy.jfif"
              alt="Direktur Administrasi, Umum dan Keuangan"
              fill
              className="object-cover"
            />
          </div>
        {/* Nameplate */}
        <div className="relative mt-4 w-full px-6 py-3 text-center bg-linear-to-r from-gray-300 via-gray-400 to-gray-500 shadow-lg overflow-hidden">
            {/* potongan sudut */}
            <span className="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full" />
            <span className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full" />
            <span className="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full" />
            <span className="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full" />

            <p className="md:text-[11px] lg:text-[13px] xl:text-[14px] font-extrabold text-gray-900 tracking-wide">
                Wendy Herliandy, SE 	
            </p>
            <p className="md:text-[10px] lg:text-[12px] font-medium text-gray-800">
               {t.direkturUmum}
            </p>
        </div>

        </div>

      </div>

    {/* ================= KATA PENGANTAR ================= */}
     <div
        className="bg-white rounded-xl shadow-sm border border-gray-400 p-6 md:p-10">
        <h2 className="text-[30px] font-bold text-gray-900 mb-6 text-center">
          {t.kataPengantar}
        </h2>

        <div className="space-y-5 text-gray-700 leading-relaxed text-justify xl:text-[16px]" dangerouslySetInnerHTML={{ __html: t.kataPengantarText }}>
       
        </div>
      </div>
    </div>
    
  );
}
