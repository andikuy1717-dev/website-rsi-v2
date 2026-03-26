"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type LangType = "ID" | "EN";

interface LangContextProps {
  lang: LangType;
  setLang: (v: LangType) => void;
}

const LanguageContext = createContext<LangContextProps | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangType>("ID");

  // ⬇ Ambil bahasa terakhir dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "ID" || saved === "EN") {
      setLang(saved);
    }
  }, []);

  // ⬇ Simpan setiap kali user ganti bahasa
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
