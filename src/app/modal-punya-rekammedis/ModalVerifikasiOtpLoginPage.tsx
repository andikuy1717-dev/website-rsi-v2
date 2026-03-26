"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { loginWithOtp } from "@/services/LoginWithOtp";
import { sendLoginOtp } from "@/services/SendLoginOtp";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getPatientFirstName } from "@/services/FirstNamePatient";

export default function ModalVerifikasiOtpLoginPage({ email, onClose }: { email: string; onClose: () => void; }) {
  const [otp, setOtp] = useState("");
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  
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

  const handleVerifyOtp = async () => {
    if (!otp) {
      Swal.fire({
        icon: "warning",
        title: t.wajibIsiOtp,
      });
      return;
    }

    if (otp.length !== 6) {
        Swal.fire({
          icon: "warning",
          title: t.wajibIsiOtp,
          text: t.masukanDigitOtp,
         });
        return;
    }

    Swal.fire({
      title: t.mohonTungguSebentar,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const result = (await loginWithOtp(email, otp));

      if (result.status === "OK") {
        // 🔑 SAMAIN DENGAN LOGIN PASSWORD
        const token = result.data?.token || result.data?.user?.last_login_token;

        const medicalNo = result.data?.user?.medicalNo;

        const firstName = medicalNo ? await getPatientFirstName(medicalNo) : "User";

        if (token) {
          login({
            token,
            firstName: firstName ?? "User",
            medicalNo: result.data?.user?.medicalNo,
            email: result.data?.user?.email,
            noKK: result.data?.user?.noKK
          });
        }

        await Swal.fire({
          icon: "success",
          title: t.loginBerhasil,
          timer: 1500,
          showConfirmButton: false,
        });

        onClose();
        router.back(); // 🔥 balik ke halaman terakhir

      } else {
        Swal.fire({
          icon: "error",
          title: t.gagalKirimOtp,
          text: mapValidateOtpErrorMessage(result),
        });
      }
    } catch {
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
          const result = await sendLoginOtp(email);
  
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
          className="absolute top-3 right-3 text-gray-600 cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-center font-semibold mb-2 text-blue-800">
          {t.verifikasiOTPLogin}
        </h2>

         <p className="text-sm text-center text-gray-600 mb-4">
          {t.otpDikirimKe} <b>{email}</b>
        </p>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder={t.masukanOTP}
          value={otp}
          onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // hapus selain angka
                setOtp(value);
          }}
          className="w-full border rounded-lg text-center tracking-widest text-xl py-2 mb-4 border-gray-400 placeholder-gray-400 text-black  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          onClick={handleVerifyOtp}
          className="w-full bg-blue-800 text-white rounded-lg py-2 hover:bg-blue-600 cursor-pointer"
        >
          {t.verifikasi}
        </button>
      </div>
    </div>
  );
}
