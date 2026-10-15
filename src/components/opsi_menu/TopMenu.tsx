"use client";

import { FiChevronDown, FiMenu, FiCalendar } from "react-icons/fi";
import HamburgerMenu from "./HamburgerMenu";
import { useState } from "react";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";
import { usePathname, useRouter } from "next/navigation";
import { startLoading } from "@/utils/LoadingManager";
import Swal from "sweetalert2";

export default function TopMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
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
      confirmButtonColor: "#1B2A78",
    });
  };

  const handleBuatJanji = () => {
    startLoading();
    router.push("/cari-dokter");
  };

  return (
    <>
      {/* NAVBAR WRAPPER */}
      <div className="sticky top-[1.1rem] sm:top-[1.2rem] md:top-[1.5rem] lg:top-[1.75rem] xl:top-[1.85rem] left-0 w-full bg-white shadow-sm border-b border-[#E3E6EF] z-25 transition-all font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* CONTAINER UKURAN IDEAL (min-h-[68px] md:min-h-[70px] DENGAN py-2.5) */}
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-2.5 sm:px-8 md:px-12 lg:px-16 xl:px-20 min-h-[66px] md:min-h-[70px]">
          
          {/* KIRI: LOGO RSI & BRANDING */}
          <div 
            onClick={() => router.push("/")}
            className="flex items-center gap-3.5 cursor-pointer select-none group"
          >
            <img 
              src="/Logo RSI.png" 
              alt="Logo RS Immanuel" 
              className="h-10 sm:h-10.5 md:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col justify-center">
              <span className="font-bold text-[#111C52] text-[18px] sm:text-[19px] leading-tight tracking-tight">
                RS Immanuel
              </span>
              <span className="text-[#545B75] text-[11px] sm:text-[12px] font-medium leading-tight mt-0.5">
                Bandung
              </span>
            </div>
          </div>

          {/* KANAN: NAV MENU + TOMBOL BUAT JANJI TEMU (DESKTOP) */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-8">
            <nav className="flex items-center gap-6 xl:gap-8 text-[15px] xl:text-[16px]">
              <MenuItem 
                label={t.cariDokter} 
                disabled={isCariDokter} 
                onClick={() => {
                  if (isCariDokter) return;
                  startLoading();
                  router.push("/cari-dokter");
                }} 
              />

              <MenuItem 
                label={t.layananKesehatan} 
                onClick={showDevelopmentAlert} 
              />

              <MenuItem 
                label={t.pusatInformasi} 
                onClick={() => {
                  window.open("https://diklat.rsimmanuel.com", "_blank", "noopener,noreferrer");
                }} 
              />

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

            {/* TOMBOL "BUAT JANJI TEMU" */}
            <button
              onClick={handleBuatJanji}
              className="flex items-center gap-2 bg-[#1B2A78] hover:bg-[#111C52] active:scale-95 text-white px-5 py-2.5 rounded-xl font-semibold text-[14px] xl:text-[15px] shadow-sm transition-all duration-200 cursor-pointer"
            >
              <FiCalendar size={18} className="shrink-0" />
              <span>{lang === "ID" ? "Buat Janji Temu" : "Book Appointment"}</span>
            </button>
          </div>

          {/* HAMBURGER MENU (< lg) */}
          <div className="flex lg:hidden items-center gap-2">
            <button 
              className="text-[#1B2A78] hover:text-[#111C52] p-2 rounded-lg hover:bg-[#F3F5FB] transition cursor-pointer"
              onClick={() => setMenuOpen(true)}
              aria-label="Buka Menu"
            >
              <FiMenu size={24} />
            </button>
          </div>

        </div>
      </div>

      {/* HAMBURGER MENU DRAWER */}
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
      <div
        onClick={() => {
          if (disabled) return;
          if (dropdown) {
            setOpen(true);
            setHasEnteredDropdown(false);
          } else {
            onClick?.();
          }
        }}
        className={`
          flex items-center gap-1.5 transition-colors duration-150 outline-none
          ${disabled
            ? "cursor-default text-[#1B2A78] font-bold"
            : "cursor-pointer text-[#141A33] hover:text-[#1B2A78] font-semibold"}
        `}
      >
        <span>{label}</span>
        {dropdown && <FiChevronDown className="text-[#545B75]" size={16} />}
      </div>

      {/* DROPDOWN MENU */}
      {dropdown && open && (
        <div
          className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl border border-[#E3E6EF] w-64 z-50 overflow-hidden"
          onMouseEnter={() => setHasEnteredDropdown(true)}
          onMouseLeave={() => {
            if (hasEnteredDropdown) {
              setOpen(false);
            }
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}