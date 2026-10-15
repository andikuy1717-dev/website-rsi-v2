"use client";

import { useEffect, useState, useRef, forwardRef } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import {
  FiSearch,
  FiCalendar,
  FiClock,
  FiBookmark,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { format, addDays } from "date-fns";
import { id, enUS } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";

import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";

import { fetchServiceUnitNonBPJSMixed } from "@/services/ServiceUnitNonBPJSMixedService";
import {
  fetchParamedicServiceUnit,
  ParamedicServiceUnit,
} from "@/services/ParamedicServiceUnitService";
import { fetchParamedicSchedule } from "@/services/ParamedicSchedule";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import {
  toggleDoctorBookmark,
  isDoctorBookmarked,
} from "@/utils/doctorBookmark";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

type ParamedicWithUnits = ParamedicServiceUnit & { serviceunitnames: string[] };
type DoctorWithSchedule = ParamedicWithUnits & {
  schedules?: {
    serviceUnitId: string;
    serviceUnitName: string;
    startTime: string;
    endTime: string;
  }[];
};

const resolveDoctorPhoto = (foto?: string) => {
  if (!foto) return "/doctor_dummy.png";
  if (foto.startsWith("data:image")) return foto;
  return `data:image/jpeg;base64,${foto}`;
};

// Helper menentukan sesi waktu (Pagi / Siang / Sore / Malam)
const getTimeSession = (timeStr: string) => {
  const hour = parseInt(timeStr?.split(":")[0] || "0", 10);
  if (hour < 12) return "Pagi";
  if (hour < 15) return "Sore";
  return "Malam";
};

// ==================== DOCTOR CARD ====================
export function DoctorCard({
  dokter,
  bookLabel,
  profileLabel,
  token,
  router,
  selectedDate,
  onUnfavorite,
}: {
  dokter: DoctorWithSchedule;
  bookLabel: string;
  profileLabel: string;
  token: string | null;
  router: ReturnType<typeof useRouter>;
  selectedDate: Date | null;
  onUnfavorite?: (id: string) => void;
}) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isDoctorBookmarked(dokter.paramedicid));
  }, [dokter.paramedicid]);

  return (
    <div className="relative flex flex-col justify-between h-full p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
      
      {/* ATAS: FOTO, INFO DOKTER & BOOKMARK */}
      <div>
        {/* BOOKMARK BUTTON */}
        <button
          title={bookmarked ? "Hapus dari simpanan" : "Simpan dokter"}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
            bookmarked
              ? "text-blue-900 bg-blue-50"
              : "text-slate-400 hover:text-blue-900 hover:bg-slate-50"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            const updated = toggleDoctorBookmark(dokter);
            const stillBookmarked = !!updated[dokter.paramedicid];
            setBookmarked(stillBookmarked);
            if (!stillBookmarked && onUnfavorite) {
              onUnfavorite(dokter.paramedicid);
            }
          }}
        >
          <FiBookmark
            size={18}
            className={bookmarked ? "fill-blue-900" : ""}
          />
        </button>

        {/* HEADER DOKTER */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            <img
              src={resolveDoctorPhoto(dokter.foto_base64)}
              alt={dokter.paramedicname}
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-bold text-slate-900 leading-[1.3] sm:text-[12px] md:text-[14px] lg:text-[16px]">
              {dokter.paramedicname}
            </h3>
            {/*
            <p className="text-[11.5px] text-slate-400 mt-1 leading-relaxed">
              {dokter.serviceunitnames && dokter.serviceunitnames.length > 0
                ? dokter.serviceunitnames.join(", ")
                : dokter.serviceunitname || "Dokter Spesialis"}
            </p>
            */}
          </div>
        </div>

        {/* JADWAL PRAKTIK SLOTS */}
        <div className="mt-4 mb-4 space-y-2">
          {dokter.schedules && dokter.schedules.length > 0 ? (
            dokter.schedules.slice(0, 3).map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2 bg-slate-50/90 rounded-xl text-[12px] text-slate-700"
              >
                <span className="font-semibold text-slate-800">
                  {getTimeSession(s.startTime)}
                </span>
                <div className="flex items-center gap-1.5 font-medium text-slate-600">
                  <FiClock size={13} className="text-slate-400" />
                  <span>
                    {s.startTime.replace(":", ".")}–{s.endTime.replace(":", ".")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-2.5 px-3 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
              Jadwal belum tersedia
            </div>
          )}
        </div>
      </div>

      {/* BAWAH: DUA TOMBOL AKSI */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => {
            if (!token) {
              router.push("/login");
              return;
            }
            const dateStr = selectedDate
              ? format(selectedDate, "yyyy-MM-dd")
              : "";
            startLoading();
            router.push(
              `/cari-dokter/janji-temu?dokterId=${dokter.paramedicid}&date=${dateStr}`,
            );
          }}
          className="flex-1 bg-[#182772] hover:bg-[#142153] text-white text-[12px] font-semibold py-2.5 px-3 rounded-xl transition duration-150 text-center active:scale-95"
        >
          {bookLabel}
        </button>

        <button
          onClick={() => {
            router.push(`/cari-dokter/profil?dokterId=${dokter.paramedicid}`);
          }}
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[12px] font-semibold py-2.5 px-4 rounded-xl transition duration-150 text-center active:scale-95"
        >
          {profileLabel}
        </button>
      </div>

    </div>
  );
}

// ==================== HALAMAN UTAMA ====================
export default function CariDokterPage() {
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const dateLocale = lang === "ID" ? id : enUS;
  const dateFormat =
    lang === "ID" ? "EEEE, dd MMMM yyyy" : "EEEE, MMMM dd, yyyy";

  const { token } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"semua" | "terakhir" | "disimpan">("semua");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [poliOptions, setPoliOptions] = useState<
    { value: string; label: string; type: string }[]
  >([]);
  const [dokterList, setDokterList] = useState<ParamedicWithUnits[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorWithSchedule[]>([]);
  const [selectedPoli, setSelectedPoli] = useState<{
    value: string;
    label: string;
    type: string;
  } | null>(null);
  const [searchName, setSearchName] = useState("");
  const [selectedParamedicId, setSelectedParamedicId] = useState<string>("");
  const [showDoctorSuggest, setShowDoctorSuggest] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Pagination (8 items per page = 2 baris x 4 kolom)
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const doctorListRef = useRef<HTMLDivElement | null>(null);

  // Filter Dokumen berdasarkan Tab
  const doctorsToRender = filteredDoctors.filter((doc) => {
    if (activeTab === "disimpan") {
      return isDoctorBookmarked(doc.paramedicid);
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(doctorsToRender.length / itemsPerPage));
  const paginatedDoctors = doctorsToRender.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const doctorSuggestions = dokterList.filter((dokter) =>
    dokter.paramedicname.toLowerCase().includes(searchName.toLowerCase()),
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    doctorListRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Custom Input DatePicker
  const DateInput = forwardRef<HTMLInputElement, any>(
    ({ value, onClick, placeholder }, ref) => (
      <div className="relative w-full">
        <input
          ref={ref}
          value={value}
          onClick={onClick}
          placeholder={placeholder}
          readOnly
          className="w-full h-[46px] pl-5 pr-10 text-[13.5px] text-slate-800 bg-white border border-slate-200 rounded-xl cursor-pointer focus:border-[#182772] focus:ring-1 focus:ring-[#182772] outline-none"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <FiCalendar size={17} />
        </div>
      </div>
    ),
  );
  DateInput.displayName = "DateInput";

  // Load Awal: Data Poli & Dokter
  useEffect(() => {
    let isActive = true;
    startLoading();

    Promise.all([fetchServiceUnitNonBPJSMixed(), fetchParamedicServiceUnit()])
      .then(([serviceUnits, doctors]) => {
        if (!isActive) return;

        const sortedPoli = serviceUnits
          .slice()
          .sort((a, b) =>
            a.serviceunitname.localeCompare(b.serviceunitname, "id", {
              sensitivity: "base",
            }),
          )
          .map((item) => ({
            value: item.serviceunitid,
            label: item.serviceunitname,
            type: item.type,
          }));

        setPoliOptions(sortedPoli);

        const groupedDoctors: ParamedicWithUnits[] = Object.values(
          doctors.reduce(
            (acc, doc) => {
              if (!acc[doc.paramedicid]) {
                acc[doc.paramedicid] = {
                  ...doc,
                  serviceunitnames: [doc.serviceunitname],
                };
              } else {
                acc[doc.paramedicid].serviceunitnames!.push(doc.serviceunitname);
              }
              return acc;
            },
            {} as Record<string, ParamedicWithUnits>,
          ),
        );

        setDokterList(groupedDoctors);
      })
      .finally(() => {
        endLoading();
      });

    return () => {
      isActive = false;
    };
  }, []);

  // Filter Jadwal
  const executeFilter = async () => {
    if (!selectedDate) return;

    startLoading();
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const schedules = await fetchParamedicSchedule({
        dateStart: dateStr,
        dateEnd: dateStr,
        serviceUnitId: selectedPoli?.value || "",
        paramedicId: selectedParamedicId || "",
      });

      const scheduleMap = new Map<
        string,
        {
          serviceUnitId: string;
          serviceUnitName: string;
          startTime: string;
          endTime: string;
        }[]
      >();

      schedules.forEach((s) => {
        if (!scheduleMap.has(s.ParamedicID)) {
          scheduleMap.set(s.ParamedicID, []);
        }
        scheduleMap.get(s.ParamedicID)!.push({
          serviceUnitId: s.ServiceUnitID,
          serviceUnitName: s.ServiceUnitName,
          startTime: s.StartTime1,
          endTime: s.EndTime1,
        });
      });

      const unitNameToIdMap = new Map(poliOptions.map((u) => [u.label, u.value]));
      const unitNameToId = (name: string) => unitNameToIdMap.get(name) || "";

      let result: DoctorWithSchedule[] = dokterList
        .map((dokter) => {
          const schedules = scheduleMap.get(dokter.paramedicid);
          if (!schedules) return null;

          const allowedUnitIds = new Set(
            dokter.serviceunitnames.map((name) => unitNameToId(name)).filter(Boolean),
          );

          const filteredSchedules = schedules.filter((s) =>
            allowedUnitIds.has(s.serviceUnitId),
          );

          if (filteredSchedules.length === 0) return null;

          return {
            ...dokter,
            schedules: filteredSchedules,
          };
        })
        .filter(Boolean) as DoctorWithSchedule[];

      if (selectedParamedicId) {
        result = result.filter((d) => d.paramedicid === selectedParamedicId);
      } else if (searchName) {
        result = result.filter((d) =>
          d.paramedicname.toLowerCase().includes(searchName.toLowerCase()),
        );
      }

      setFilteredDoctors(result);
      setCurrentPage(1);
    } catch {
      setFilteredDoctors([]);
    } finally {
      endLoading();
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (dokterList.length > 0 && isInitialLoad) {
      executeFilter();
    }
  }, [dokterList, isInitialLoad]);

  return (
    <div className={`${plusJakartaSans.className} w-full bg-[#F3F5FB] min-h-screen`}>
      
      {/* ================= HERO BANNER SECTION ================= */}
      <div className="w-full bg-[#182772] text-white">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12 md:px-10 lg:px-12 lg:pb-24 lg:pt-14 xl:px-16 2xl:px-20">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center lg:gap-10">
            {/* KIRI: Breadcrumb, Judul, dan Deskripsi */}
            <div className="flex min-w-0 max-w-xl flex-col gap-3 lg:flex-1">
              <p className="text-xs font-normal leading-relaxed text-white/75 sm:text-sm">
                Beranda / Cari Dokter
              </p>

              <div>
                <h1 className="mb-3 text-[32px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[38px] md:text-[44px] lg:text-[48px] xl:text-[52px]">
                  Cari Dokter
                </h1>

                <p className="max-w-xl text-sm font-normal leading-[1.7] text-[#C2CEEB] sm:text-base lg:text-[17px]">
                  Temukan dokter dan jadwal praktiknya, lalu buat janji temu
                  <br className="hidden xl:inline" />
                  {" "}langsung dari sini.
                </p>
              </div>
            </div>

            {/* KANAN: Foto dokter */}
            <div className="relative hidden h-[160px] w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:block lg:max-w-[360px] xl:h-[190px] xl:max-w-[420px] 2xl:h-[200px] 2xl:max-w-[480px]">
              <img
                src="/foto_kumpul_dokter.png"
                alt="Tim Dokter RS Immanuel"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= FLOATING SEARCH / FILTER CARD ================= */}
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 -mt-12 sm:-mt-14 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-7">
          
          {/* TAB SWITCHER PILLS (Semua Dokter / Terakhir Dilihat / Disimpan) */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl mb-6 text-[13px] font-medium">
            <button
              onClick={() => setActiveTab("semua")}
              className={`px-4 py-2 rounded-lg transition-all duration-150 ${
                activeTab === "semua"
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Semua Dokter
            </button>
            <button
              onClick={() => setActiveTab("terakhir")}
              className={`px-4 py-2 rounded-lg transition-all duration-150 ${
                activeTab === "terakhir"
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Terakhir Dilihat
            </button>
            <button
              onClick={() => setActiveTab("disimpan")}
              className={`px-4 py-2 rounded-lg transition-all duration-150 ${
                activeTab === "disimpan"
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Disimpan
            </button>
          </div>

          {/* GRID FORM PENCARIAN */}
           <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1.18fr)_72px]">
            {/* Input 1: Nama Dokter */}
            <div className="relative">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Nama dokter
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Ketik nama dokter..."
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setSelectedParamedicId("");
                    setShowDoctorSuggest(true);
                  }}
                  className="h-[44px] w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[13px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#182772] focus:ring-1 focus:ring-[#182772]"
                />

                <FiSearch
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
              </div>

              {showDoctorSuggest && searchName && doctorSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                  {doctorSuggestions.slice(0, 6).map((dokter) => (
                    <div
                      key={dokter.paramedicid}
                      onClick={() => {
                        setSearchName(dokter.paramedicname);
                        setSelectedParamedicId(dokter.paramedicid);
                        setShowDoctorSuggest(false);
                      }}
                      className="cursor-pointer px-4 py-2.5 text-[13px] hover:bg-slate-50"
                    >
                      <div className="font-semibold text-slate-800">
                        {dokter.paramedicname}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {dokter.serviceunitnames?.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input 2: Poliklinik */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Poliklinik / spesialisasi
              </label>

              <Select
                instanceId="poli-select"
                options={poliOptions}
                placeholder="Semua poliklinik"
                isSearchable
                isClearable
                value={selectedPoli}
                onChange={(val) => setSelectedPoli(val)}
                classNamePrefix="rs"
                menuPlacement="auto"
                maxMenuHeight={220}
                styles={{
                  control: (base) => ({
                    ...base,
                    height: "44px",
                    minHeight: "44px",
                    borderRadius: "12px",
                    border: "none",
                    borderColor: "transparent",
                    fontSize: "13px",
                    boxShadow: "none",
                    "&:hover": {
                      border: "none",
                      borderColor: "transparent",
                    },
                  }),
                  indicatorSeparator: () => ({ display: "none" }), // Opsional: menghilangkan garis pemisah vertikal kecil di dekat panah
                }}
              />
            </div>

            {/* Input 3: Tanggal */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Tanggal praktik
              </label>

              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                locale={dateLocale}
                dateFormat={dateFormat}
                minDate={new Date()}
                maxDate={addDays(new Date(), 30)}
                customInput={<DateInput />}
              />
            </div>

            {/* Tombol Cari */}
            <div>
              <button
                onClick={executeFilter}
                className="flex h-[44px] w-full items-center justify-center rounded-xl bg-[#182772] text-[13px] font-semibold text-white transition hover:bg-[#142153] active:scale-95"
              >
                Cari
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DAFTAR DOKTER GRID ================= */}
      <div
        ref={doctorListRef}
        className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-10"
      >
        {/* HEADER SECTION: JADWAL & JUMLAH HALAMAN */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-[28px] sm:text-[34px] lg:text-[36px] leading-[1.15] lg:leading-[1.1] font-extrabold text-[#182772]">
            Jadwal dokter{" "}
            <span className="font-normal text-slate-600">
              · {selectedDate ? format(selectedDate, dateFormat, { locale: dateLocale }) : ""}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Halaman {currentPage} dari {totalPages}
          </p>
        </div>

        {/* LIST KARTU DOKTER (GRID 4 KOLOM) */}
        {doctorsToRender.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-base font-semibold text-slate-700">{t.doctorNotFound}</p>
            <p className="mt-1 text-sm text-slate-400">{t.changeFilter}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {paginatedDoctors.map((dokter) => (
              <DoctorCard
                key={dokter.paramedicid}
                dokter={dokter}
                bookLabel="Buat Janji Temu"
                profileLabel="Profil"
                token={token}
                router={router}
                selectedDate={selectedDate}
                onUnfavorite={() => {
                  if (activeTab === "disimpan") {
                    setFilteredDoctors((prev) => [...prev]);
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-10">
            {/* Prev */}
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition ${
                currentPage === 1
                  ? "text-slate-300 border-slate-200 cursor-not-allowed"
                  : "text-slate-600 border-slate-200 hover:bg-white hover:border-slate-300"
              }`}
            >
              <FiChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                totalPages > 6 &&
                page !== 1 &&
                page !== totalPages &&
                Math.abs(page - currentPage) > 1
              ) {
                if (page === 2 || page === totalPages - 1) {
                  return (
                    <span key={page} className="px-1 text-slate-400 text-sm">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-[13px] font-semibold transition ${
                    currentPage === page
                      ? "bg-[#182772] text-white shadow-sm"
                      : "text-slate-600 hover:bg-white border border-transparent hover:border-slate-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition ${
                currentPage === totalPages
                  ? "text-slate-300 border-slate-200 cursor-not-allowed"
                  : "text-slate-600 border-slate-200 hover:bg-white hover:border-slate-300"
              }`}
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}


