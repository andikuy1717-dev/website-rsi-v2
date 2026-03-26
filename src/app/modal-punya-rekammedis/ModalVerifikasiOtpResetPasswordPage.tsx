"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { validateResetOtpEmail } from "@/services/ValidateResetPasswordOtpEmail";
import { sendResetOtpEmail } from "@/services/SendOtpResetPasswordEmail";

export default function ModalVerifikasiOtpResetPasswordPage({email, onClose, onVerified, }: { email: string; onClose: () => void; onVerified: () => void; }) {
  const [otp, setOtp] = useState("");
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
   if (secondsLeft <= 0) {
     setCanResend(true);
     return;
   }

   const timer = setTimeout(() => {
     setSecondsLeft((prev) => prev - 1);
   }, 1000);

   return () => clearTimeout(timer);
 }, [secondsLeft]);

  const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
 };

  const mapValidateOtpErrorMessage = (result: any) => {
    switch (result.errorCode) {
        case "INVALID_OTP":
            return t.otpTidakValidResetPasswordEmail; // ID: OTP salah / kadaluarsa
        case "SERVER_ERROR":
            return t.serverError; // ID: Kesalahan server
        default:
            return (
                result.message ||
                result.errorMessages ||
                t.gagalVerifikasiOtpResetPasswordEmail
            );
        }
    };

  const handleVerify = async () => {
    if (otp.length !== 6) {
        Swal.fire({
        icon: "warning",
        title: t.wajibIsiOtp,
        text: t.masukanDigitOtp,
        });
        return;
    }

    Swal.fire({
        title: t.memverifikasiOtp,
        allowOutsideClick: false,
        didOpen: () => {
        Swal.showLoading();
        },
    });

    try {
        const result = await validateResetOtpEmail(email, otp);

        Swal.close();

        if (result.status === "OK") {
        Swal.fire({
            icon: "success",
            title: t.otpValid,
            text: t.otpBerhasilDiverifikasi,
            timer: 2000,
            showConfirmButton: true,
        }).then(() => {
            setTimeout(() => {
                onVerified(); // ⬅️ pindah ke modal reset password
            }, 200); // kecil aja biar smooth
        });

    } else {
        Swal.fire({
            icon: "error",
            title: t.gagalKirimOtp,
            text: mapValidateOtpErrorMessage(result),
        });
        }
    } catch (error) {
        Swal.close();
        Swal.fire({
            icon: "error",
            title: t.serverErrorNoBE,
            text: t.gagalVerifikasiOtpResetPasswordEmail,
        });
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    Swal.fire({
        title: t.sedangOtp,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
    });

    try {
        const result = await sendResetOtpEmail(email);

        Swal.close();

        if (result.status === "SUCCESS" || result.status === "OK") {
        Swal.fire({
            icon: "success",
            title: t.berhasilKirimOtp,
            text: t.pesanSuksesKirimOtp,
            timer: 1500,
            showConfirmButton: true,
        });

        // 🔥 reset timer
        setSecondsLeft(60);
        setCanResend(false);
        } else {
        Swal.fire({
            icon: "error",
            title: t.gagalKirimOtp,
            text:
            result.message ||
            result.errorMessages ||
            t.gagalKirimOtp,
        });
        }
    } catch (error) {
        Swal.close();
        Swal.fire({
        icon: "error",
        title: t.serverErrorNoBE,
        text: t.gagalKirimOtp,
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-lg text-center text-blue-800 mb-2">
          {t.verifikasiOTP}
        </h2>

        <p className="text-sm text-center text-gray-600 mb-4">
          {t.otpDikirimKe} <b>{email}</b>
        </p>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otp}
          onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // hapus selain angka
                setOtp(value);
          }}
          className="w-full border rounded-lg text-center tracking-widest text-xl py-2 mb-4 border-gray-400 placeholder-gray-400 text-black  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={t.masukanOTP}
        />

        <div className="text-center text-sm text-gray-600 mb-4">
            {!canResend ? (
                <span>
                 {t.belumMenerimaKode}{" "}
                    <span className="ml-1 font-mono text-[14px] font-semibold text-gray-800 tracking-widest">
                        {formatTime(secondsLeft)}
                    </span>
                </span>
            ) : (
                <button
                onClick={handleResendOtp}
                className="text-gray-800 hover:underline font-medium cursor-pointer"
                >
                {t.kirimUlang}
                </button>
            )}
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-blue-800 text-white rounded-lg py-2 hover:bg-blue-600 cursor-pointer"
        >
            {t.verifikasi}
        </button>
      </div>
    </div>
  );
}
