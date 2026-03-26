"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { startLoading, endLoading } from "@/utils/LoadingManager";

export default function HasilRadilogiPage() {
  const { medicalNo, token } = useAuth();
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  useEffect(() => {
    if (!medicalNo || !token) return;

    const initPage = async () => {
        startLoading();

        try {
        // 🔥 Nanti di sini akan ada fetch radiologi API
        // Untuk sekarang hanya simulasi proses ringan
        await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
        console.error("Init Radiologi Page error:", error);
        } finally {
        endLoading();
        }
    };

    initPage(); 
  }, [medicalNo, token]);

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-black md:text-[16px] lg:text-[18px] xl:text-[20px]">
        {t.hasilPemeriksaanRadilogi}
      </h1>
 
        <div className="text-gray-400">
            {t.tidakAdaHasilRadiologi}
        </div>
    </>
  );
}