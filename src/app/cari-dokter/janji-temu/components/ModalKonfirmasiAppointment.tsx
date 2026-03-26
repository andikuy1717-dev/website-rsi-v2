"use client";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  doctorName: string;
  serviceUnitName: string;
  patientTypeLabel: string;
  patientType: string | null;
  time: string;
  appointmentDate: string;   // ✅ baru
  patientName: string;       // ✅ baru
  registerTime: string;      // ✅ baru
  billingTotal?: number | null;
};

export default function ModalKonfirmasiMitra({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  doctorName,
  serviceUnitName,
  patientTypeLabel,
  patientType,
  time,
  appointmentDate,
  patientName,
  registerTime,
  billingTotal
}: Props) {
  if (!isOpen) return null;

  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const formatRupiah = (num?: number | null) => {
    if (num === null || num === undefined) return "-";
    return new Intl.NumberFormat(lang === "ID" ? "id-ID" : "en-US", {
      style: "currency",
      currency: lang === "ID" ? "IDR" : "USD",
      minimumFractionDigits: 0,
    }).format(num);
  };

 return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">

        {/* HEADER STRUK */}
        <div className="bg-linear-to-r from-blue-800 to-blue-600 text-white text-center py-4">
          <h2 className="text-lg font-semibold tracking-wide">
            {t.konfirmasiAppointment}
          </h2>
          <p className="text-xs opacity-80 mt-1">
            {t.mohonPeriksaKembaliDataAnda}
          </p>
        </div>

        {/* BODY STRUK */}
        <div className="p-6 text-sm text-gray-700 space-y-3 font-mono">

          <div className="grid grid-cols-[140px_10px_1fr]">
            <span className="font-semibold">{t.Nama}</span>
            <span>:</span>
            <span className="font-semibold">{patientName}</span>
          </div>

          <div className="grid grid-cols-[140px_10px_1fr]">
            <span className="font-semibold">{t.dokter}</span>
            <span>:</span>
            <span>{doctorName}</span>
          </div>

          <div className="grid grid-cols-[140px_10px_1fr]">
            <span className="font-semibold">{t.Poli}</span>
            <span>:</span>
            <span>{serviceUnitName}</span>
          </div>

          <div className="grid grid-cols-[140px_10px_1fr]">
            <span className="font-semibold">{t.jamPraktek}</span>
            <span>:</span>
            <span>{time}</span>
          </div>

          <div className="grid grid-cols-[140px_10px_1fr]">
            <span className="font-semibold">{t.sebagaiPasien}</span>
            <span>:</span>
            <span>{patientTypeLabel}</span>
          </div>

          <div className="grid grid-cols-[140px_10px_1fr]">
            <span className="font-semibold">{t.tglAppointment}</span>
            <span>:</span>
            <span>{appointmentDate}</span>
          </div>

          <div className="grid grid-cols-[140px_10px_1fr]">
            <span className="font-semibold">{t.waktuDaftar}</span>
            <span>:</span>
            <span>{registerTime}</span>
          </div>

          {patientType === "Tunai" && billingTotal != null && (
            <div className="grid grid-cols-[140px_10px_1fr]">
              <span className="font-semibold">
                {lang === "ID" ? "Total Tagihan" : "Total Billing"}
              </span>
              <span>:</span>
              <span className="font-semibold text-blue-700">
                {formatRupiah(billingTotal)}
              </span>
            </div>
          )}

          {/* Garis putus-putus seperti struk */}
          <div className="border-t border-dashed border-gray-400 my-4"></div>

          <div className="text-center text-xs text-gray-500">
            {t.sistemAkanMemprosesPendaftaranAnda}
          </div>
        </div>

        {/* FOOTER BUTTON */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-gray-600 hover:bg-gray-300 transition font-medium cursor-pointer"
          >
            {t.Batal}
          </button>

          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-blue-800 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold cursor-pointer"
          >
            {isSubmitting ? t.prosesStrukAppointment : t.tombolKonfirmasi}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white/80 hover:text-white text-lg cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}