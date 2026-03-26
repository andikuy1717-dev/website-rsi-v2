"use client";

import { FiX, FiChevronRight } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";
import { startLoading } from "@/utils/LoadingManager";

export default function HamburgerMenu({ open, onClose }: { open: boolean; onClose: () => void }) {

  const [langOpen, setLangOpen] = useState(false);
  const { lang, setLang } = useLang();
  const langRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = lang === "ID" ? ID : EN;
  const pathname = usePathname();

  //Disable Cari Dokter
  const isCariDokter = pathname === "/cari-dokter";
  const handleCariDokter = () => {
    if (isCariDokter) return; // 🔒 prevent double click

    startLoading();
    onClose();

    setTimeout(() => {
      router.push("/cari-dokter");
    }, 0);
  };

  type MenuKey = "beranda" | "tentangKami" | "infoSehat";

  const menuItems: { key: MenuKey; icon: string; route: string }[] = [
    { key: "beranda", icon: "/beranda.png", route: "/" },
    { key: "tentangKami", icon: "/tentang_kami.png", route: "/tentang-kami" },
    { key: "infoSehat", icon: "/info_sehat.png", route: "/info-sehat" },
  ];


  // ✅ LOCK SCROLL BODY SAAT MENU TERBUKA
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} md:hidden `}>
      {/* MENU BOX */}
      <div
        className={` absolute right-0 top-0 w-full h-full bg-white shadow-xl p-6 flex flex-col transform transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"} md:hidden `}
        onClick={(e) => e.stopPropagation()}>
        {/* HEADER: LOGO + CLOSE BUTTON */}
        <div className="relative top-1 sm:top-2 right-3 sm:right-4 flex items-center justify-between">
          {/* LOGO */}
          <img src="/Logo RSI.png" alt="Logo" className="h-10 sm:h-12 w-auto object-contain" />
        <button className="relative top-0 sm:top-[-2] left-5 sm:left-6 hover:text-blue-600 text-gray-700 cursor-pointer" onClick={onClose}>
          <FiX size={20} />
        </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(100vh-90px)]">
            {/* 3 MENU ICON ATAS */}
                <div className="flex items-center justify-center gap-2 sm:gap-6 mb-6">
                  {menuItems.map((m, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        router.push(m.route);
                        onClose();
                      }}
                      className="flex flex-col items-center gap-1 bg-white border border-gray-200 rounded-2xl p-0 w-15 sm:p-1 sm:w-20 shadow-[0_4px_12px_rgba(0,0,255,0.20)] hover:shadow-[0_6px_18px_rgba(0,0,255,0.28)] transition cursor-pointer">
                      <img src={m.icon} className="w-7 h-7 sm:w-10 sm:h-10" />
                      <span className="text-[6px] sm:text-[8px] font-semibold text-gray-700 text-center leading-tight">
                        {t[m.key]}
                      </span>
                    </div>
                  ))}
            </div>

            {/* SEARCH BAR */}
            <div className="w-full mb-8">
                <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-2xl px-4 py-3 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"/>
                    </svg>

                    <input
                    type="text"
                    placeholder={t.cariDisini}
                    className="w-full text-sm text-gray-600 outline-none"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-6 text-gray-700 mt-10">
                <div onClick={() => router.push("/login")} className="py-3 border-b border-gray-300 hover:text-blue-600 cursor-pointer flex items-center justify-between text-sm">
                    <span>{t.pengaturanAkun}</span>
                    <FiChevronRight size={18} className="text-blue-800"/>
                </div>
                <div onClick={!isCariDokter ? handleCariDokter : undefined} className={`py-3 border-b border-gray-300 hover:text-blue-600 cursor-pointer flex items-center justify-between text-sm ${isCariDokter ? "cursor-default text-blue-500" : "cursor-pointer hover:text-blue-600"}`}>
                    <span>{t.cariDokter}</span>
                    <FiChevronRight size={18} className={isCariDokter ? "text-blue-500" : "text-blue-800"} />
                </div>
                <div className="py-3 border-b border-gray-300 hover:text-blue-600 cursor-pointer flex items-center justify-between text-sm">
                    <span>{t.layananKesehatan}</span>
                    <FiChevronRight size={18} className="text-blue-800"/>
                </div>
                <div className="py-3 border-b border-gray-300 hover:text-blue-600 cursor-pointer flex items-center justify-between text-sm">
                    <span>{t.pusatInformasi}</span>
                    <FiChevronRight size={18} className="text-blue-800"/>
                </div>
            </div>
        </div>

       {/* FOOTER LANGUAGE SWITCHER */}
            <div ref={langRef} className="w-full py-8 px-6 border-t border-blue-600 flex items-center justify-start relative">
            {/* BUTTON */}
            <div onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-xl px-3 py-2 bg-gray-400 shadow-sm">
                <img src={lang === "ID" ? "/flag_id.png" : "/flag_en.png"} className="w-6 h-auto rounded" />
                <span className="text-sm font-medium">{lang}</span>
                <span className="text-xs text-black">{langOpen ? "▲" : "▼"}</span>
            </div>

            {/* DROPDOWN */}
            {langOpen && (
                <div className="absolute bottom-16 left-5 bg-gray-50 border border-gray-500 rounded-lg p-2 shadow-xl z-50 w-25">
                {/* INDONESIA */}
                <div onClick={() => { setLang("ID");
                    setLangOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                    lang === "ID"
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                >
                    <img src="/flag_id.png" className="w-5 h-auto rounded" />
                    <span className="text-gray-800 text-sm font-medium">ID</span>
                </div>

                {/* ENGLISH */}
                <div
                    onClick={() => {
                    setLang("EN");
                    setLangOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                    lang === "EN"
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                >
                    <img src="/flag_en.png" className="w-5 h-auto rounded" />
                    <span className="text-gray-800 text-sm font-medium">EN</span>
                </div>
                </div>
            )}
            </div>
       </div>
    </div>
  );
}
