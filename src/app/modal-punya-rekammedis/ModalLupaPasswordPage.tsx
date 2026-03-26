"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";
import { sendResetOtpEmail, SendOtpResponse } from "@/services/SendOtpResetPasswordEmail";

export default function ModalLupaPasswordPage({ onClose, onBack, direction, onSuccessOtp, }: { onClose: () => void; onBack: () => void; direction: "left" | "right"; onSuccessOtp: (email: string) => void; }) {
  const [closing, setClosing] = useState(false);
  const [email, setEmail] = useState("");
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const mapSendOtpErrorMessage = (
    result: SendOtpResponse,
      emailInput?: string
    ) => {

    // 1️⃣ VALIDASI FRONTEND (PALING CEPAT)
    if (emailInput && !emailInput.includes("@")) {
      return t.formatEmailTidakValid;
    }

    // 2️⃣ VALIDASI DARI BACKEND
    switch (result.errorCode) {
      case "VALIDATION_ERROR":
        // fallback: backend bilang email tidak valid / tidak terdaftar
        return t.emailTidakValid;

      case "EMAIL_SEND_ERROR":
        return t.serverError;

      default:
        return result.message || t.gagalKirimOtp;
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: t.emailWajibDiisi,
        confirmButtonColor: "#1e40af",
      });
      return;
    }

    Swal.fire({
      title: t.sedangOtp,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  

    try {
      const result: SendOtpResponse = await sendResetOtpEmail(email);

      Swal.close();

      if (result.status === "SUCCESS") {
        Swal.fire({
          icon: "success",
          title: t.berhasilKirimOtp,
          text: t.pesanSuksesKirimOtp,
          confirmButtonColor: "#1e40af",
          timer: 1500,
          showConfirmButton: true,
        }).then(() => {
          onSuccessOtp(email);      // buka modal OTP
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t.gagalKirimOtp,
          text: mapSendOtpErrorMessage(result, email),
          confirmButtonColor: "#1e40af",
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: t.gagalKirimOtp,
        text: t.serverErrorNoBE,
      });
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40
      ${closing ? "animate-overlay-out" : "animate-overlay"}`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl relative
        ${closing ? "animate-modal-out" : "animate-modal"}`}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-black cursor-pointer"
        >
          ✕
        </button>

        {/* ICON EMAIL */}
        <div className="flex justify-center mb-4">
            <img
              src="/email.jpg"
              alt="Email Reset"
              className="h-full w-60 object-cover"
            />
        </div>

        <p className="text-lg text-blue-800 text-center mb-2">
          {t.lupaKataSandi}
        </p>

        <p className="text-sm text-gray-600 text-center mb-5">
          {t.emailNomorVerifikasi}
        </p>

      {/* INPUT EMAIL / RM */}
      <div className="relative mb-3 group">
        <span
          className="
            absolute inset-y-0 left-3 flex items-center
            text-black
            transition-colors
          "
        >
          {/* Icon Mail */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 7.5v9a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 16.5v-9m19.5 0A2.25 2.25 0 0 0 19.5 5.25H4.5A2.25 2.25 0 0 0 2.25 7.5m19.5 0-9.75 6.75L2.25 7.5"
            />
          </svg>
        </span>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg
            pl-10 pr-3 py-2
            text-black placeholder-gray-400
            border-gray-400
            focus:ring-2 focus:ring-blue-500
            focus:border-blue-500
            focus:outline-none transition" 
        />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-800 text-white rounded-lg p-2 hover:bg-blue-600 cursor-pointer"
        >
          {t.kirim}
        </button>

        <button
          onClick={onBack}
          className="w-full mt-3 text-sm text-black hover:underline"
        >
          {t.kembaliKeLogin}
        </button>
      </div>
    </div>
  );
}
