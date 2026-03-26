"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { resetNewPasswordByEmail } from "@/services/ResetNewPasswordEmail";

export default function ModalResetPasswordPage({ email, onClose, onSuccess }: { email: string; onClose: () => void; onSuccess: () => void; }) {
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  

  const mapResetPasswordError = (result: any) => {
    switch (result.errorCode) {
        case "VALIDATION_ERROR":
        return t.passwordTidakSama

        case "USER_NOT_FOUND":
        return t.penggunaTidakDitemukan;

        case "SERVER_ERROR":
        return t.serverError;

        default:
        return (
            result.message ||
            result.errorMessages ||
            t.serverError
        );
    }
 };

  const handleSubmit = async () => {
    // 🔐 validasi FE
    if (!password || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: t.validPwBaru,
        text: t.wajibIsiPw,
      });
      return;
    }

    if (password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: t.titlePasswordvalidate,
        text: t.pwKarakterMinDelapan,
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: t.titlePasswordvalidate,
        text: t.passwordTidakSama,
      });
      return;
    }

    Swal.fire({
      //title: t.menyimpanPassword,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const result = await resetNewPasswordByEmail(email, password);

      Swal.close();

      if (result.status === "OK") {
        Swal.fire({
          icon: "success",
          title: t.titlePWBerhasilDiubah,
          text: t. passwordBerhasilDiubah,
          timer: 2000,
          showConfirmButton: true,
        }).then(() => {
          onSuccess(); // ⬅️ BALIK KE LOGIN
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t.titlePasswordvalidate,
          text: mapResetPasswordError(result),
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: t.serverErrorNoBE,
        text: t.serverError,
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
          Reset Password
        </h2>

        <p className="text-sm text-center text-gray-600 mb-4">
          Email: <b>{email}</b>
        </p>

        <div className="relative mb-3">
            <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordBaru}
                className="
                w-full border rounded-lg
                pl-3 pr-10 py-2
                text-black placeholder-gray-400
                border-gray-400
                focus:ring-2 focus:ring-blue-500
                focus:outline-none transition
                "
            />

            {/* EYE ICON */}
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-black hover:text-black cursor-pointer"
            >
                {showPassword ? (
                /* EYE OFF */
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
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12
                        C3.226 15.338 6.4 18 12 18
                        c1.858 0 3.596-.385 5.096-1.07
                        M6.53 6.53A9.969 9.969 0 0 1 12 6
                        c5.6 0 8.774 2.662 10.066 6
                        a10.523 10.523 0 0 1-4.293 5.774
                        M6.53 6.53 3 3
                        m3.53 3.53 3.88 3.88
                        m7.06 7.06L21 21"
                    />
                </svg>
                ) : (
                /* EYE */
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
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639
                        C3.423 7.51 7.36 4.5 12 4.5
                        c4.638 0 8.573 3.007 9.963 7.178
                        .07.207.07.431 0 .639
                        C20.577 16.49 16.64 19.5 12 19.5
                        c-4.638 0-8.573-3.007-9.964-7.178Z"
                    />
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0
                        3 3 0 0 1 6 0Z"
                    />
                </svg>
                )}
            </button>
        </div>

        <div className="relative mb-4">
            <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.konfirmasiPasswordBaru}
                className="
                w-full border rounded-lg
                pl-3 pr-10 py-2
                text-black placeholder-gray-400
                border-gray-400
                focus:ring-2 focus:ring-blue-500
                focus:outline-none transition
                "
            />

            {/* EYE ICON */}
            <button
                type="button"
                onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute inset-y-0 right-3 flex items-center text-black cursor-pointer"
            >
                {showConfirmPassword ? (
                /* EYE OFF */
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
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12
                        C3.226 15.338 6.4 18 12 18
                        c1.858 0 3.596-.385 5.096-1.07
                        M6.53 6.53A9.969 9.969 0 0 1 12 6
                        c5.6 0 8.774 2.662 10.066 6
                        a10.523 10.523 0 0 1-4.293 5.774
                        M6.53 6.53 3 3
                        m3.53 3.53 3.88 3.88
                        m7.06 7.06L21 21"
                    />
                </svg>
                ) : (
                /* EYE */
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
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639
                        C3.423 7.51 7.36 4.5 12 4.5
                        c4.638 0 8.573 3.007 9.963 7.178
                        .07.207.07.431 0 .639
                        C20.577 16.49 16.64 19.5 12 19.5
                        c-4.638 0-8.573-3.007-9.964-7.178Z"
                    />
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0
                        3 3 0 0 1 6 0Z"
                    />
                </svg>
                )}
            </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-800 text-white rounded-lg py-2 hover:bg-blue-600 cursor-pointer"
        >
          {t.simpanPassword}
        </button>
      </div>
    </div>
  );
}
