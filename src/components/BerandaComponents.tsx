"use client";

import { useRouter, usePathname } from "next/navigation";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";

export default function BerandaComponents() {

    const router = useRouter();
    const pathname = usePathname();
    const { lang } = useLang();
    const t = lang === "ID" ? ID : EN;

    const handleClick = () => {
      if (pathname === "/") {
        // Sudah di halaman beranda → scroll halus ke atas
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Pindah ke beranda dulu
        router.push("/");

        // Tunggu sedikit agar halaman berpindah, lalu scroll halus
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 200);
      }
    };

  return (
    <>
      {/* WA kecil di pojok */}
        <span
          onClick={handleClick}
          className="text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-[14px] font-inter drop-shadow-md cursor-pointer inline-block transition-opacity duration-200 hover:text-white hover:opacity-65">
          {t.beranda}
        </span>
    </>
  );
}
