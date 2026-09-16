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
        </div>
      </div>
  );
}
