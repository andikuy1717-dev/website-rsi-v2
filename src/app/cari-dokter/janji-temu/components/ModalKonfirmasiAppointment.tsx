"use client";

import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import {
  CalendarDays,
  Clock3,
  CreditCard,
  UserRound,
  Stethoscope,
  Building2,
  X,
  CheckCircle2,
} from "lucide-react";

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
  appointmentDate: string;
  patientName: string;
  registerTime: string;
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
  billingTotal,
}: Props) {
  if (!isOpen) return null;

  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const formatRupiah = (num?: number | null) => {
    if (num === null || num === undefined) return "-";

    return new Intl.NumberFormat(
      lang === "ID" ? "id-ID" : "en-US",
      {
        style: "currency",
        currency: lang === "ID" ? "IDR" : "USD",
        minimumFractionDigits: 0,
      }
    ).format(num);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07133f]/55 px-4 py-6 backdrop-blur-sm">
      <div
        className="
          relative
          flex
          max-h-[92vh]
          w-full
          max-w-[520px]
          flex-col
          overflow-hidden
          rounded-[28px]
          bg-white
          shadow-[0_25px_80px_rgba(0,0,0,0.25)]
          animate-fadeIn
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="relative overflow-hidden bg-[#182772] px-6 pb-7 pt-6 text-white sm:px-7">
          {/* Decorative circle */}
          <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 left-1/3 h-32 w-32 rounded-full bg-[#E0A918]/10 blur-2xl" />

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              absolute
              right-5
              top-5
              z-10
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white/80
              transition
              hover:bg-white/20
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon */}
          <div className="relative mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>

          <div className="relative">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F0B928]">
              {lang === "ID"
                ? "Konfirmasi Pendaftaran"
                : "Registration Confirmation"}
            </p>

            <h2 className="text-2xl font-extrabold tracking-tight sm:text-[26px]">
              {t.konfirmasiAppointment}
            </h2>

            <p className="mt-2 max-w-[390px] text-sm leading-6 text-blue-100/85">
              {t.mohonPeriksaKembaliDataAnda}
            </p>
          </div>
        </div>

        {/* =====================================================
            BODY
        ====================================================== */}
        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {/* Patient */}
          <div className="mb-5 rounded-2xl border border-[#E3E8F3] bg-[#F7F9FD] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#182772] text-white">
                <UserRound className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                  {t.Nama}
                </p>

                <p className="mt-0.5 truncate text-[15px] font-bold text-[#101B4D]">
                  {patientName}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Info */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#E0A918]">
              {lang === "ID"
                ? "Detail Kunjungan"
                : "Visit Details"}
            </p>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {/* Doctor */}
              <div className="rounded-2xl border border-gray-200 bg-white p-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#182772]">
                    <Stethoscope className="h-4 w-4" />
                  </div>

                  <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    {t.dokter}
                  </span>
                </div>

                <p className="text-sm font-bold leading-5 text-[#101B4D]">
                  {doctorName}
                </p>
              </div>

              {/* Poli */}
              <div className="rounded-2xl border border-gray-200 bg-white p-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#182772]">
                    <Building2 className="h-4 w-4" />
                  </div>

                  <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    {t.Poli}
                  </span>
                </div>

                <p className="text-sm font-bold leading-5 text-[#101B4D]">
                  {serviceUnitName}
                </p>
              </div>

              {/* Date */}
              <div className="rounded-2xl border border-gray-200 bg-white p-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#182772]">
                    <CalendarDays className="h-4 w-4" />
                  </div>

                  <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    {t.tglAppointment}
                  </span>
                </div>

                <p className="text-sm font-bold leading-5 text-[#101B4D]">
                  {appointmentDate}
                </p>
              </div>

              {/* Time */}
              <div className="rounded-2xl border border-gray-200 bg-white p-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#182772]">
                    <Clock3 className="h-4 w-4" />
                  </div>

                  <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    {t.jamPraktek}
                  </span>
                </div>

                <p className="text-sm font-bold leading-5 text-[#101B4D]">
                  {time}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-5 border-t border-dashed border-gray-200 pt-5">
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-sm text-gray-500">
                {t.sebagaiPasien}
              </span>

              <span className="text-right text-sm font-semibold text-[#182772]">
                {patientTypeLabel}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-sm text-gray-500">
                {t.waktuDaftar}
              </span>

              <span className="text-right text-sm font-semibold text-gray-700">
                {registerTime}
              </span>
            </div>
          </div>

          {/* Billing */}
          {patientType === "Tunai" && billingTotal != null && (
            <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#182772] text-white">
                  <CreditCard className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    {lang === "ID"
                      ? "Total Tagihan"
                      : "Total Billing"}
                  </p>

                  <p className="text-sm font-bold text-[#101B4D]">
                    {lang === "ID"
                      ? "Pembayaran"
                      : "Payment"}
                  </p>
                </div>
              </div>

              <span className="text-right text-base font-extrabold text-[#182772]">
                {formatRupiah(billingTotal)}
              </span>
            </div>
          )}

          {/* Notice */}
          <div className="mt-5 rounded-xl bg-[#F7F8FC] px-4 py-3">
            <p className="text-center text-[11px] leading-5 text-gray-500">
              {t.sistemAkanMemprosesPendaftaranAnda}
            </p>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <div className="border-t border-gray-100 bg-white px-5 py-4 sm:px-7">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="
                flex-1
                rounded-xl
                border
                border-gray-200
                bg-white
                py-3
                text-sm
                font-semibold
                text-gray-600
                transition
                hover:border-gray-300
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {t.Batal}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="
                flex-1
                rounded-xl
                bg-[#182772]
                py-3
                text-sm
                font-bold
                text-white
                shadow-md
                shadow-blue-900/15
                transition
                hover:bg-blue-800
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isSubmitting
                ? t.prosesStrukAppointment
                : t.tombolKonfirmasi}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}