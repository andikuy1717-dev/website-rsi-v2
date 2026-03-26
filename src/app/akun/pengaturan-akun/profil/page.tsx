"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getPatientByMedicalNo } from "@/services/GetPatientByMedicalNoForPatientId";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";

interface PatientData {
  PatientID: string;
  MedicalNo: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DateOfBirth: string;
  StreetName: string;
  District: string;
  City: string;
  County: string;
  State: string;
  ZipCode: string;
  PhoneNo: string;
  MobilePhoneNo: string;
  Email: string;
  Ssn: string;
  GuarantorID: string;
  BirthPlace: string;
  Sex: string;
  SRReligion: string;
  SRReligionName: string;
  SREducation: string | null;
  SREducationName: string | null;
  SROccupation: string | null;
  SROccupationName: string | null;
  SRMaritalStatus: string | null;
  SRMaritalStatusName: string | null;
  SRTitle: string | null;
  SRTitleName: string | null;
  DateOfBirth_yMdHms: string;
}

export default function ProfilPage() {
  const router = useRouter();
  const { medicalNo } = useAuth();
  const searchParams = useSearchParams();
  const medicalNoParam = searchParams?.get("medicalNo");

  const selectedMedicalNo = medicalNoParam || medicalNo;
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const [patient, setPatient] = useState<PatientData | null>(null);

  useEffect(() => {
    if (!selectedMedicalNo) return;

    const fetchPatient = async () => {
      startLoading();
      try {
        const response = await getPatientByMedicalNo(selectedMedicalNo);

        if (response?.data) {
          setPatient(response.data);
        } else {
          console.error("Data pasien tidak ditemukan");
        }
      } catch (error) {
        console.error("Fetch patient error:", error);
      } finally {
        endLoading();
      }
    };

    fetchPatient();
  }, [medicalNo]);

  function InfoItem({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex flex-col bg-gray-50 rounded-xl p-3 border border-gray-100">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="font-medium text-gray-800">
            {value && value !== "" ? value : "-"}
        </span>
        </div>
    );
  }

  function formatDate(dateString?: string | null) {
    if (!dateString) return "-";

    const match = dateString.match(/\d+/);
    if (!match) return dateString;

    const date = new Date(Number(match[0]));

    return new Intl.DateTimeFormat(
        lang === "ID" ? "id-ID" : "en-US",
        {
        day: "2-digit",
        month: "long",
        year: "numeric",
        }
    ).format(date);
  }

  function formatGender(sex?: string | null) {
    if (!sex) return "-";

    const value = sex.toLowerCase();

    const isMale =
        value === "m" ||
        value === "male" ||
        value === "l" ||
        value === "laki-laki";

    const isFemale =
        value === "f" ||
        value === "female" ||
        value === "p" ||
        value === "perempuan";

    if (isMale) {
        return lang === "ID" ? "Laki-Laki" : "Male";
    }

    if (isFemale) {
        return lang === "ID" ? "Perempuan" : "Female";
    }

    return sex;
  }

  function formatReligion(religion?: string | null) {
    if (!religion) return "-";

    const value = religion.toLowerCase();

    const religionMap: Record<string, { ID: string; EN: string }> = {
        islam: { ID: "Islam", EN: "Islam" },
        kristen: { ID: "KRISTEN", EN: "CHRISTIAN" },
        christian: { ID: "KRISTEN", EN: "CHRISTIAN" },
        katolik: { ID: "KATOLIK", EN: "CATHOLIC" },
        catholic: { ID: "KATOLIK", EN: "CATHOLIC" },
        hindu: { ID: "HINDU", EN: "HINDU" },
        buddha: { ID: "BUDDHA", EN: "BUDDHISM" },
        buddhism: { ID: "BUDDHA", EN: "BUDDHISM" },
        konghucu: { ID: "KONGHUCU", EN: "CONFUCIAN" },
        confucianism: { ID: "KONGHUCU", EN: "CONFUCIAN" },
    };

    if (religionMap[value]) {
        return religionMap[value][lang];
    }

    return religion;
  }

  function maskNIK(nik?: string | null) {
    if (!nik) return "-";

    const cleanNik = nik.replace(/\s/g, "");

    if (cleanNik.length <= 4) return cleanNik;

    const lastFour = cleanNik.slice(-4);
    const masked = "*".repeat(cleanNik.length - 4);

    return masked + lastFour;
  }

  function formatPhoneNumber(phone?: string | null) {
    if (!phone) return "-";

    // Hilangkan semua karakter selain angka
    let cleaned = phone.replace(/\D/g, "");

    // Jika diawali 0 → ganti jadi +62
    if (cleaned.startsWith("0")) {
        cleaned = "62" + cleaned.slice(1);
    }

    // Jika belum ada 62 → tambahkan
    if (!cleaned.startsWith("62")) {
        cleaned = "62" + cleaned;
    }

    // Format: +62 XXX-XXXX-XXXX
    const country = "+62";
    const number = cleaned.slice(2);

    if (number.length <= 4) {
        return `${country} ${number}`;
    }

    if (number.length <= 8) {
        return `${country} ${number.slice(0, 3)}-${number.slice(3)}`;
    }

    return `${country} ${number.slice(0, 3)}-${number.slice(
        3,
        7
    )}-${number.slice(7)}`;
  }

  return (
    <div className="space-y-6 text-black">

        {/* HEADER PROFILE */}
        <div className=" bg-blue-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">

        {/* BACK ARROW */}
        <button
         title={t.titleKembali}
         onClick={() => router.back()}
         className="mt-2 rounded-full transition cursor-pointer"
        >
        <span className="inline-block text-6xl sm:text-7xl md:text-6xl lg:text-7xl rotate-180 transition-transform duration-200 hover:scale-110 active:scale-95 leading-none">
            ›
        </span>
        </button>

        {/* AVATAR */}
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold">
        {patient?.FirstName?.charAt(0)}
        </div>
            <div>
            <h1 className="text-xl sm:text-2xl md:text-xl lg:text-2xl font-bold">
                {patient
                ? `${patient.FirstName} ${patient.MiddleName ?? ""} ${patient.LastName ?? ""}`
                : "Memuat..."}
            </h1>
            <p className="text-[13px] sm:text-[14px] md:text-[13px] lg:text-[14px] opacity-90">
                {t.medicalNo} {patient?.MedicalNo || "-"}
            </p>
            </div>
        </div>
        </div>

        {/* PERSONAL INFO */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-blue-900">
            {t.informasiPribadi}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <InfoItem label={t.jenisKelamin} value={formatGender(patient?.Sex)} />
            <InfoItem label={t.tanggalLahir} value={formatDate(patient?.DateOfBirth)} />
            <InfoItem label={t.tempatLahir} value={patient?.BirthPlace} />
            <InfoItem label={t.Agama} value={formatReligion(patient?.SRReligionName)} />
            <InfoItem label={t.NIK} value={maskNIK(patient?.Ssn)} />
        </div>
        </div>

        {/* CONTACT INFO */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-blue-900">
            {t.informasiKontak}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <InfoItem label="Email" value={patient?.Email} />
            <InfoItem label="No HandPhone" value={formatPhoneNumber(patient?.MobilePhoneNo)}  />
            <InfoItem label={t.teleponRumah} value={formatPhoneNumber(patient?.PhoneNo)} />
        </div>
        </div>

        {/* ADDRESS */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-blue-900">
            {t.Alamat}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <InfoItem label={t.Jalan} value={patient?.StreetName} />
            <InfoItem label={t.kecamatan} value={patient?.District} />
            <InfoItem label={t.kota} value={patient?.City} />
            <InfoItem label={t.kelurahan} value={patient?.County} />
            <InfoItem label={t.pulau} value={patient?.State} />
            <InfoItem label={t.kodePos} value={patient?.ZipCode} />
        </div>
        </div>
    </div>
    );
}