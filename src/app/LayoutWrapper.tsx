"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import WhatsAppComponents from "@/components/WhatsAppComponents";
import HubungiKami from "@/components/HubungiKamiComponents";
import AkunLoginUserComponents from "@/components/AkunLoginUserComponents";
import LinePutih from "@/components/LinePutih";
import BerandaComponents from "@/components/BerandaComponents";
import TentangKamiComponents from "@/components/TentangKamiComponents";
import InfoSehatComponents from "@/components/InfoSehatComponents";
import TopProgressBar from "@/components/TopProgressBar";
import PosterComponents from "@/components/PosterComponents";
import TopMenu from "@/components/opsi_menu/TopMenu";
import PreFooter from "@/components/Prefooter";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";
import { useGlobalLoading } from "@/utils/UseGlobalLoading";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { usePathname } from "next/navigation";

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

        {/* FULL WHITE LOADING */}
        {isLoadingGlobal && <div className="fixed inset-0 bg-white z-9999"></div>}

        <header className="shadow-md fixed w-full bg-[#21368B] text-white z-50">
          <div className="mx-auto w-full flex items-center justify-between py-1 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-18 max-w-8xl">
          {/* KIRI (Menu Navigasi) */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
              <BerandaComponents />
              <TentangKamiComponents />
              <InfoSehatComponents />
            </div>

        {/* KANAN */}
        <div className="flex w-full items-center md:justify-end">

          {/* MOBILE: WhatsApp kiri */}
          <div className="flex md:hidden">
            <WhatsAppComponents />
          </div>

          {/* MOBILE: Hubungi kanan */}
          <div className="flex md:hidden ml-auto">
            <HubungiKami />
          </div>

          {/* DESKTOP (md ke atas) */}
          <div className="hidden md:flex items-center gap-25 sm:gap-65 md:gap-4 lg:gap-12 xl:gap-8">
            <WhatsAppComponents />
            <HubungiKami />
            <div className="flex items-center gap-4 md:pl-[0.5] lg:gap-8 lg:px-2">
              <LinePutih />
              <AkunLoginUserComponents />
              <LanguageSwitcher />
            </div>
          </div>

        </div>
        </div>
        </header>

        <PosterComponents show={showPoster} setShow={setShowPoster} setBannerHeight={setBannerHeight}/>
        <TopMenu bannerHeight={showPoster ? bannerHeight : 0}/>

        <main>{children}</main>

        <PreFooter />

        <Footer />
      </>
      )}
    </>
  );
}
