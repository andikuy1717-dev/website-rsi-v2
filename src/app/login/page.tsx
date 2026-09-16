"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react"; // optional icon (kalau pakai lucide)
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";
import LoginModalController from "@/app/modal-punya-rekammedis/LoginModalController";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const [showLoginModal, setShowLoginModal] = useState(false);

  const showDevelopmentAlert = () => {
    Swal.fire({
      icon: "info",
      text: "Menu ini sedang dalam tahap pengembangan",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#21368B",
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-3">
      
      {/* 🔥 KIRI - GAMBAR (LEBIH LEBAR) */}
      <div
        className="hidden md:block md:col-span-2 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/bg_login.jpeg')" }}
      >
        {/* overlay optional */}
        <div className="w-full h-full bg-black/5" />
      </div>

      {/* 🔥 KANAN - FORM LOGIN */}
      <div className="flex items-center justify-center bg-gray-200 px-4 sm:px-6">
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">

            {/* ❌ CLOSE BUTTON */}
          <button
            onClick={() => router.back()}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-600 hover:text-black transition cursor-pointer"
            aria-label="Close"
          >
            {/* Kalau gak mau lucide, ganti dengan ✕ */}
            <X size={24} />
            {/* ✕ */}
          </button>

          {/* LOGO & WELCOME TEXT */}
          <div className="flex flex-col items-center mb-4">
            <img
              src="/Logo RSI.png"
              alt="Logo RSI"
              className="h-14 sm:h-20 w-auto mb-3"
            />

            <p className="md:text-[12px] lg:text-[13px] xl:text-[14px] text-gray-500 text-center">
              {t.selamatDatangRSI}
            </p>
          </div>

           {/* QUESTION */}
          <h1 className="text-base md:text-[14px] lg:text-[16px] xl:text-[18px] text-center text-black mb-5 sm:mb-6">
            {t.punyaRM}
          </h1>

          {/* OPTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">

            {/* SUDAH PUNYA */}
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex flex-col items-center justify-center border rounded-xl p-4 hover:bg-blue-50 hover:border-blue-600 transition cursor-pointer"
            >
              <img
                src="/sudah_punya_rm.png"
                alt="Sudah Punya RM"
                className="h-12 sm:h-14 md:h-12 lg:h-14 xl:h-16 mb-2"
              />
              <span className="text-xs md:text-[12px] lg:text-[13px] xl:text-[14px] font-medium text-black text-center">
                {t.sudahMemiliki}
              </span>
            </button>
            {showLoginModal && (
              <LoginModalController
                onClose={() => setShowLoginModal(false)}
              />
            )}

            {/* BELUM PUNYA */}
            <button
              onClick={showDevelopmentAlert}
              className="flex flex-col items-center justify-center border rounded-xl p-4 hover:bg-blue-50 hover:border-blue-600 transition cursor-pointer"
            >
              <img
                src="/tidak_punya_rm.png"
                alt="Belum Punya RM"
                className="h-12 sm:h-14 md:h-12 lg:h-14 xl:h-16 mb-2"
              />
              <span className="text-xs md:text-[12px] lg:text-[13px] xl:text-[14px] font-medium text-black text-center">
                {t.belumMemiliki}
              </span>
            </button>

          </div>

          {/* FOOT QUESTION */}
          <p className="text-xs lg:text-[12px] xl:text-[14px] text-center text-gray-600">
            {t.belumPunyaAkun}{" "}
            <button
              onClick={showDevelopmentAlert}
              className="text-blue-800 font-semibold hover:underline"
            >
              {t.daftarSekarang}
            </button>
          </p>

        </div>
      </div>

    </div>
  );
}
