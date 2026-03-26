"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  // Ref untuk mendeteksi klik di luar elemen ini
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef} className="relative z-50">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 cursor-pointer py-1">
        <img
          src={lang === "ID" ? "/flag_id.png" : "/flag_en.png"}
          alt="flag"
          className="sm:w-3 sm:h-1 md:w-5 md:h-3 lg:w-6 lg:h-4 align-middle"/>
        <span className="text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-[14px]">
          {lang}
        </span>

       {/* 🔽 SVG Arrow */}
        <svg
          className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {open && (
        <div
          className="absolute top-full right-0 mt-1 bg-[rgb(0,4,51)] rounded-1 p-1 backdrop-blur-4 space-y-1">
          <div
            onClick={() => {
              setLang("ID");
              setOpen(false);
            }}
            className={`flex items-center gap-1 py-1 px-1 cursor-pointer
                ${lang === "ID"
                ? "bg-[rgba(0,80,160,0.6)]"
                : "hover:bg-[rgba(255,255,255,0.1)]"
              }
              `}
          >
            <img
              src="/flag_id.png"
              alt="ID"
              className="sm:w-4 sm:h-2 md:w-5 md:h-3 lg:w-6 lg:h-4"/>
            <span className="text-white text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-[14px]">ID</span>
          </div>

          <div
            onClick={() => {
              setLang("EN");
              setOpen(false);
            }}
            className={`flex items-center gap-1 py-1 px-1 cursor-pointer
              ${lang === "EN"
                ? "bg-[rgba(0,80,160,0.6)]"
                : "hover:bg-[rgba(255,255,255,0.1)]"
              }
            `}
          >
            <img
              src="/flag_en.png"
              alt="EN"
              className="sm:w-4 sm:h-2 md:w-5 md:h-3 lg:w-6 lg:h-4"/>
            <span className="text-white text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-[14px]">
              EN
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
