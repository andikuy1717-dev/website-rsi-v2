"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll"; // pastikan path sesuai

export default function GeografisPage() {
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  // ===== Hook fade in =====
  const judullokasi = useFadeInOnScroll(true);
  
  return (
    <div ref={judullokasi.ref} className={`flex flex-col items-center justify-start px-4 md:px-10 min-h-screen transform transition-all duration-700 ${ judullokasi.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <h1 className="text-center text-2xl font-bold my-4 text-black">
       {t.asuransiRSI}
      </h1>

    </div>
  );
}
