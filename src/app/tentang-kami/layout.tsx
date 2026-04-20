"use client";

import Link from "next/link";
import Select from "react-select";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useEffect, useRef } from "react";
import { startLoading, endLoading } from "@/utils/LoadingManager";

export default function TentangKamiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const router = useRouter();

  const didClose = useRef(false);

  // 🔥 START LOADING SAAT ROUTE BERUBAH / F5
  useEffect(() => {
    didClose.current = false;
    startLoading();

    // 🔥 TUTUP LOADING SETELAH DOM KE-PAINT
    const raf = requestAnimationFrame(() => {
      endLoading();
      didClose.current = true;
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  const tabs = [
    { label: t.sejarah, href: "/tentang-kami/sejarah" },
    { label: t.kataPengantar, href: "/tentang-kami/kata-pengantar" },
    { label: t.rekananAsuransi, href: "/tentang-kami/rekanan-asuransi"},
    { label: t.visi_misi, href: "/tentang-kami/visi-misi" },
    { label: t.penghargaan, href: "/tentang-kami/penghargaan" },
    { label: t.filosofi_logo, href: "/tentang-kami/filosofi-logo" },
  ];

  const tabOptions = tabs.map(tab => ({
    value: tab.href,
    label: tab.label,
  }));

  const selectedTab =
  tabOptions.find(opt => opt.value === pathname) || null;

  return (
    <div className="min-h-screen py-8 md:py-12">

      {/* 🔥 CONTAINER BIAR SEJAJAR */}
      <div className="mx-auto w-full max-w-8xl px-4 md:px-14 lg:px-16 xl:px-18">

     {/* ================= MOBILE DROPDOWN (react-select) ================= */}
      <div className="md:hidden mb-8">
        <Select
          instanceId="tentang-kami-mobile"
          options={tabOptions}
          value={selectedTab}
          isSearchable={false}     // 🔥 biar simple
          isClearable={false}
          placeholder={t.sejarah}
          onChange={(opt) => {
            if (opt?.value) router.push(opt.value);
          }}
          classNamePrefix="rs"
          menuPlacement="auto"
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: "12px",
              borderColor: "#9ca3af", // gray-400
              padding: "4px 6px",
              boxShadow: "none",
              minHeight: "48px",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? "#eff6ff"   // blue-50 (HALUS)
                : state.isFocused
                ? "#f1f5f9"   // slate-100
                : "white",
              color: state.isSelected
                ? "#1e3a8a"   // blue-900
                : "#111827",
              fontWeight: state.isSelected ? 600 : 400,
              cursor: "pointer",
            }),
            singleValue: (base) => ({
              ...base,
              fontWeight: 600,
              color: "#1f2937",
            }),
          }}
        />
      </div>

      {/* ================= DESKTOP TABS ================= */}
      <div className="hidden md:flex justify-center border-b mb-12">
        <div className="flex md: gap-16 lg:gap-24 xl:gap-23 bg-gray-100 px-10 py-1 rounded-full shadow-sm">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={isActive ? "#" : tab.href}
                aria-disabled={isActive}
                onClick={(e) => {
                  if (isActive) e.preventDefault();
                }}
                className={`
                  relative pb-1 md:text-[12px] lg:text-[14px] xl:text-[16px] font-semibold text-black
                  ${isActive ? "cursor-default" : "cursor-pointer"}
                  after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0
                  after:h-0.5 after:w-full after:origin-center
                  after:transition-transform after:duration-300
                  after:bg-linear-to-r after:from-blue-300 after:to-blue-500
                  ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}
                `}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {children}
      </div>
    </div>
  );
}
