"use client";

//import { useState } from "react";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";
import { usePathname, useRouter } from "next/navigation";
import { startLoading} from "@/utils/LoadingManager";

export default function TentangKamiComponents() {
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const router = useRouter();
  const pathname = usePathname() ?? "";

  const isActive = pathname.startsWith("/tentang-kami");

  const handleClick = () => {
    if (isActive) return; // ⛔ jangan reload halaman yang sama
    startLoading();       // 🔥 NYALAIN TOP PROGRESS BAR
    router.push("/tentang-kami");
  };
  
  return (
    <>
        <span onClick={handleClick}
           className="whitespace-nowrap text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-[14px] font-inter drop-shadow-md cursor-pointer inline-block transition-opacity duration-200 hover:text-white hover:opacity-65">
          {t.tentangKami}
        </span>
    </>
  );
}
