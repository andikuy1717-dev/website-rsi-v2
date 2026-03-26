"use client";

import { useState } from "react";
import { loginUser } from "@/services/LoginUser";
import Swal from "sweetalert2";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useLang } from "@/context/LanguageContext";
import type { LoginResponse } from "@/services/LoginUser";
import { getPatientFirstName } from "@/services/FirstNamePatient";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ModalPunyaRMPage({ onClose, onForgot, direction, onHelp, onLoginOtp }: { onClose: () => void; onForgot: () => void; onHelp: () => void; onLoginOtp: () => void; direction: "left" | "right"; }) {
  const [closing, setClosing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrMedical, setEmailOrMedical] = useState("");
  const [password, setPassword] = useState("");
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const { login } = useAuth();
  const router = useRouter();

  const mapLoginErrorMessage = (result: LoginResponse) => {
    switch (result.errorCode) {
      case "401":
        if (result.message?.toLowerCase().includes("password")) {
          return t.emailKataSandiSalah;
        }

        if (result.message?.toLowerCase().includes("user")) {
          return t.userTidakDitemukan;
        }

        return t.loginGagal;

      case "500":
       return t.serverError;

      default:
        return result.errorMessages || t.loginGagal;
    }
  };

  const handleLogin = async () => {
    // VALIDASI KOSONG
    if (!emailOrMedical || !password) {
      Swal.fire({
        icon: "warning",
        title: t.formBelumLengkap,
        text: t.wajibIsiForm,
        confirmButtonColor: "#1e40af",
      });
      return;
    }

    // LOADING
    Swal.fire({
      title: t.sedangMasuk,
      text: t.mohonTungguSebentar,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const result = await loginUser(emailOrMedical, password);

      Swal.close();

      if (result.status === "OK") {

        const token = result.data?.token || result.data?.user?.last_login_token;
        const medicalNo = result.data?.user?.medicalNo;
        const id = result.data?.user?.id;
        const firstName = medicalNo ? await getPatientFirstName(medicalNo) : null;

        if (!token || !id) {
          Swal.fire({
            icon: "error",
            title: t.loginGagal,
            text: "Data user tidak valid",
          });
          return;
        }

        if (token) {
          login({
            id,
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
          timer: 1200,
          showConfirmButton: false,
        });

        onClose();
        router.back();

      } else {
        Swal.fire({
          icon: "error",
          title: t.loginGagal,
          text: mapLoginErrorMessage(result),
          confirmButtonColor: "#1e40af",
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: t.loginGagal,
        text: t.serverErrorNoBE,
      });
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40
        ${closing ? "animate-overlay-out" : "animate-overlay"}
      `}
      onClick={handleClose}
    >
      {/* Card Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl relative
          ${closing ? "animate-modal-out" : "animate-modal"}
        `}
      >
        {/* Tombol close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-black cursor-pointer transition"
        >
          ✕
        </button>

        {/* LOGO */}
        <div className="flex justify-center mb-5">
          <img
            src="/Logo RSI.png"
            alt="Logo RSI"
            className="h-20 object-contain"
          />
        </div>

        {/* BUTTON OTP */}
        <button onClick={onLoginOtp} className="w-full border border-gray-500 text-gray-600 rounded-lg p-2 font-medium hover:bg-gray-200 transition mb-4 cursor-pointer flex items-center justify-center gap-2">
          {/* Icon Key (OTP / Secure Login) */}
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

          <span>{t.loginMenggunakanOtp}</span>
        </button>

        {/* DIVIDER */}
        <div className="flex items-center my-4">
          <div className="grow h-px bg-gray-400"></div>
          <span className="px-3 text-sm text-gray-600">{t.Atau}</span>
          <div className="grow h-px bg-gray-400"></div>
        </div>

        {/* INPUT EMAIL / RM */}
        <div className="relative mb-3">
          <span className="absolute inset-y-0 left-3 flex items-center text-black">
            {/* Icon User / Mail */}
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
            type="text"
            placeholder={t.loginDenganEmail_RekamMedis}
            value={emailOrMedical}
            onChange={(e) => setEmailOrMedical(e.target.value)}
            className="
              w-full border rounded-lg
              pl-10 pr-3 py-2
              text-black placeholder-gray-400
              border-gray-400
              focus:ring-2 focus:ring-blue-500
              focus:outline-none transition
            "
          />
        </div>

      {/* INPUT PASSWORD */}
        <div className="relative mb-1">
          {/* Icon Lock */}
          <span className="absolute inset-y-0 left-3 flex items-center text-black">
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
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 0h10.5A1.5 1.5 0 0 1 18.75 12v7.5A1.5 1.5 0 0 1 17.25 21h-10.5A1.5 1.5 0 0 1 5.25 19.5V12a1.5 1.5 0 0 1 1.5-1.5Z"
              />
            </svg>
          </span>

          <input
            type={showPassword ? "text" : "password"}
            placeholder={t.kataSandi}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full border rounded-lg
              pl-10 pr-10 py-2
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
            className="absolute inset-y-0 right-3 flex items-center text-black hover:text-black transition cursor-pointer"
          >
            {showPassword ? (
              /* Eye Off */
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
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 15.338 6.4 18 12 18c1.858 0 3.596-.385 5.096-1.07M6.53 6.53A9.969 9.969 0 0 1 12 6c5.6 0 8.774 2.662 10.066 6a10.523 10.523 0 0 1-4.293 5.774M6.53 6.53 3 3m3.53 3.53 3.88 3.88m7.06 7.06L21 21"
                />
              </svg>
            ) : (
              /* Eye */
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
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* LUPA PASSWORD */}
        <div className="flex justify-end mb-5">
          <button
            type="button"
            onClick={onForgot}
            className="text-sm text-blue-600 hover:underline hover:text-blue-900 transition"
          >
            {t.lupaKataSandi}
          </button>
        </div>

        {/* BUTTON LOGIN */}
        <button onClick={handleLogin} className="w-full bg-blue-800 text-white rounded-lg p-2 hover:bg-blue-600 transition cursor-pointer">
          {t.masuk}
        </button>

        {/* BUTUH BANTUAN */}
       <div onClick={onHelp} className="flex justify-center items-center gap-2 mt-7 cursor-pointer hover:opacity-80 transition">
          <span className="text-sm text-gray-700 font-medium">
            {t.butuhBantuan}
          </span>
          <img
            src="/cs.png"
            alt="Customer Service"
            className="h-5 w-5 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
