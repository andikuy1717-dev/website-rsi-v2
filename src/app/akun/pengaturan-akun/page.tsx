"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { FaUser, FaUsers, FaKey, FaTrash } from "react-icons/fa";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import Swal from "sweetalert2";


export default function PengaturanAkunPage() {
  const { medicalNo, token } = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const t = lang === "ID" ? ID : EN;

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: lang === "ID" ? "Hapus Akun?" : "Delete Account?",
      text:
        lang === "ID"
          ? "Akun yang dihapus tidak dapat dikembalikan."
          : "Deleted accounts cannot be recovered.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "gray",
      confirmButtonText: lang === "ID" ? "Ya, Hapus" : "Yes, Delete",
      cancelButtonText: lang === "ID" ? "Batal" : "Cancel",
      scrollbarPadding: false,
    });

    if (result.isConfirmed) {
      try {
        startLoading();

        const res = await fetch("/api/delete-account", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.status === "success") {
          await Swal.fire({
            icon: "success",
            title:
              lang === "ID"
                ? "Akun berhasil dihapus"
                : "Account deleted successfully",
            timer: 2000,
            showConfirmButton: false,
            scrollbarPadding: false,
          });

          router.push("/login");
        } else {
          Swal.fire({
            icon: "error",
            title: data.message,
            scrollbarPadding: false,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: lang === "ID" ? "Terjadi kesalahan" : "Something went wrong",
          scrollbarPadding: false,
        });
      } finally {
        endLoading();
      }
    }
  };

  useEffect(() => {
    if (!medicalNo || !token) return;

    const initPage = async () => {
        startLoading();

        try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
        console.error("Init Pengaturan Akun Page error:", error);
        } finally {
        endLoading();
        }
    };

    initPage(); 
  }, [medicalNo, token]);

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-black md:text-[16px] lg:text-[18px] xl:text-[20px]">
        {t.pengaturanAkunSaya}
      </h1>
 
      <button
        onClick={() => router.push("/akun/pengaturan-akun/profil")}
        className="w-full mb-4 flex items-center gap-3 bg-white py-3 px-4 rounded-2xl border border-gray-400 cursor-pointer transition-all duration-200 ease-in-out 
            hover:bg-blue-100"
        >
        <div className="flex justify-center items-center">
            <FaUser className="w-5 h-5 text-blue-900" />
        </div>
        <span className="flex-1 text-gray-700 font-medium whitespace-nowrap text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] text-left">
            Profil
        </span>
        <span className="text-blue-800 text-lg xl:text-2xl">›</span>
      </button>

      <button
        onClick={() => router.push("/akun/pengaturan-akun/tambah-anggota")}
        className="w-full mb-4 flex items-center gap-3 bg-white py-3 px-4 rounded-2xl border border-gray-400 cursor-pointer transition-all duration-200 ease-in-out 
            hover:bg-blue-100"
        >
        <div className="flex justify-center items-center">
            <FaUsers className="w-5 h-5 text-blue-900" />
        </div>
        <span className="flex-1 text-gray-700 font-medium whitespace-nowrap text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] text-left">
            {t.tambahAnggota}
        </span>
        <span className="text-blue-800 text-lg xl:text-2xl">›</span>
      </button>

      <button
        onClick={() => router.push("/akun/pengaturan-akun/ubah-kata-sandi")}
        className="w-full mb-4 flex items-center gap-3 bg-white py-3 px-4 rounded-2xl border border-gray-400 cursor-pointer transition-all duration-200 ease-in-out 
            hover:bg-blue-100"
        >
        <div className="flex justify-center items-center">
            <FaKey className="w-5 h-5 text-blue-900" />
        </div>
        <span className="flex-1 text-gray-700 font-medium whitespace-nowrap text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] text-left">
            {t.ubahKataSandi}
        </span>
        <span className="text-blue-800 text-lg xl:text-2xl">›</span>
      </button>

      <button
        onClick={handleDeleteAccount}
        className="w-full flex items-center gap-3 bg-white py-3 px-4 rounded-2xl border border-gray-400 cursor-pointer transition-all duration-200 ease-in-out 
            hover:bg-blue-100"
        >
        <div className="flex justify-center items-center">
            <FaTrash className="w-5 h-5 text-blue-900" />
        </div>
        <span className="flex-1 text-gray-700 font-medium whitespace-nowrap text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] text-left">
            {t.hapusAkun}
        </span>
        <span className="text-blue-800 text-lg xl:text-2xl">›</span>
      </button>


    </>
  );
}