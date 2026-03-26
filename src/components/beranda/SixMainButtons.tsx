"use client";

import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useRouter, usePathname } from "next/navigation";
import { startLoading } from "@/utils/LoadingManager";

export default function SixMainButtons() {
  const { lang } = useLang();
  const t = lang === "EN" ? EN : ID;
  const router = useRouter();
  const pathname = usePathname();
  const isCariDokter = pathname === "/cari-dokter";

  return (
    <div className="mt-8 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row pr-2 pl-4 sm:pr-2 sm:pl-6 md:pl-0 md:pr-0 gap-3 sm:gap-15 md:gap-5 lg:gap-15 xl:gap-20 mb-20">

        <button
          disabled={isCariDokter}
          onClick={() => {
            if (isCariDokter) return;
            startLoading();
            router.push("/cari-dokter");
          }}
          className={`flex-1 items-center gap-3 shrink-0 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.50)]
            py-3 rounded-2xl border border-gray-200 transform transition duration-300 ease-in-out
            ${
              isCariDokter
                ? "cursor-default opacity-70"
                : "cursor-pointer hover:scale-110"
            }
          `}
        >
          <div className="flex justify-center items-center w-full">
            <img src="/cari_dokter2.png" className="w-7 h-7" />
          </div>

          <span
            className={`font-medium whitespace-nowrap text-[10px] sm:text-[12px] md:text-[12px] lg:text-[14px] xl:text-[16px]
              ${isCariDokter ? "text-blue-700" : "text-gray-700"}
            `}
          >
            {t.cariDokter}
          </span>

          <span className="text-blue-700 px-1 lg:text-lg xl:text-xl">›</span>
        </button>

        <button className="flex-1 items-center gap-3 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.50)] py-3 rounded-2xl border border-gray-200 cursor-pointer transform transition duration-300 ease-in-out hover:scale-110 hover:rotate-0">
          <div className="flex justify-center items-center w-full">
            <img src="/layanan_unggul2.png" className="w-7 h-7" />
          </div>
          <span className="text-gray-700 font-medium whitespace-nowrap text-[10px] sm:text-[12px] md:text-[12px] lg:text-[14px] xl:text-[16px]">{t.layananUnggulan}</span>
          <span className="text-blue-700 px-1 lg:text-lg xl:text-xl">›</span>
        </button>

        <button className="flex-1 items-center gap-3 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.50)] py-3 rounded-2xl border border-gray-200 cursor-pointer transform transition duration-300 ease-in-out hover:scale-110 hover:rotate-0">
          <div className="flex justify-center items-center w-full">
            <img src="/medical_check_up2.png" className="w-7 h-7" />
          </div>
          <span className="text-gray-700 font-medium whitespace-nowrap text-[10px] sm:text-[12px] md:text-[12px] lg:text-[14px] xl:text-[16px]">Rehabilitasi Medis</span>
          <span className="text-blue-700 px-1 lg:text-lg xl:text-xl">›</span>
        </button>

        <button 
          onClick={() => {
            router.push("/akun/hasil-lab");
          }} 
          className="flex-1 items-center gap-3 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.50)] py-3 rounded-2xl border border-gray-200 cursor-pointer transform transition duration-300 ease-in-out hover:scale-110 hover:rotate-0">
          <div className="flex justify-center items-center w-full">
            <img src="/lab2.png" className="w-7 h-7" />
          </div>
          <span className="text-gray-700 font-medium whitespace-nowrap text-[10px] sm:text-[12px] md:text-[12px] lg:text-[14px] xl:text-[16px]">{t.hasilLabBeranda}</span>
          <span className="text-blue-700 px-1 lg:text-lg xl:text-xl">›</span>
        </button>

        <button className="flex-1 items-center gap-3 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.50)] py-3 rounded-2xl border border-gray-200 cursor-pointer transform transition duration-300 ease-in-out hover:scale-110 hover:rotate-0">
          <div className="flex justify-center items-center w-full">
            <img src="/radiologi2.png" className="w-7 h-7" />
          </div>
          <span className="text-gray-700 font-medium whitespace-nowrap text-[10px] sm:text-[12px] md:text-[12px] lg:text-[14px] xl:text-[16px]">{t.radiologi}</span>
          <span className="text-blue-700 px-1 lg:text-lg xl:text-xl">›</span>
        </button>

      </div>
    </div>

  );
}
