"use client";

import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useRouter, usePathname } from "next/navigation";
import { startLoading } from "@/utils/LoadingManager";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import Swal from "sweetalert2";

export default function SixMainButtons() {
  const { lang } = useLang();
  const t = lang === "EN" ? EN : ID;
  const router = useRouter();
  const pathname = usePathname();
  const isCariDokter = pathname === "/cari-dokter";
  const [searchQuery, setSearchQuery] = useState("");

  const showDevelopmentAlert = () => {
    Swal.fire({
      icon: "info",
      text: "Menu ini sedang dalam tahap pengembangan",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#1B2A78",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    startLoading();
    router.push(`/cari-dokter?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="w-full bg-white rounded-2xl lg:rounded-3xl border border-[#E3E6EF] shadow-[0_10px_35px_rgba(20,26,51,0.06)] p-4 sm:p-5 lg:p-6 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 lg:gap-8">
        
        {/* SISI KIRI: INPUT PENCARIAN DOKTER */}
        <div className="w-full lg:max-w-[380px] shrink-0">
          <label className="block text-[13px] font-bold text-[#141A33] mb-2">
            Cari dokter atau spesialisasi
          </label>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center border border-[#D5DAEA] rounded-xl px-3.5 py-2.5 bg-white focus-within:border-[#1B2A78] transition-colors">
              <FiSearch size={18} className="text-[#545B75] shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Contoh: dokter anak, THT..."
                className="w-full text-[13px] sm:text-[14px] text-[#141A33] placeholder-[#545B75]/70 outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-[#1B2A78] hover:bg-[#111C52] active:scale-95 text-white px-5 py-2.5 rounded-xl font-semibold text-[13px] sm:text-[14px] transition-all cursor-pointer shrink-0"
            >
              Cari
            </button>
          </form>
        </div>

        {/* PEMBATAS VERTIKAL (DESKTOP) */}
        <div className="hidden lg:block w-[1px] bg-[#E3E6EF] h-16 self-center" />

        {/* SISI KANAN: 5 TILE MENU KOTAK */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 flex-1">
          
          {/* TILE 1: CARI DOKTER */}
          <TileButton
            label={t.cariDokter || "Cari Dokter"}
            disabled={isCariDokter}
            onClick={() => {
              if (isCariDokter) return;
              startLoading();
              router.push("/cari-dokter");
            }}
            icon={
              <svg className="w-5 h-5 text-[#1B2A78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 4.5v5.25a7.5 7.5 0 0015 0V4.5M9 4.5h6m-7.5 9A4.5 4.5 0 0012 18m0 0a4.5 4.5 0 004.5-4.5M12 18v3m-3 0h6" />
              </svg>
            }
          />

          {/* TILE 2: LAYANAN UNGGULAN */}
          <TileButton
            label={t.layananUnggulan || "Layanan Unggulan"}
            onClick={showDevelopmentAlert}
            icon={
              <svg className="w-5 h-5 text-[#1B2A78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          {/* TILE 3: REHABILITASI MEDIS */}
          <TileButton
            label="Rehabilitasi Medis"
            onClick={showDevelopmentAlert}
            icon={
              <svg className="w-5 h-5 text-[#1B2A78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h4l3 8 4-16 3 8h4" />
              </svg>
            }
          />

          {/* TILE 4: HASIL LAB */}
          <TileButton
            label={t.hasilLabBeranda || "Hasil Lab"}
            onClick={() => {
              const token = localStorage.getItem("token");
              if (!token) {
                router.push("/login");
                return;
              }
              router.push("/akun/hasil-lab");
            }}
            icon={
              <svg className="w-5 h-5 text-[#1B2A78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />

          {/* TILE 5: RADIOLOGI */}
          <TileButton
            label={t.radiologi || "Radiologi"}
            onClick={showDevelopmentAlert}
            icon={
              <svg className="w-5 h-5 text-[#1B2A78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm9 4v4m-2-2h4" />
              </svg>
            }
          />

        </div>

      </div>
    </div>
  );
}

function TileButton({
  label,
  icon,
  onClick,
  disabled = false,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 group cursor-pointer
        bg-[#F3F5FB] hover:bg-[#EAEEFB] border border-transparent hover:border-[#D5DAEA] active:scale-95
        ${disabled ? "opacity-60 cursor-default" : ""}
      `}
    >
      {/* KOTAK IKON PUTIH DENGAN BAYANGAN RINGAN */}
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
        {icon}
      </div>
      <span className="text-[12px] sm:text-[13px] font-semibold text-[#141A33] group-hover:text-[#1B2A78] mt-2 text-center leading-tight transition-colors">
        {label}
      </span>
    </button>
  );
}