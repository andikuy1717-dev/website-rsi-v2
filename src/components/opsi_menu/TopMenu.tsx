"use client";

import { FiChevronDown, FiSearch, FiMenu } from "react-icons/fi";
import HamburgerMenu from "./HamburgerMenu";
import { useState } from "react";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";
import { usePathname, useRouter } from "next/navigation";
import { startLoading } from "@/utils/LoadingManager";

export default function TopMenu({ bannerHeight }: { bannerHeight: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter(); // ⬅️ TAMBAH INI
  const pathname = usePathname();

  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const isCariDokter = pathname === "/cari-dokter";

  return (
    <>
    <div className="sticky top-[calc(1.2rem+var(--banner-height))] sm:top-[calc(1.3rem+var(--banner-height))] md:top-[calc(1.7rem+var(--banner-height))] lg:top-[calc(2rem+var(--banner-height))] xl:top-[calc(2.3rem+var(--banner-height))] left-0 w-full bg-white shadow z-20" style={{ ["--banner-height" as any]: `${bannerHeight}px` }}>
      <div className="mx-auto flex items-center px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 max-w-8xl h-10 sm:h-12 md:h-14 lg:h-16">        
        {/* LOGO */}
        <div className="flex items-center">
          <img 
            src="/Logo RSI.png" 
            alt="Logo" 
            className="h-9 sm:h-10 md:h-12 lg:h-16 xl:h-16"
          />
        </div>

        {/* KANAN (MENU + SEARCH) */}
        <div className="flex items-center ml-auto gap-8">

          {/* MENU */}
          <nav className="hidden md:flex items-center gap-14 text-gray-700 text-sm xl:text-base">
            <MenuItem label={t.cariDokter} disabled={isCariDokter} onClick={() => {
              if (isCariDokter) return;
              startLoading();
              router.push("/cari-dokter");
            }} />
            <MenuItem label={t.layananKesehatan} dropdown />
            <MenuItem label={t.pusatInformasi} />
          </nav>

          <div className="flex items-center gap-4">

          {/* SEARCH BOX — hilang ≤ sm */}
          <div className="hidden md:flex bg-gray-100 px-4 py-2 rounded-full items-center gap-2 cursor-pointer">
            <span className="text-gray-500 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[14px] xl:text-[16px]">
              {t.cariDisini}
            </span>
            <FiSearch className="text-blue-500" size={18} />
          </div>

          {/* SEARCH ICON — selalu tampil ≤ sm */}
          <div className="flex md:hidden cursor-pointer">
            <FiSearch className="text-blue-500" size={20} />
          </div>

          {/* HAMBURGER — tampil ≤ sm */}
          <button className="flex md:hidden text-blue-700 hover:text-blue-600 cursor-pointer" onClick={() => setMenuOpen(true)}>
            <FiMenu size={26} />
          </button>

          </div>
        </div>

      </div>
    </div>

     {/* HAMBURGER MENU */}
      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MenuItem({ label, dropdown = false,  onClick, disabled = false, }: { label: string; dropdown?: boolean; onClick?: () => void;  disabled?: boolean; }) {
  return (
    <div onClick={!disabled ? onClick : undefined } className={`flex items-center gap-1 transition text-[8px] sm:text-[11px] md:text-[14px] lg:text-[16px] xl:text-[18px]  ${ disabled ? "cursor-default text-blue-500" : "cursor-pointer hover:text-blue-500 text-gray-700" }`}>
      <span>{label}</span>
      {dropdown && <FiChevronDown className="text-blue-500" size={16} />}
    </div>
  );
}
