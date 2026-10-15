"use client";

import Link from "next/link";
import Select from "react-select";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useEffect, useRef } from "react";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { Plus_Jakarta_Sans } from "next/font/google";

// =========================================================
// FONT
// =========================================================
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

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

  // =========================================================
  // LOADING
  // =========================================================
  useEffect(() => {
    didClose.current = false;
    startLoading();

    const raf = requestAnimationFrame(() => {
      endLoading();
      didClose.current = true;
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // =========================================================
  // TABS
  // =========================================================
  const tabs = [
    {
      label: t.sejarah,
      href: "/tentang-kami/sejarah",
    },
    {
      label: t.kataPengantar,
      href: "/tentang-kami/kata-pengantar",
    },
    {
      label: t.visi_misi,
      href: "/tentang-kami/visi-misi",
    },
    {
      label: t.penghargaan,
      href: "/tentang-kami/penghargaan",
    },
    {
      label: t.filosofi_logo,
      href: "/tentang-kami/filosofi-logo",
    },
  ];

  const tabOptions = tabs.map((tab) => ({
    value: tab.href,
    label: tab.label,
  }));

  const selectedTab =
    tabOptions.find((opt) => opt.value === pathname) || null;

  return (
    <div
      className={`${plusJakartaSans.className} min-h-screen w-full bg-[#F3F5FB]`}
    >

      {/* =========================================================
          HERO BANNER SECTION - TENTANG KAMI
      ========================================================= */}
      <div className="w-full bg-[#182772] text-white">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12 md:px-10 lg:px-12 lg:pb-24 lg:pt-14 xl:px-16 2xl:px-20">

          {/* KIRI: Breadcrumb, Judul, dan Deskripsi */}
          <div className="flex min-w-0 max-w-xl flex-col gap-3">

            {/* Breadcrumb */}
            <p className="text-xs font-normal leading-relaxed text-white/75 sm:text-sm">
              {t.beranda || "Beranda"} /{" "}
              {t.tentangKami || "Tentang Kami"}
            </p>

            <div>
              {/* JUDUL */}
              <h1 className="mb-3 text-[32px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[38px] md:text-[44px] lg:text-[48px] xl:text-[52px]">
                {t.tentangKami || "Tentang Kami"}
              </h1>

              {/* DESKRIPSI */}
              <p className="max-w-xl text-sm font-normal leading-[1.7] text-[#C2CEEB] sm:text-base lg:text-[17px]">
                {lang === "ID"
                  ? "Mengenal lebih dekat sejarah, perjalanan, visi, dan nilai-nilai Rumah Sakit Immanuel Bandung."
                  : "Get to know more about the history, journey, vision, and values of Immanuel Hospital Bandung."}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================
          CONTENT
      ========================================================= */}
      <main className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 sm:px-8 md:px-12 lg:px-16 xl:px-20">

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}
        <div className="hidden pt-8 md:block">

          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_25px_rgba(15,23,42,0.06)]">

            <div className="flex items-center justify-center gap-1 lg:gap-2">

              {tabs.map((tab) => {
                const isActive = pathname === tab.href;

                return (
                  <Link
                    key={tab.href}
                    href={isActive ? "#" : tab.href}
                    aria-disabled={isActive}
                    onClick={(e) => {
                      if (isActive) {
                        e.preventDefault();
                      }
                    }}
                    className={`
                      relative flex min-h-[46px]
                      items-center justify-center
                      rounded-xl px-4
                      text-center
                      text-sm font-semibold
                      transition-all duration-300
                      lg:px-6

                      ${
                        isActive
                          ? "bg-[#182772] text-white shadow-md"
                          : "text-slate-700 hover:bg-slate-100 hover:text-[#182772]"
                      }
                    `}
                  >
                    {tab.label}
                  </Link>
                );
              })}

            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ===================================================== */}
        <div className="mb-8 pt-6 md:hidden">

          <Select
            instanceId="tentang-kami-mobile"
            options={tabOptions}
            value={selectedTab}
            isSearchable={false}
            isClearable={false}
            placeholder={t.sejarah}
            onChange={(opt) => {
              if (opt?.value) {
                router.push(opt.value);
              }
            }}
            classNamePrefix="rs"
            menuPlacement="auto"
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "52px",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                padding: "3px 6px",
                boxShadow: "0 8px 25px rgba(15, 23, 42, 0.08)",
              }),

              singleValue: (base) => ({
                ...base,
                color: "#182772",
                fontWeight: 700,
                fontSize: "14px",
              }),

              indicatorSeparator: () => ({
                display: "none",
              }),

              dropdownIndicator: (base) => ({
                ...base,
                color: "#182772",
              }),

              option: (base, state) => ({
                ...base,
                padding: "12px 14px",
                backgroundColor: state.isSelected
                  ? "#182772"
                  : state.isFocused
                  ? "#f1f5f9"
                  : "white",
                color: state.isSelected
                  ? "white"
                  : "#1e293b",
                fontWeight: state.isSelected ? 700 : 500,
                cursor: "pointer",
              }),
            }}
          />

        </div>

        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}
        <div className="pt-2 md:pt-4">
          {children}
        </div>

      </main>
    </div>
  );
}