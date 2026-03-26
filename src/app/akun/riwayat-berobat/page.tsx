"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { getPatientRegistrationHistory } from "@/services/GetPatientRegistrationHistory";
import { startLoading, endLoading } from "@/utils/LoadingManager";

const ITEMS_PER_PAGE = 6;

export default function RiwayatBerobatPage() {
  const { medicalNo } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
  if (!medicalNo) return;

  const fetchData = async () => {
    startLoading();

      try {
        const res = await getPatientRegistrationHistory({ medicalNo });

        if (res?.data) {
          setData(res.data);
          setCurrentPage(1); // reset ke halaman 1
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Gagal ambil riwayat berobat:", error);
        setData([]);
      } finally {
        endLoading(); // 🔥 PASTI kepanggil
      }
    };

    fetchData();
  }, [medicalNo]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (rawDate: string, registrationTime?: string) => {
    if (!rawDate) return "-";

    const timestamp = Number(rawDate.replace(/[^0-9]/g, ""));
    if (!timestamp) return rawDate;

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return rawDate;

    // format tanggal & hari
    const datePart = new Intl.DateTimeFormat(
      lang === "ID" ? "id-ID" : "en-US",
      {
        weekday: lang === "ID" ? "long" : "short",
        day: "2-digit",
        month: lang === "ID" ? "long" : "short",
        year: "numeric",
      }
    ).format(date);

    // ambil jam & menit dari RegistrationTime
    let timePart = "";
    if (registrationTime) {
      // handle "HH:mm" atau "HH:mm:ss"
      timePart = registrationTime.substring(0, 5);
    }

    // gabungkan
    if (timePart) {
      return lang === "ID"
        ? `${datePart} pukul ${timePart}`
        : `${datePart}, ${timePart}`;
    }

    return datePart;
  };

  const formatRegistrationType = (type?: string) => {
    if (!type) return "-";

    switch (type.toUpperCase()) {
      case "OPR":
        return "Rawat Jalan";
      case "IPR":
        return "Rawat Inap";
      case "EMR":
        return "Emergency";
      default:
        return type; // fallback kalau ada kode lain
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-black md:text-[16px] lg:text-[18px] xl:text-[20px]">
        {t.riwayatBerobat}
      </h1>

      {data.length === 0 ? (
        <p className="text-gray-400">{t.tidakAdaRiwayatBerobat}</p>
      ) : (
        <>
          {/* CARD GRID */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
            {paginatedData.map((item, index) => (
              <div
                key={index}
                className="relative border border-gray-400 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
              >
                {/* LOGO */}
                <img
                  src="/Logo RSI.png"
                  alt="RSI Logo"
                  className="absolute top-3 right-3 w-8 h-8 object-contain opacity-90"
                />

                <div className="font-semibold text-black mb-1 text-[14px] sm:text-[14px] md:text-[14px] lg:text-[13px] xl:text-[14px]">
                  {item.RegistrationNo}
                </div>

                <div className="text-[12px] sm:text-[12px] md:text-[12px] lg:text-[11px] xl:text-[12px] text-gray-400 mt-1">
                  {formatDate(item.RegistrationDate, item.RegistrationTime)}
                </div>

                <div className="border-t border-gray-300 my-2"></div>

                <div className="text-[13px] sm:text-[13px] md:text-[13px] lg:text-[12px] xl:text-[13px] text-black mb-1">
                  <span>{item.ParamedicName || "-"}</span>
                </div>

                <div className="text-[12px] sm:text-[12px] md:text-[12px] lg:text-[11px] xl:text-[12px] text-gray-400">
                  {item.ServiceUnitName}{" "}
                  <span className="text-gray-400 font-normal">
                    — {formatRegistrationType(item.SRRegistrationType)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
              {/* PREV */}
              <button
                onClick={() =>
                  handlePageChange(Math.max(1, currentPage - 1))
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
                { length: Math.min(5, totalPages) },
                (_, i) => {
                  const start = Math.max(
                    1,
                    Math.min(currentPage - 2, totalPages - 4)
                  );

                  return start + i;
                }
              )
                .filter(page => page >= 1 && page <= totalPages)
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
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
                  handlePageChange(
                    Math.min(totalPages, currentPage + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className={`
                  px-3 py-2 rounded-lg border text-sm
                  ${
                    currentPage === totalPages
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
      )}
    </>
  );
}