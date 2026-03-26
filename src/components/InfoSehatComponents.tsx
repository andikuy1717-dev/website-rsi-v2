"use client";

//import { useState } from "react";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";

export default function InfoSehatComponents() {

  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  return (
    <>
        <span
           className="text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-[14px] font-inter drop-shadow-md cursor-pointer inline-block transition-opacity duration-200 hover:text-white hover:opacity-65 whitespace-nowrap">
        {t.infoSehat}
        </span>
    </>
  );
}
