"use client";

//import { useState } from "react";

import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";

export default function HubungiKamiComponents() {

   const { lang } = useLang();
   const t = lang === "ID" ? ID : EN;

  return (
    <>
      {/* WA kecil di pojok */}
        <div className="flex items-center gap-1 cursor-pointer transform transition duration-300 ease-in-out hover:scale-110 hover:rotate-0">
        <img
          src="/hubungi_kami.png"
          alt="HubungiKami"
          className="max-sm:w-3 max-sm:h-3 sm:w-3 sm:h-3 md:w-3 md:h-3 lg:w-4 lg:h-4 align-middle"/>

        <span
           className="whitespace-nowrap text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-[14px] font-inter drop-shadow-md">
          {t.hubungiKami} (022) 520 1656
        </span>
      </div>
    </>
  );
}
