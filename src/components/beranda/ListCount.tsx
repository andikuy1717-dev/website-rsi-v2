"use client";

import { fetchParamedicCount } from "@/services/ParamedicCountService";
import { fetchPatientCount } from "@/services/PatientCountService";
import { fetchGuarantorCount } from "@/services/GuarantorCountService";
import { useEffect, useState } from "react";
import { formatK } from "@/utils/NumberFormatter";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";

export default function ListCount() {
  const [paramedic, setParamedic] = useState<number | null>(null);
  const [patient, setPatient] = useState<number | null>(null);
  const [guarantor, setGuarantor] = useState<number | null>(null);
  const { lang } = useLang();
  const t = lang === "EN" ? EN : ID;

  useEffect(() => {
    startLoading();

    async function load() {
      try {
        const [paramedicData, patientData, guarantorData] = await Promise.all([
          fetchParamedicCount(),
          fetchPatientCount(),
          fetchGuarantorCount()
        ]);

        setParamedic(paramedicData?.active_paramedic_count || 900);
        setPatient(patientData?.total_patient_count || 620000);
        setGuarantor(guarantorData?.total_unique_guarantor || 300);
      } catch (err) {
        // Fallback default jika endpoint belum aktif
        setParamedic(900);
        setPatient(620000);
        setGuarantor(300);
      } finally {
        endLoading();
      }
    }

    load();
  }, []);

  const renderNumber = (num: number | null, fallback: string) => {
    if (num === null) return fallback;
    return `${formatK(num)}+`;
  };

  return (
    <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
      
      {/* ITEM 1: TENAGA MEDIS */}
      <div className="flex flex-col">
        <h3 className="text-[28px] sm:text-[32px] lg:text-[36px] font-extrabold text-[#111C52] leading-none tracking-tight">
          {renderNumber(paramedic, "900+")}
        </h3>
        <p className="text-[#545B75] text-[12px] sm:text-[13px] font-medium mt-1.5 leading-tight">
          {t.tenagaMedis || "Tenaga medis"}
        </p>
      </div>

      {/* DIVIDER VERTICAL GARIS KARTU #E3E6EF */}
      <div className="h-10 w-[1px] bg-[#E3E6EF]" />

      {/* ITEM 2: PASIEN DILAYANI */}
      <div className="flex flex-col">
        <h3 className="text-[28px] sm:text-[32px] lg:text-[36px] font-extrabold text-[#111C52] leading-none tracking-tight">
          {renderNumber(patient, "620K+")}
        </h3>
        <p className="text-[#545B75] text-[12px] sm:text-[13px] font-medium mt-1.5 leading-tight">
          {t.pasienDilayani || "Pasien dilayani"}
        </p>
      </div>

      {/* DIVIDER VERTICAL GARIS KARTU #E3E6EF */}
      <div className="h-10 w-[1px] bg-[#E3E6EF]" />

      {/* ITEM 3: MITRA ASURANSI */}
      <div className="flex flex-col">
        <h3 className="text-[28px] sm:text-[32px] lg:text-[36px] font-extrabold text-[#111C52] leading-none tracking-tight">
          {renderNumber(guarantor, "300+")}
        </h3>
        <p className="text-[#545B75] text-[12px] sm:text-[13px] font-medium mt-1.5 leading-tight">
          {t.mitraAsuransi || "Mitra asuransi"}
        </p>
      </div>

    </div>
  );
}