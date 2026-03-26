"use client";

import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";

export default function HeroSection() {
  const { lang } = useLang();
  const t = lang === "EN" ? EN : ID;

  return (
      <div className="w-full flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-6">

        {/* LEFT CONTENT */}
        <div className="flex-1 pl-4 sm:pl-6 md:pl-0 pr-2 sm:pr-2 w-full max-w-[630px] sm:max-w-[750px]">
          <h3 className="text-gray-400 text-[14px] sm:text-[14px] md:text-[14px] lg:text-[18px] xl:text-[20px] mb-2 font-extralight">{t.selamatDatang}</h3>

          <h1 className="text-[20px] sm:text-[20px] md:text-[25px] lg:text-[35px] xl:text-[45px] font-semibold leading-[1.15] text-gray-700 mb-6 tracking-wide antialiased">
            {t.heroTitle1} <br />{t.heroTitle2}
          </h1>

          {/* SEARCH MODULE */}
          <div className="bg-white shadow-xl p-6 rounded-2xl border border-gray-300 max-w-full md:max-w-[350px] lg:max-w-[450px] xl:max-w-[530px]">
            

            {/* FILTER TABS */}
            <div className="flex items-center mb-4 gap-2 sm:gap-4 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-4">
              <p className="text-gray-400 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px] xl:text-[16px] font-medium ">{t.temukan}</p>
              <button className="px-4 py-2 bg-blue-500 text-white text-[10px] sm:text-[12px] md:text-[10px] lg:text-[12px] xl:text-[14px] font-semibold rounded-full shadow-sm">
                {t.semua}
              </button>
              <button className="px-4 py-2 border border-blue-600 text-blue-600 text-[10px] sm:text-[12px] md:text-[10px] lg:text-[12px] xl:text-[14px] font-semibold rounded-full hover:bg-blue-50">
                {t.dokter}
              </button>
              <button className="px-4 py-2 border border-blue-600 text-blue-600 text-[10px] sm:text-[12px] md:text-[10px] lg:text-[12px] xl:text-[14px] font-semibold rounded-full hover:bg-blue-50">
                {t.lokasi}
              </button>
            </div>

            {/* INPUT SEARCH */}
            <input
              type="text"
              placeholder={t.ketikKataKunci}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 sm:py-2 md:py-2 lg:py-2 xl:py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex">
          <img
            src="/dokteran.jfif"
            alt="Hero"
            className="w-[750px] h-[250px] md:w-[330px] md:h-[248px] lg:w-[480px] lg:h-[280px] xl:w-[660px] xl:h-[315px]"
          />
        </div>
      </div>
  );
}
