"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";
import Select from "react-select";

export default function AkunLayout({ children }: { children: ReactNode }) {
  const { firstName, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activePath, setActivePath] = useState<string | null>(null);
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const menu = [
    { label: t.riwayatTransaksi, path: "/akun/riwayat-transaksi" },
    { label: t.riwayatBerobat, path: "/akun/riwayat-berobat" },
    { label: t.resepSaya, path: "/akun/resep-saya" },
    { label: t.tiketSaya, path: "/akun/tiket-saya" },
    { label: t.hasilPemeriksaanLab, path: "/akun/hasil-lab" },
    { label: t.hasilPemeriksaanRadilogi, path: "/akun/hasil-radiologi" },
    { label: t.dokterFavorit, path: "/akun/dokter-favorit" },
    { label: t.pengaturanAkunSaya, path: "/akun/pengaturan-akun" },
  ];

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    setMounted(true);
    setActivePath(pathname);
  }, [pathname]);

  if (!mounted) return null; // ⬅️ penting

  const tabOptions = [
    ...menu.map((item) => ({
      value: item.path,
      label: item.label,
    })),
    {
      value: "logout",
      label: (
        <div className="flex items-center gap-2 text-red-600 font-semibold">
          <img
            src="/logout.png"
            alt="logout"
            className="w-4 h-4"
          />
          <span>{t.keluarAkun}</span>
        </div>
      ),
    },
  ];

  const selectedTab =
    tabOptions.find((opt) => opt.value === activePath) || null;

  return (
    <div className="min-h-screen pt-7">
      <div className="w-full mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 max-w-8xl py-7 flex flex-col md:flex-row gap-5">

       {/* ================= MOBILE DROPDOWN (react-select) ================= */}
        <div className="md:hidden mb-6">
          <Select
            instanceId="akun-menu-mobile"
            options={tabOptions}
            value={selectedTab}
            isSearchable={false}
            isClearable={false}
            placeholder={t.riwayatTransaksi}
            onChange={(opt) => {
              if (!opt) return;

              if (opt.value === "logout") {
                handleLogout();
                return;
              }

              router.push(opt.value);
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
              option: (base, state) => {
                const isLogout = state.data.value === "logout";

                return {
                  ...base,
                  backgroundColor: isLogout
                    ? state.isFocused
                      ? "#fee2e2" // red-100
                      : "white"
                    : state.isSelected
                    ? "#eff6ff"
                    : state.isFocused
                    ? "#f1f5f9"
                    : "white",

                  color: isLogout
                    ? "#dc2626" // red-600
                    : state.isSelected
                    ? "#1e3a8a"
                    : "#111827",

                  fontWeight: isLogout ? 600 : state.isSelected ? 600 : 400,
                  cursor: "pointer",
                };
              },
              singleValue: (base) => ({
                ...base,
                fontWeight: 600,
                color: "#1f2937",
              }),
            }}
          />
        </div>
        
        {/* SIDEBAR KIRI */}
        <aside className="hidden md:block md:w-75 lg:w-80 xl:w-90 bg-white rounded-lg shadow p-5 border border-gray-400">

          {/* HEADER */}
          <div className="mb-5">
            <p className="md:text-[12px] lg:text-[13px] xl:text-[14px] text-gray-500">{t.selamatDatangUntukAkun}</p>
            <h2 className="font-bold md:text-[16px] lg:text-[18px] xl:text-[20px] text-gray-900">
              {firstName}
            </h2>
          </div>

          <div className="border-b mb-4" />

          <ul className="space-y-1">
            {menu.map((item) => {
              const isActive = activePath === item.path;

              return (
                <li key={item.path}>
                  <Link
                    href={isActive ? "#" : item.path}
                    onClick={(e) => {
                      if (isActive) {
                        e.preventDefault(); // 🚫 stop klik ulang
                        return;
                      }
                      setActivePath(item.path);
                    }}
                    className={`block px-3 py-2 rounded md:text-[12px] lg:text-[13px] xl:text-[14px] transition
                      ${
                        isActive
                          ? "bg-blue-100 text-blue-800 font-semibold cursor-default pointer-events-none"
                          : "text-gray-800 hover:bg-gray-100 hover:text-blue-600 cursor-pointer "
                      }`}
                    aria-disabled={isActive}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* 🔥 TOMBOL KELUAR (PALING BAWAH) */}
          <div className="mt-auto pt-5">
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 rounded-md border border-red-500 text-red-600 md:text-[12px] lg:text-[13px] xl:text-[14px] font-semibold
                         hover:bg-red-500 hover:text-white transition cursor-pointer"
            >
              {t.keluarAkun}
            </button>
          </div>

        </aside>

        {/* KONTEN KANAN */}
        <main className="flex-1 bg-white rounded-lg shadow p-6 border border-gray-400">
          {children}
        </main>
      </div>
    </div>
  );
}
