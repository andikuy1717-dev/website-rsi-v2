"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { getPrescriptionList } from "@/services/GetPrescriptionList";
import { getPrescriptionDetail, PrescriptionDetailItem } from "@/services/GetPrescriptionDetail";

const ITEMS_PER_PAGE = 6;

export default function ResepSayaPage() {

  const { medicalNo, token } = useAuth(); // ⬅️ pastikan token ada kalau context lu punya
  const [data, setData] = useState<any[]>([]);
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const [currentPage, setCurrentPage] = useState(1);
  const [openDetail, setOpenDetail] = useState<number | null>(null);
  const [detailMap, setDetailMap] = useState<Record<string, PrescriptionDetailItem[]>>({});
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);
  const [drugIndexMap, setDrugIndexMap] = useState<Record<string, number>>({});

  async function loadDetail(prescriptionNo: string) {
  if (detailMap[prescriptionNo]) return;

    try {
        setLoadingDetail(prescriptionNo);
        const res = await getPrescriptionDetail(
        prescriptionNo,
        token ?? ""
        );

        const detailData = res?.data ?? [];

        setDetailMap(prev => ({
        ...prev,
        [prescriptionNo]: detailData
        }));

    } catch (err) {

        console.error("Load detail error:", err);

    } finally {

        setLoadingDetail(null);

    }
  }
  
  // 🔥 pagination logic
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = data.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
    // 🔥 RESET CARD DETAIL
    setOpenDetail(null);

    // 🔥 OPTIONAL → reset index obat juga (recommended)
    setDrugIndexMap({});

  }, [currentPage]);

  // ✅ LOAD RESEP
  useEffect(() => {

    if (!medicalNo) return;

    const loadPrescription = async () => {
      try {

        startLoading();

        const res = await getPrescriptionList(
          medicalNo,
          token ?? "" // token optional
        );

        if (res?.data) {
          setData(res.data);
        } else {
          setData([]);
        }

      } catch (err) {
        console.error("Load prescription error:", err);
        setData([]);
      } finally {
        endLoading();
      }
    };

    loadPrescription();

  }, [medicalNo]);

  function formatPrescriptionDate(dateString: string, lang: string) {
    if (!dateString) return "-";

    const match = dateString.match(/\d+/);
    if (!match) return dateString;

    const date = new Date(Number(match[0]));

    return new Intl.DateTimeFormat(
        lang === "ID" ? "id-ID" : "en-US",
        {
        weekday: "long",   // 🔥 INI TAMBAHAN
        day: "2-digit",
        month: "long",
        year: "numeric",
        }
    ).format(date);
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-black md:text-[16px] lg:text-[18px] xl:text-[20px]">
        {t.resepSaya}
      </h1>

      {/* RESEP SAYA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {data.length === 0 ? (
           <p className="text-gray-400">{t.tidakAdaResepSaya}</p>
        ) : (
          currentItems.map((item, i) => {

            const isOpen = openDetail === i;

            return (

            <div
            key={i}
            className="relative border border-gray-400 rounded-xl bg-white shadow-sm overflow-hidden"
            >

            {/* WRAPPER SLIDER */}
            <div
            className={`
            flex w-[200%] transition-transform duration-500
            ${isOpen ? "-translate-x-1/2" : "translate-x-0"}
            `}
            >

            {/* ================== CARD NORMAL ================== */}
            <div className="w-1/2 p-4 relative">

            {/* ARROW */}
            <span
            title="Lihat Detail Resep"
            onClick={() => {setOpenDetail(i); loadDetail(item.PrescriptionNo);}}
            className="
            absolute top-2 right-3
            text-blue-700
            text-4xl
            cursor-pointer
            hover:scale-110
            transition
            "
            >
            ›
            </span>

            <div className="font-semibold text-black mb-1 text-[14px] sm:text-[14px] md:text-[14px] lg:text-[13px] xl:text-[14px]">
            {item.PrescriptionNo}
            </div>

            <div className="text-[12px] sm:text-[12px] md:text-[12px] lg:text-[11px] xl:text-[12px] text-gray-400 mt-1">
            {formatPrescriptionDate(item.PrescriptionDate, lang)}
            </div>

            <div className="border-t border-gray-300 my-2"></div>

            <div className="text-[13px] sm:text-[13px] md:text-[13px] lg:text-[12px] xl:text-[13px] text-black mb-1">
            {item.ParamedicName || "-"}
            </div>

            <div className="text-[12px] sm:text-[12px] md:text-[12px] lg:text-[11px] xl:text-[12px] text-gray-400">
            No Reg — {item.RegistrationNo}
            </div>

            </div>

            {/* ================== CARD DETAIL ================== */}
            <div className="w-1/2 p-4 relative">

            {/* HEADER BAR */}
            <div className="flex items-center justify-between">

            {/* BACK ARROW */}
            <span
            title="Kembali"
            onClick={() => setOpenDetail(null)}
            className="
            absolute top-2 left-3
            text-blue-700
            text-4xl
            cursor-pointer
            hover:scale-110
            transition
            "
            >
            ‹
            </span>

            {/* PRESCRIPTION NO */}
            <div className="font-semibold text-black text-[14px] sm:text-[14px] md:text-[14px] lg:text-[13px] xl:text-[14px] ml-auto">
            {item.PrescriptionNo}
            </div>

            </div>

            {/* GARIS */}
            <div className="border-t border-gray-300 my-3"></div>

            {/* LIST OBAT */}
            <div className="relative text-center min-h-[70px] flex items-center justify-center">

               {loadingDetail === item.PrescriptionNo ? (

                <div className="text-gray-400 text-sm">Loading obat...</div>

                ) : (detailMap[item.PrescriptionNo]?.length ?? 0) === 0 ? (

                <div className="text-gray-400 text-sm">Tidak ada data obat</div>

                ) : (() => {

                const drugs = detailMap[item.PrescriptionNo] ?? [];
                const currentIndex = drugIndexMap[item.PrescriptionNo] ?? 0;
                const drug = drugs[currentIndex];

                return (

                    <div className="w-full flex items-center justify-center relative">

                    {/* LEFT ARROW */}
                    {drugs.length > 1 && (
                        <button
                        onClick={() =>
                            setDrugIndexMap(prev => ({
                            ...prev,
                            [item.PrescriptionNo]:
                                currentIndex === 0 ? drugs.length - 1 : currentIndex - 1
                            }))
                        }
                        className="absolute left-0 text-2xl px-2 text-blue-700 hover:scale-110 cursor-pointer"
                        >
                        ‹
                        </button>
                    )}

                    {/* DRUG CONTENT */}
                    <div className="px-8">

                        <div className="text-[14px] sm:text-[14px] md:text-[14px] lg:text-[12px] xl:text-[14px] text-black font-medium">
                        {drug.ItemName}
                        </div>

                        <div className="text-[12px] sm:text-[12px] md:text-[12px] lg:text-[11px] xl:text-[12px] text-gray-500 mt-1">
                        {t.jumlahObat} {drug.PrescriptionQty} | {t.Konsumsi} {drug.ConsumeMethod}
                        </div>

                        {/* optional indicator */}
                        {drugs.length > 1 && (
                        <div className="text-[11px] sm:text-[11px] md:text-[11px] lg:text-[10px] xl:text-[11px] text-gray-400 mt-1">
                            {currentIndex + 1} / {drugs.length}
                        </div>
                        )}

                    </div>

                    {/* RIGHT ARROW */}
                    {drugs.length > 1 && (
                        <button
                        onClick={() =>
                            setDrugIndexMap(prev => ({
                            ...prev,
                            [item.PrescriptionNo]:
                                currentIndex === drugs.length - 1 ? 0 : currentIndex + 1
                            }))
                        }
                        className="absolute right-0 text-2xl px-2 text-blue-700 hover:scale-110 cursor-pointer"
                        >
                        ›
                        </button>
                    )}

                    </div>

                );

            })()}

            </div>

            </div>

            </div>

            </div>

            );
            })
        )}
    </div>

    {/* PAGINATION */}
    {totalPages > 1 && (
        <div className="flex justify-center items-center flex-wrap gap-2 mt-8">
            {/* PREV */}
            <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
            {/* PAGE NUMBERS */}
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
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
  );
}