"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { sendLoginOtp } from "@/services/SendLoginOtp";
import type { SendLoginOtpResponse } from "@/services/SendLoginOtp";

export default function LoginPakaiOtp({ onClose, onBack, onSuccess, }: { onClose: () => void; onBack: () => void; onSuccess: (email: string) => void; }) {
  const [closing, setClosing] = useState(false);
  const [email, setEmail] = useState("");
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const mapOtpErrorMessage = (
    result: SendLoginOtpResponse, emailInput: string) => {

    // 1️⃣ Validasi frontend (tanpa ke backend)
    if (!isValidEmail(emailInput)) {
        return t.formatEmailTidakValid;
    }

    // 2️⃣ Mapping backend
    switch (result.errorCode) {
        case "VALIDATION_ERROR":
        return t.emailTidakValid; // email tidak aktif / tidak terdaftar

        case "MAIL_ERROR":
        return t.gagalKirimOtp;

        default:
        return result.message || t.serverError;
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  const handleKirimOtp = async () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: t.formBelumLengkap,
        text: t.emailWajibDiisi,
        confirmButtonColor: "#1e40af",
      });
      return;
    }

     if (!isValidEmail(email)) {
        Swal.fire({
        icon: "error",
        title: t.loginGagal,
        text: t.formatEmailTidakValid,
        confirmButtonColor: "#1e40af",
        });
        return;
    }

    Swal.fire({
      title: t.mohonTungguSebentar,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const result = await sendLoginOtp(email);

    try {
      if (result.status === "OK") {
        Swal.fire({
            icon: "success",
            text: t.pesanSuksesKirimOtp,
            timer: 1500,
            showConfirmButton: false,
        });

        onSuccess(email);

     } else {
        Swal.fire({
            icon: "error",
            title: t.loginGagal,
            text: mapOtpErrorMessage(result, email),
        });
    }

    } catch (e) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: t.loginGagal,
        text: t.serverErrorNoBE,
      });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40
        ${closing ? "animate-overlay-out" : "animate-overlay"}
      `}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl relative
          ${closing ? "animate-modal-out" : "animate-modal"}
        `}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black transition cursor-pointer"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-1">
          <img src="/login_otp.jpg" alt="Login OTP" className="h-40" />
        </div>

        <h2 className="text-center text-sm mb-3 text-gray-600">
          {t.silahkanMasukanEmailLoginOtp}
        </h2>

        {/* Email Input */}
        <div className="relative mb-5">
          <span className="absolute inset-y-0 left-3 flex items-center text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
            {/* Envelope */}
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 7.5v9a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 16.5v-9m19.5 0L12 13.5 2.25 7.5"
            />
            {/* Arrow In */}
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v6m0 0 2.25-2.25M12 9 9.75 6.75"
            />
            </svg>
          </span>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full border rounded-lg
              pl-10 pr-3 py-2
              border-gray-400
              focus:ring-2 focus:ring-blue-500
              focus:outline-none
              placeholder-gray-400
              text-black
            "
          />
        </div>

        {/* Button Kirim OTP */}
        <button
          onClick={handleKirimOtp}
          className="w-full bg-blue-800 text-white rounded-lg p-2 hover:bg-blue-600 transition cursor-pointer"
        >
         {t.kirimOtp}
        </button>

        {/* Back */}
        <button
          onClick={onBack}
          className="w-full mt-3 text-sm text-gray-600 hover:underline"
        >
          {t.btnKembali}
        </button>
      </div>
    </div>
  );
}
