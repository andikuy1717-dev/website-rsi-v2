"use client";

import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useRouter } from "next/navigation";
import { startLoading } from "@/utils/LoadingManager";
import { FiArrowRight, FiSmartphone } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";
import ListCount from "./ListCount";

export default function HeroSection() {
  const { lang } = useLang();
  const t = lang === "EN" ? EN : ID;
  const router = useRouter();

  const handleBuatJanji = () => {
    startLoading();
    router.push("/cari-dokter");
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/628112187773", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* SISI KIRI: TEKS & STATISTIK */}
      <div className="lg:col-span-7 flex flex-col items-start justify-center">
        
        {/* BADGE: EYEBROW DENGAN TITIK EMAS #E0A91B */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E3E6EF] shadow-xs mb-5">
          <span className="w-2 h-2 rounded-full bg-[#E0A91B] shrink-0" />
          <span className="text-[#1B2A78] text-[12px] sm:text-[13px] font-semibold tracking-tight">
            {t.selamatDatang || "Selamat Datang di Rumah Sakit Immanuel"}
          </span>
        </div>

        {/* H1 HERO: NAVY GELAP #111C52, ExtraBold 800, leading 1.07, tracking -1.5 */}
        <h1 className="text-[#111C52] text-[34px] sm:text-[46px] lg:text-[54px] xl:text-[60px] font-extrabold leading-[1.07] tracking-[-1.5px] mb-5">
          Anda Tetap Sehat <br />
          Adalah Dambaan <br />
          Kami.
        </h1>

        {/* PARAGRAF DESKRIPSI: TEKS SEKUNDER #545B75, 17-18px */}
        <p className="text-[#545B75] text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.6] font-normal max-w-[540px] mb-8">
          Rumah sakit pendidikan di Bandung dengan tenaga medis berpengalaman dan layanan unggulan untuk Anda dan keluarga.
        </p>

        {/* TOMBOL AKSI */}
        <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-10 sm:mb-12">
          {/* TOMBOL UTAMA: PRIMARY NAVY #1B2A78 */}
          <button
            onClick={handleBuatJanji}
            className="flex items-center gap-2.5 bg-[#1B2A78] hover:bg-[#111C52] active:scale-95 text-white px-6 py-3 rounded-xl font-semibold text-[15px] shadow-sm transition-all duration-200 cursor-pointer"
          >
            <span>{lang === "ID" ? "Buat Janji Temu" : "Book Appointment"}</span>
            <FiArrowRight size={17} />
          </button>

          {/* TOMBOL KEDUA: OUTLINE DENGAN GARIS INPUT #D5DAEA */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2.5 bg-white hover:bg-[#F3F5FB] active:scale-95 text-[#141A33] border border-[#D5DAEA] px-6 py-3 rounded-xl font-semibold text-[15px] shadow-sm transition-all duration-200 cursor-pointer"
          >
            <BsChatDots size={17} className="text-[#1B2A78]" />
            <span>Chat WhatsApp</span>
          </button>
        </div>

        {/* LIST STATISTIK COUNT (TERINTEGRASI DI KIRI BAWAH HERO) */}
        <div className="w-full">
          <ListCount />
        </div>

      </div>

      {/* SISI KANAN: FOTO UTAMA & FLOATING CARD IMMA */}
      <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
        
        {/* CONTAINER FOTO UTAMA DENGAN CORAK SOFT / BACKGROUND */}
        <div className="relative w-full max-w-[500px] lg:max-w-none h-[380px] sm:h-[460px] lg:h-[500px] rounded-3xl lg:rounded-[36px] overflow-hidden border border-[#E3E6EF] shadow-sm bg-gradient-to-br from-[#EAEEFB]/60 via-[#F3F5FB] to-[#D5DAEA]/40 flex flex-col items-center justify-center p-6 text-center select-none">
          
          {/* FOTO GEDUNG RSI */}
          <img
            src="/hospital_team.png"
            alt="Gedung Rumah Sakit Immanuel"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay soft supaya foto tetap menyatu dengan desain */}
          <div className="absolute inset-0 bg-[#111C52]/10" />

        </div>

        {/* FLOATING CARD: DAFTAR LEWAT APLIKASI IMMA */}
        <div className="absolute -bottom-6 left-4 sm:left-6 lg:-left-6 bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0_12px_32px_rgba(20,26,51,0.08)] border border-[#E3E6EF] flex items-center gap-3.5 z-10 max-w-[320px] sm:max-w-[340px]">
          
          {/* KOTAK IKON DENGAN EMAS MUDA #F6DE95 */}
          <div className="w-11 h-11 rounded-xl bg-[#F6DE95] text-[#111C52] flex items-center justify-center shrink-0 shadow-xs">
            <FiSmartphone size={22} />
          </div>

          <div className="flex flex-col">
            <h4 className="font-bold text-[#141A33] text-[13px] sm:text-[14px] leading-tight">
              Daftar lewat Aplikasi ImMA
            </h4>
            <p className="text-[#545B75] text-[11px] sm:text-[12px] leading-tight mt-1">
              Buat janji tanpa perlu menunggu lama
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}