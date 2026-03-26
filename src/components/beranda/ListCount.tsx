"use client"

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
      const [paramedicData, patientData, guarantorData] = await Promise.all([
        fetchParamedicCount(),
        fetchPatientCount(),
        fetchGuarantorCount()
      ]);

      setParamedic(paramedicData.active_paramedic_count || 0);
      setPatient(patientData.total_patient_count || 0);
      setGuarantor(guarantorData.total_unique_guarantor || 0);

      endLoading();
    }

    load();
  }, []);

  const renderNumber = (num: number | null) => {
    if (num === null) return "";     // saat loading → kosong tanpa flicker 0
    return `${formatK(num)}`;       // data sudah ada → tampil formatK
  };

  return (
    <div className="w-full bg-[#F8FBFF]">
      <div className="flex flex-row items-center justify-between gap-10 md:gap-20 px-4 sm:px-10 md:px-25 lg:px-45 xl:px-45">

        {/* ITEM */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[22px] sm:text-[30px] md:text-[35px] lg:text-[40px] xl:text-[50px] text-blue-900">
            {renderNumber(paramedic)}+
          </h2>
          <p className="text-gray-600 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px]">
            {t.tenagaMedis}
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <h2 className="text-[22px] sm:text-[30px] md:text-[35px] lg:text-[40px] xl:text-[50px] text-blue-900">
            {renderNumber(patient)}+
          </h2>
          <p className="text-gray-600 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px]">
            {t.pasienDilayani}
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <h2 className="text-[22px] sm:text-[30px] md:text-[35px] lg:text-[40px] xl:text-[50px] text-blue-900">
            {renderNumber(guarantor)}+
          </h2>
          <p className="text-gray-600 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px]">
            {t.mitraAsuransi}
          </p>
        </div>

      </div>
    </div>
  );
}
