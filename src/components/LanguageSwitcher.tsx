"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const changeLanguage = (nextLang: "ID" | "EN") => {
    setLang(nextLang);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Pilih bahasa"
        aria-expanded={open}
        className="flex h-7 items-center gap-1 rounded-md border border-[#D3D8EE] px-2 text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-[14px] font-medium text-[#D3D8EE] transition hover:border-[#D3D8EE]/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D3D8EE]/30"
      >
        <span>{lang}</span>

        <svg
          className={`h-3 w-3 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-28 overflow-hidden rounded-md border border-white/10 bg-[#17255f] p-1 shadow-xl">
          <button
            type="button"
            onClick={() => changeLanguage("ID")}
            className={`w-full rounded px-3 py-2 text-left text-xs transition ${
              lang === "ID"
                ? "bg-white/15 font-semibold text-white"
                : "text-[#D3D8EE] hover:bg-white/10"
            }`}
          >
            Indonesia
          </button>

          <button
            type="button"
            onClick={() => changeLanguage("EN")}
            className={`w-full rounded px-3 py-2 text-left text-xs transition ${
              lang === "EN"
                ? "bg-white/15 font-semibold text-white"
                : "text-[#D3D8EE] hover:bg-white/10"
            }`}
          >
            English
          </button>
        </div>
      )}
    </div>
  );
}