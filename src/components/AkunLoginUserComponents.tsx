"use client";

//import { useState } from "react";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef } from "react";
import { logoutUser } from "@/services/Logout";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { usePathname } from "next/navigation";

export default function AkunLoginUserComponents() {
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const router = useRouter();
  const { firstName, token, logout } = useAuth();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  function isActive(path: string) {
    return pathname === path;
  }

  function formatDisplayName(name: string, max = 12) {
    const firstWord = name.split(" ")[0]; // ambil kata pertama
    return firstWord.length > max
      ? firstWord.slice(0, max) + "…"
      : firstWord;
  }

  function handleMainClick() {
    if (!firstName) {
      router.push("/login");
    } else {
      setOpen((prev) => !prev);
    }
  }

  function goTo(path: string) {
    setOpen(false);
    startLoading();          // 🔥 PENTING
    router.push(path);
  }

  async function handleLogout() {
    if (!token) return;

    setOpen(false);
    startLoading();

    try {
      const res = await logoutUser(token);

      if (!res?.error) {
        logout();          // clear auth
        router.refresh();  // re-render
      } else {
        alert(res.error);
      }
    } catch (e) {
      console.error(e);
      alert("Gagal logout");
    } finally {
      endLoading(); // 🔥 INI KUNCI NYAWA
    }
  }

  return (
    <>
    <div ref={wrapperRef} className="relative">
      {/* WA kecil di pojok */}
        <div onClick={handleMainClick} className="flex items-center gap-1 cursor-pointer transform transition duration-300 ease-in-out hover:scale-110 hover:rotate-0">
        <img
          src={firstName ? "/login_user.png" : "/login_user.png"}
          alt="LoginUser"
          className="max-sm:w-4 max-sm:h-3 sm:w-5 sm:h-4 md:w-3 md:h-3 lg:w-4 lg:h-4 align-middle"/>
        <span
           className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-[14px] font-inter drop-shadow-md">
        {firstName ? formatDisplayName(firstName) : t.masukDaftar}

        {/* 🔽 Arrow muncul kalau sudah login */}
         {firstName && (
          <svg
            className="w-3.5 h-3.5 transition-transform duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
        </span>
      </div>

      {/* Dropdown */}
      {firstName && open && (
        <div onMouseLeave={() => setOpen(false)} className="absolute right-0 md:mt-[5px] lg:mt-[7px] translate-x-9 w-40 rounded-md border border-gray-300 text-gray-700 bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-hidden">
          <div className="text-[12px]">
            {/* Header */}
            <div className="px-11 py-2 font-bold text-gray-900 bg-gray-50">
              {t.akunSaya}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300" />

            <ul>
              <li onClick={isActive("/akun/riwayat-transaksi") ? undefined : () => goTo("/akun/riwayat-transaksi")} className={`px-4 py-2
                    ${isActive("/akun/riwayat-transaksi")
                      ? "bg-blue-100"
                      : "hover:bg-blue-100 cursor-pointer"}
                  `}>
                {t.riwayatTransaksi}
              </li>

              <li onClick={isActive("/akun/riwayat-berobat") ? undefined : () => goTo("/akun/riwayat-berobat")} className={`px-4 py-2
                    ${isActive("/akun/riwayat-berobat")
                      ? "bg-blue-100"
                      : "hover:bg-blue-100 cursor-pointer"}
                  `}>
                {t.riwayatBerobat}
              </li>

              <li onClick={isActive("/akun/resep-saya") ? undefined : () => goTo("/akun/resep-saya")} className={`px-4 py-2
                    ${isActive("/akun/resep-saya")
                      ? "bg-blue-100"
                      : "hover:bg-blue-100 cursor-pointer"}
                  `}>
                {t.resepSaya}
              </li>

              <li onClick={isActive("/akun/tiket-saya") ? undefined : () => goTo("/akun/tiket-saya")} className={`px-4 py-2
                    ${isActive("/akun/tiket-saya")
                      ? "bg-blue-100"
                      : "hover:bg-blue-100 cursor-pointer"}
                  `}>
                {t.tiketSaya}
              </li>
              
              <li onClick={isActive("/akun/hasil-lab") ? undefined : () => goTo("/akun/hasil-lab")} className={`px-4 py-2
                    ${isActive("/akun/hasil-lab")
                      ? "bg-blue-100"
                      : "hover:bg-blue-100 cursor-pointer"}
                  `}>
                {t.hasilPemeriksaanLab}
              </li>

              <li onClick={isActive("/akun/hasil-radiologi") ? undefined : () => goTo("/akun/hasil-radiologi")} className={`px-4 py-2
                    ${isActive("/akun/hasil-radiologi")
                      ? "bg-blue-100"
                      : "hover:bg-blue-100 cursor-pointer"}
                  `}>
                {t.hasilPemeriksaanRadilogi}
              </li>

              <li onClick={isActive("/akun/dokter-favorit") ? undefined : () => goTo("/akun/dokter-favorit")} className={`px-4 py-2
                    ${isActive("/akun/dokter-favorit")
                      ? "bg-blue-100"
                      : "hover:bg-blue-100 cursor-pointer"}
                  `}>
                {t.dokterFavorit}
              </li>

              <li onClick={isActive("/akun/pengaturan-akun") ? undefined : () => goTo("/akun/pengaturan-akun")} className={`px-4 py-2
                    ${isActive("/akun/pengaturan-akun")
                      ? "bg-blue-100"
                      : "hover:bg-blue-100 cursor-pointer"}
                  `}>
                {t.pengaturanAkunSaya}
              </li>
              
              {/* Divider */}
              <div className="border-t border-gray-300" />

              <li onClick={handleLogout} className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-red-500 font-bold">
                {t.keluarAkun}
              </li>

            </ul>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
