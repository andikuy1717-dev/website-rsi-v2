"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/services/GetTransactionPatient";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { startLoading, endLoading } from "@/utils/LoadingManager";

const mapTransactionErrorMessage = (result: any, t: any) => {
  switch (result.errorCode) {
    case "400":
      return t.permintaanTidakValid;
    case "401":
      return t.sesiBerakhir;
    case "404":
      return t.dataTidakDitemukan;
    case "500":
      return t.serverError;
    default:
      return result.errorMessages || result.message || t.gagalAmbilData;
  }
};

export default function RiwayatTransaksiPage() {
  const { token, medicalNo, logout } = useAuth();
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Buat formatter di atas component
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // biar nggak ada koma
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // fallback kalau invalid

    return new Intl.DateTimeFormat(
      lang === "ID" ? "id-ID" : "en-US",
      {
        weekday: lang === "ID" ? "long" : "short",
        day: "2-digit",
        month: lang === "ID" ? "long" : "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(date);
  };

  useEffect(() => {
    if (!token || !medicalNo) {
      return;
    }

    const fetchData = async () => {
      startLoading(); // 🔥 Mulai top progress bar
      try {
        const res = await getTransactions(medicalNo, token);

        // 🔥 kalau session habis
        if (res?.errorCode === "401") {
          const msg = mapTransactionErrorMessage(res, t);
          Swal.fire({
            icon: "warning",
            title: msg.sesiBerakhir,
            confirmButtonColor: "#1e40af",
          }).then(() => {
            logout(); // otomatis redirect login
          });
          return;
        }

        if (res.status !== "OK") {
          const msg = mapTransactionErrorMessage(res, t);
          Swal.fire({
            icon: "error",
            title: t.gagalAmbilData,
            text: msg,
            confirmButtonColor: "#1e40af",
          });
          setError(msg);
          return;
        }

        setData(res.data || []);
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: t.gagalAmbilData,
          text: t.serverErrorNoBE,
          confirmButtonColor: "#1e40af",
        });
        setError(t.serverErrorNoBE);
      } finally {
        endLoading(); // 🔥 Selesai top progress bar
      }
    };

    fetchData();
  }, [token, medicalNo, lang]);

  // Ambil data untuk page saat ini
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">

      <h1 className="md:text-[16px] lg:text-[18px] xl:text-[20px] font-bold mb-4 text-black">
        {t.riwayatTransaksi}
      </h1>

      {error && <p className="text-red-600">{error}</p>}
      {!error && data.length === 0 && <p className="text-gray-400">{t.tidakAdaRiwayatTransaksi}</p>}

      {!error && data.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
            {paginatedData.map((item) => {
              // Tentukan status display
              let displayStatus = item.status;
              let statusColor = item.status.startsWith("unpaid")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700";

              // Jika status = "unpaid canceled", rubah jadi "Batal"
              if (item.status.toLowerCase() === "unpaid(canceled)") {
                displayStatus = t.Batal;
                statusColor = "bg-red-100 text-red-700";
              }

              if (item.status.toLowerCase() === "unpaid") {
                displayStatus = t.menungguPembayaran;
                statusColor = "bg-gray-800 text-white";
              }

              if (item.status.toLowerCase() === "paid") {
                displayStatus = t.sudahDibayar;
                statusColor = "bg-green-100 text-green-700";
              }

              // Jika service unit Rehabilitasi Medis, ubah status jadi type
              if (
                item.serviceUnitName.toLowerCase() === "rehabilitasi medis" ||
                item.serviceUnitName.toLowerCase() === "rehab medis"
              ) {
                const typeLower = item.type?.toLowerCase();

                displayStatus =
                  typeLower === "tunai"
                    ? t.Tunai
                    : typeLower === "mitra"
                    ? t.Mitra
                    : item.type;

                statusColor =
                  typeLower === "tunai"
                    ? "bg-green-100 text-green-700"
                    : typeLower === "mitra"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-700";
              }

              // Jika type = Mitra, override status jadi "Mitra"
              if (item.type === "Mitra") {
                displayStatus = t.Mitra;
                statusColor = "bg-yellow-100 text-yellow-800";
              }

              if (item.type === "BRS") {
                displayStatus = "YBRS";
                statusColor = "bg-blue-100 text-blue-800";
              }

              // Cek apakah harus menampilkan Total
              const showTotal =
                !(
                  item.serviceUnitName.toLowerCase() === "rehabilitasi medis" ||
                  item.serviceUnitName.toLowerCase() === "rehab medis"
                ) && item.type !== "Mitra" && item.type !== "BRS" ;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition duration-200 border border-gray-400"
                >
                  {/* Appointment No & Status */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] sm:text-[14px] md:text-[12px] lg:text-[12px] xl:text-[14px] font-semibold text-gray-800">
                      {item.appointmentNo}
                    </span>
                    <span
                      className={`px-2 text-[14px] sm:text-[14px] md:text-[12px] lg:text-[12px] xl:text-[14px] font-semibold rounded-md ${statusColor}`}
                    >
                      {displayStatus}
                    </span>
                  </div>

                  {/* Created At */}
                  <div className="text-gray-400 text-[12px] sm:text-[12px] md:text-[11px] lg:text-[11px] xl:text-[12px] mb-2">{formatDate(item.created_at)}</div>

                  {/* Garis Pembatas */}
                  <div className="border-t border-gray-300 my-2"></div>

                  {/* Dokter */}
                  <div className="text-black text-[13px] sm:text-[13px] md:text-[12px] lg:text-[12px] xl:text-[13px] mb-1">{item.paramedicName}</div>

                  {/* ServiceUnitName - Type */}
                  <div className="text-gray-400 text-[12px] sm:text-[12px] md:text-[11px] lg:text-[11px] xl:text-[12px]">
                    {item.serviceUnitName} -{" "}
                    {item.type === "Mitra" ? t.mitra_asuransi : item.type === "Tunai" ? t.Tunai : item.type}
                  </div>

                  {/* Garis Pembatas */}
                  <div className="border-t border-gray-300 my-2"></div>

                  {/* Total dihilangkan jika Rehabilitasi Medis */}
                 {showTotal && (
                   <div className="flex justify-between items-center">

                    <div className="text-black text-[14px] sm:text-[14px] md:text-[13px] lg:text-[13px] xl:text-[14px] font-semibold">
                      Total: {formatRupiah(item.amount)}
                    </div>

                    {item.type === "Tunai" &&
                      item.status?.toLowerCase() === "unpaid" &&
                      item.link && (
                        <button
                          onClick={() => window.open(item.link!, "_blank")}
                          className="ml-3 bg-blue-900 hover:bg-blue-800 text-white px-3 py-1 rounded-lg text-sm font-semibold transition cursor-pointer"
                        >
                          {t.Bayar}
                        </button>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
              {/* PREV */}
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                {
                  length: Math.min(5, totalPages),
                },
                (_, i) => {
                  const start = Math.max(
                    1,
                    Math.min(
                      currentPage - 2,
                      totalPages - 4
                    )
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
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
    </div>
  );
}