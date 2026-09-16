"use client";

import { FiChevronDown, FiSearch, FiMenu } from "react-icons/fi";
import HamburgerMenu from "./HamburgerMenu";
import { useState, useEffect, useRef } from "react";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";
import { usePathname, useRouter } from "next/navigation";
import { startLoading } from "@/utils/LoadingManager";
import Swal from "sweetalert2";

export default function TopMenu({ bannerHeight }: { bannerHeight: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter(); // ⬅️ TAMBAH INI
  const pathname = usePathname();

  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const isCariDokter = pathname === "/cari-dokter";
  const isPromo = pathname === "/promo";

  const showDevelopmentAlert = () => {
    Swal.fire({
      icon: "info",
      text: "Menu ini sedang dalam tahap pengembangan",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#21368B",
    });
  };

  return (
    <>
    <div className="sticky top-[calc(1.2rem+var(--banner-height))] sm:top-[calc(1.3rem+var(--banner-height))] md:top-[calc(1.7rem+var(--banner-height))] lg:top-[calc(2rem+var(--banner-height))] xl:top-[calc(2.3rem+var(--banner-height))] left-0 w-full bg-white shadow z-20" style={{ ["--banner-height" as any]: `${bannerHeight}px` }}>
      <div className="mx-auto w-full flex items-center justify-between px-6 sm:px-8 md:px-12 lg:px-16 xl:px-18 max-w-8xl h-10 sm:h-12 md:h-14 lg:h-16">        
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
            <MenuItem label={t.layananKesehatan} onClick={showDevelopmentAlert} />

            <MenuItem label={t.pusatInformasi}   onClick={() => {
              window.open("https://diklat.rsimmanuel.com", "_blank", "noopener,noreferrer");
            }} />

            {/* PROMO */}
            <MenuItem
              label="Promo"
              disabled={isPromo}
              onClick={() => {
                if (isPromo) return;

                startLoading();
                router.push("/promo");
              }}
            />
            
          </nav>

          {/* HAMBURGER — tampil ≤ sm */}
          <button className="flex md:hidden text-blue-700 hover:text-blue-600 cursor-pointer" onClick={() => setMenuOpen(true)}>
            <FiMenu size={26} />
          </button>

          </div>
        </div>

      </div>

     {/* HAMBURGER MENU */}
      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MenuItem({
  label,
  dropdown = false,
  onClick,
  disabled = false,
  children,
}: {
  label: string;
  dropdown?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [hasEnteredDropdown, setHasEnteredDropdown] = useState(false);

  return (
    <div className="relative">
      {/* BUTTON */}
      <div
        onClick={() => {
          if (disabled) return;

          if (dropdown) {
            setOpen(true);
            setHasEnteredDropdown(false); // reset tiap buka
          } else {
            onClick?.();
          }
        }}
        className={`
          flex items-center gap-1 transition outline-none
          ${disabled
            ? "cursor-default text-blue-500"
            : "cursor-pointer hover:text-blue-500 text-gray-700"}
        `}
      >
        <span>{label}</span>
        {dropdown && <FiChevronDown className="text-blue-500" size={16} />}
      </div>

      {/* DROPDOWN */}
      {dropdown && open && (
        <div
          className="absolute top-full md:mt-4 lg:mt-5 xl:mt-5 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg border border-gray-300 w-64 z-50 overflow-hidden"
          onMouseEnter={() => setHasEnteredDropdown(true)} // ✅ cursor masuk list
          onMouseLeave={() => {
            if (hasEnteredDropdown) {
              setOpen(false); // ✅ baru boleh close
            }
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}