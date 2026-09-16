"use client";

import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";
import { usePathname, useRouter } from "next/navigation";
import { startLoading } from "@/utils/LoadingManager";

export default function EdukasiKesehatanComponents() {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const isActive = pathname.startsWith("/edukasi-kesehatan");

  const handleClick = () => {
    if (isActive) {
      // Sudah di halaman edukasi kesehatan → scroll ke atas
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    startLoading(); // 🔥 NYALAIN TOP PROGRESS BAR

    router.push("/edukasi-kesehatan");

    // Tunggu halaman berpindah, lalu scroll ke atas
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };

  return (
    <>
      <span
        onClick={handleClick}
        className="text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-[14px] font-inter drop-shadow-md cursor-pointer inline-block transition-opacity duration-200 hover:text-white hover:opacity-65 whitespace-nowrap"
      >
        {t.infoSehat}
      </span>
    </>
  );
}