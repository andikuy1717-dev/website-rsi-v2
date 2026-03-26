"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { changePassword } from "@/services/ChangePassword";

export default function UbahKataSandiPage() {
  const router = useRouter();
  const { medicalNo, token } = useAuth();

  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const errorMessageMap: Record<string, { ID: string; EN: string }> = {
    "Old password does not match.": {
        ID: "Password lama tidak cocok",
        EN: "Old password does not match",
    }
  };

  useEffect(() => {
    if (!medicalNo || !token) return;

    const initPage = async () => {
      startLoading();

      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error("Init Ubah Kata Sandi Page error:", error);
      } finally {
        endLoading();
      }
    };

    initPage();
  }, [medicalNo, token]);

  const submitChangePassword = async () => {

    if (!oldPassword || !newPassword || !confirmPassword) {
        Swal.fire({
        icon: "warning",
        title: t.formBelumLengkap,
      scrollbarPadding: false,
    });
    return;
  }

    if (newPassword.length < 6) {
        Swal.fire({
        icon: "error",
        title: lang === "ID"
          ? "Gagal Mengubah Password"
          : "Failed Change Password",
        text: lang === "ID"
          ? "Password minimal 6 karakter"
          : "Password must be at least 6 characters",
        scrollbarPadding: false,
    });
    return;
   }

    if (newPassword !== confirmPassword) {
        Swal.fire({
        icon: "error",
        title: lang === "ID"
          ? "Gagal Mengubah Password"
          : "Failed Change Password",
        text: lang === "ID"
          ? "Konfirmasi Kata Sandi Tidak Cocok dengan Kata Sandi Baru"
          : "Confirm Password Does Not Match New Password",
        scrollbarPadding: false,
    });
    return;
  }

  startLoading();

  try {
    const result = await changePassword({
      token: token!,
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    });

    if (result.status === "success") {

       endLoading(); // STOP loading dulu

       await Swal.fire({
            icon: "success",
            title: lang === "ID"
            ? "Berhasil"
            : "Success",
            text: lang === "ID"
            ? "Password berhasil diubah"
            : "Password successfully changed",
            confirmButtonColor: "#1e3a8a",
            scrollbarPadding: false,
        });

        router.push("/akun/pengaturan-akun")

    } else {

    const mappedMessage =
        errorMessageMap[result.message]?.[lang] || result.message;

      Swal.fire({
        icon: "error",
        title: lang === "ID"
          ? "Gagal mengubah password"
          : "Failed to change password",
        text: mappedMessage,
        scrollbarPadding: false,
      });

    }

  } catch (error) {

    endLoading();

    Swal.fire({
      icon: "error",
      title: lang === "ID"
        ? "Terjadi kesalahan server"
        : "Server error occurred",
      scrollbarPadding: false,
    });

   }

  };

  return (
    <>
      <h1 className="text-xl font-bold mb-6 text-black md:text-[16px] lg:text-[18px] xl:text-[20px]">
        {lang === "ID" ? "Ubah Kata Sandi" : "Change Password"}
      </h1>

      <div className="bg-white border border-gray-300 rounded-xl p-6 max-w-xl">

        <div className="space-y-5">

          {/* Password Lama */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              {lang === "ID" ? "Kata Sandi Lama" : "Old Password"}
            </label>

            <div className="flex items-center border border-gray-400 rounded-lg px-4 py-2 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200">
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full outline-none text-black"
                placeholder={t.masukanKataSandiLama}
              />

              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="text-gray-500 cursor-pointer"
              >
                {showOld ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Password Baru */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              {lang === "ID" ? "Kata Sandi Baru" : "New Password"}
            </label>

            <div className="flex items-center border border-gray-400 rounded-lg px-4 py-2 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full outline-none text-black"
                placeholder={t.masukanKataSandiBaru}
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="text-gray-500 cursor-pointer"
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              {lang === "ID" ? "Konfirmasi Kata Sandi Baru" : "Confirm New Password"}
            </label>

            <div className="flex items-center border border-gray-400 rounded-lg px-4 py-2 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full outline-none text-black"
                 placeholder={t.masukanKonfirmasiSandiBaru}
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-gray-500 cursor-pointer"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

        </div>

        {/* BUTTON */}
        <div className="flex justify-end mt-6">

          <button
            onClick={submitChangePassword}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition cursor-pointer"
          >
            {lang === "ID" ? "Ubah Kata Sandi" : "Change Password"}
          </button>

        </div>

      </div>
    </>
  );
}