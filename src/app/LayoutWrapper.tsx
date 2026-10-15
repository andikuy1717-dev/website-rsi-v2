"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import WhatsAppComponents from "@/components/WhatsAppComponents";
import HubungiKami from "@/components/HubungiKamiComponents";
import AkunLoginUserComponents from "@/components/AkunLoginUserComponents";
import BerandaComponents from "@/components/BerandaComponents";
import TentangKamiComponents from "@/components/TentangKamiComponents";
import EdukasiKesehatanComponents from "@/components/EdukasiKesehatanComponents";
import TopProgressBar from "@/components/TopProgressBar";
import TopMenu from "@/components/opsi_menu/TopMenu";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";
import { useGlobalLoading } from "@/utils/UseGlobalLoading";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { usePathname } from "next/navigation";
import BannerPopup from "@/components/BannerPopUp";
import PaymentSuccessModal from "@/components/PaymentSuccessModal";

const CLOSE_KEY = "poster_closed_at";
const SHOW_DELAY = 30 * 60 * 1000;

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const isLoadingGlobal = useGlobalLoading();
  const hasMounted = useRef(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const { lang } = useLang(); // ⬅ ambil bahasa
  const [showPoster, setShowPoster] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname?.startsWith("/login") ?? false;

  useEffect(() => {
    startLoading(); // 🔥 F5 START
    hasMounted.current = true;
  }, []);

  // 🔥 AUTO STOP LOADING SETIAP ROUTE BERUBAH
  useEffect(() => {
    if (!hasMounted.current) return;
    endLoading();
  }, [pathname]);

  useEffect(() => {
    const closedAt = localStorage.getItem(CLOSE_KEY);

    if (!closedAt) {
      setShowPoster(true);
      return;
    }

    const diff = Date.now() - Number(closedAt);

    if (diff >= SHOW_DELAY) {
      localStorage.removeItem(CLOSE_KEY);
      setShowPoster(true);
    } else {
      setShowPoster(false);

      const timeout = setTimeout(() => {
        setShowPoster(true);
        localStorage.removeItem(CLOSE_KEY);
      }, SHOW_DELAY - diff);

      return () => clearTimeout(timeout);
    }
  }, []);

  // ⬅⬅⬅🔥 UPDATE TITLE OTOMATIS DI SINI
  useEffect(() => {
    document.title =
      lang === "EN" ? "Immanuel Hospital" : "Rumah Sakit Immanuel";
  }, [lang]);

  return (
      <>
      {/* 🔥 LOGIN PAGE FULLSCREEN (BYPASS SEMUA LAYOUT) */}
        {isLoginPage ? (
          <>
            {/* optional: loading */}
            {isLoadingGlobal && (
              <div className="fixed inset-0 bg-white z-9999" />
            )}

            {children}
          </>
        ) : (
          <>

        {/* 🔥 TOP LOADING BAR */}
        <TopProgressBar />
        <BannerPopup />

        {/* FULL WHITE LOADING */}
        {isLoadingGlobal && <div className="fixed inset-0 bg-white z-9999"></div>}

        <header className="fixed z-50 w-full bg-[#111C52] text-[#D3D8EE] shadow-md">
          <div className="mx-auto flex w-full max-w-[1440px] items-center px-6 py-1 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            {/* KIRI: navigasi desktop */}
            <nav className="hidden items-center gap-4 md:flex lg:gap-8">
              <BerandaComponents />
              <TentangKamiComponents />
              <EdukasiKesehatanComponents />
            </nav>

            {/* KANAN: mobile dan desktop */}
            <div className="ml-auto flex w-full items-center justify-between md:w-auto md:justify-end">
              {/* Mobile */}
              <div className="md:hidden">
                <WhatsAppComponents />
              </div>

              <div className="md:hidden">
                <HubungiKami />
              </div>

              {/* Desktop */}
              <div className="hidden items-center gap-4 md:flex lg:gap-7 xl:gap-9">
                <WhatsAppComponents />
                <HubungiKami />

                <div className="flex items-center gap-3 lg:gap-5">
                  <AkunLoginUserComponents />
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </header>

        <TopMenu />

        <main>{children}</main>

        <Footer />
      </>
      )}
      
      {/* Modal pembayaran global */}
      <PaymentSuccessModal />
    </>
  );
}
