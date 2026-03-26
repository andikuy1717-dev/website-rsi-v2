"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { GetFtpFilesResponse, getFtpFiles } from "@/services/GetHasilLab";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { viewHasilLab } from "@/services/GetFileHasilLab";

export default function HasilLabPage() {
  const { medicalNo, token } = useAuth();
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const [files, setFiles] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const extractJO = (fileName: string) => {
    const match = fileName.match(/(JO\d{6}-\d+)/);
    return match ? match[1] : "-";
  };

  useEffect(() => {
    if (!medicalNo || !token) return;

    const fetchData = async () => {
      startLoading();
      try {
        const result: GetFtpFilesResponse = await getFtpFiles(
          medicalNo,
          token
        );

        if (result.status === "SUCCESS" && result.data) {
          setFiles(result.data.files || []);
          setPagination(result.data.pagination || null);
        }
      } catch (err) {
        console.error("Fetch hasil lab error:", err);
      } finally {
        endLoading();
      }
    };

    fetchData();
  }, [medicalNo, token, currentPage]);

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-black md:text-[16px] lg:text-[18px] xl:text-[20px]">
        {t.hasilLab}
      </h1>

      {/* LIST FILE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.length === 0 && (
          <div className="text-gray-400">
            {t.tidakAdaHasilLab}
          </div>
        )}

        {files.map((item, index) => {
            const joNumber = extractJO(item.file_name);

            return (
                <div
                key={index}
                className="bg-white border border-gray-400 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                >
                {/* HEADER */}
                <div className="flex items-center gap-3 p-4">
                    <img
                    src="/Logo RSI.png"
                    alt="Logo RSI"
                    className="w-10 h-10 object-contain"
                    />

                    <div>
                    <p className="md:text-[12px] lg:text-[13px] xl:text-[14px] font-semibold text-gray-800">
                        {t.hasilLabCard} {joNumber}
                    </p>
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="px-4">
                    <div className="border-t border-gray-300" />
                </div>

                {/* FOOTER */}
                <div className="p-4">
                    <button
                    onClick={() => viewHasilLab(item.file_name, token!)}
                    className="w-full px-4 py-2 bg-blue-800 text-white md:text-[12px] lg:text-[14px] xl:text-[16px] rounded-lg hover:bg-blue-500 transition cursor-pointer"
                    >
                    {t.lihatHasilLab}
                    </button>
                </div>
                </div>
            );
        })}
      </div>

      {/* PAGINATION */}
      {pagination && pagination.last_page > 1 && (
      <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">

            {/* PREV */}
            <button
            onClick={() =>
                setCurrentPage((prev) =>
                Math.max(1, prev - 1)
                )
            }
            disabled={currentPage === 1}
            className={`
                px-3 py-2 rounded-lg border text-sm
                ${
                currentPage === 1
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-gray-700 border-gray-400 hover:bg-gray-100"
                }
            `}
            >
            ‹
            </button>
            {/* PAGE NUMBER */}
            {Array.from(
            { length: Math.min(5, pagination.last_page) },
            (_, i) => {
                const start = Math.max(
                1,
                Math.min(
                    currentPage - 2,
                    pagination.last_page - 4
                )
                );

                return start + i;
            }
            )
            .filter(
                (page) =>
                page >= 1 &&
                page <= pagination.last_page
            )
            .map((page) => (
                <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`
                    px-3 py-2 rounded-lg text-sm border
                    ${
                    currentPage === page
                        ? "bg-blue-900 text-white border-blue-900"
                        : "text-gray-700 border-gray-400 hover:bg-gray-100"
                    }
                `}
                >
                {page}
                </button>
            ))}

            {/* NEXT */}
            <button
            onClick={() =>
                setCurrentPage((prev) =>
                Math.min(
                    pagination.last_page,
                    prev + 1
                )
                )
            }
            disabled={
                currentPage === pagination.last_page
            }
            className={`
                px-3 py-2 rounded-lg border text-sm
                ${
                currentPage === pagination.last_page
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-gray-700 border-gray-400 hover:bg-gray-100"
                }
            `}
            >
            ›
            </button>
        </div>
        )}
    </>
  );
}