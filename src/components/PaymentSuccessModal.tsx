"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { getPaymentTestStatus } from "@/services/PaymentDokuTest";

type PaymentSuccessDetail = {
  appointmentNo?: string;
  amount?: number | string;
};

declare global {
  interface WindowEventMap {
    "payment-success": CustomEvent<PaymentSuccessDetail>;
  }
}

export default function PaymentSuccessModal() {
  const { lang } = useLang();

  const [isOpen, setIsOpen] = useState(false);
  const [payment, setPayment] =
    useState<PaymentSuccessDetail>({});

  useEffect(() => {
    let checking = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let isMounted = true;

    const checkPaymentStatus = async () => {
      if (checking) return;

      const invoiceNumber = localStorage.getItem(
        "paymentTestInvoice"
      );

      if (!invoiceNumber) return;

      checking = true;

      try {
        const result = await getPaymentTestStatus(invoiceNumber);

        if (!isMounted) return;

        if (result.success && result.status === "paid") {
          const paymentDetail: PaymentSuccessDetail = {
            appointmentNo: result.appointmentNo,
            amount: Number(result.amount),
          };

          // Gunakan event yang sudah ada agar mekanisme modal tetap konsisten.
          window.dispatchEvent(
            new CustomEvent("payment-success", {
              detail: paymentDetail,
            })
          );

          localStorage.removeItem("paymentTestInvoice");

          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error(
          "Gagal mengecek status pembayaran:",
          error
        );
      } finally {
        checking = false;
      }
    };

    checkPaymentStatus();

    intervalId = setInterval(checkPaymentStatus, 3000);

    return () => {
      isMounted = false;

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  if (!isOpen) return null;

  const formatRupiah = (
    amount?: number | string
  ) => {
    if (amount === undefined || amount === "") {
      return null;
    }

    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(Number(amount));
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#07133f]/65 px-4 py-6 backdrop-blur-sm"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-success-title"
        className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-2xl"
      >
        {/* Decorative header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#182772] to-[#3049a5] px-6 pb-12 pt-9 text-center text-white">
          <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-8 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full border border-white/30 bg-white/15 shadow-lg">
            <svg
              viewBox="0 0 48 48"
              className="h-11 w-11"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r="21"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M14 24.5L21 31L34 17"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="relative mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
            {lang === "ID"
              ? "Pembayaran Terkonfirmasi"
              : "Payment Confirmed"}
          </p>

          <h2
            id="payment-success-title"
            className="relative mt-2 text-[25px] font-extrabold tracking-tight"
          >
            {lang === "ID"
              ? "Pembayaran Berhasil!"
              : "Payment Successful!"}
          </h2>

          <p className="relative mx-auto mt-2 max-w-[300px] text-sm leading-6 text-blue-100">
            {lang === "ID"
              ? "Terima kasih. Pembayaran janji temu Anda telah berhasil kami konfirmasi."
              : "Thank you. Your appointment payment has been successfully confirmed."}
          </p>
        </div>

        {/* Payment details */}
        <div className="-mt-5 relative mx-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  d="M5 12.5L9.5 17L19 7.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">
                {lang === "ID"
                  ? "Status pembayaran"
                  : "Payment status"}
              </p>
              <p className="mt-1 text-sm font-bold text-emerald-600">
                {lang === "ID"
                  ? "Berhasil dibayar"
                  : "Paid successfully"}
              </p>
            </div>
          </div>

          {payment.appointmentNo && (
            <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
              <p className="text-xs text-slate-500">
                {lang === "ID"
                  ? "Nomor Appointment"
                  : "Appointment Number"}
              </p>
              <p className="mt-1 break-all text-sm font-bold text-[#182772]">
                {payment.appointmentNo}
              </p>
            </div>
          )}

          {formatRupiah(payment.amount) && (
            <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
              <p className="text-xs text-slate-500">
                {lang === "ID"
                  ? "Total pembayaran"
                  : "Total payment"}
              </p>
              <p className="mt-1 text-xl font-extrabold text-[#182772]">
                {formatRupiah(payment.amount)}
              </p>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="px-5 pb-6 pt-5">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full rounded-xl bg-[#182772] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/15 transition hover:bg-[#263c91] active:scale-[0.99]"
          >
            {lang === "ID"
              ? "Mengerti"
              : "Got it"}
          </button>

          <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
            {lang === "ID"
              ? "Simpan nomor appointment Anda untuk keperluan kunjungan."
              : "Keep your appointment number for your visit."}
          </p>
        </div>
      </div>
    </div>
  );
}