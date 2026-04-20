"use client";

import DatePicker from "react-datepicker";
import Select from "react-select";
import { FiSearch, FiCalendar } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { useEffect, useState, useRef, forwardRef } from "react";
import { id, enUS } from "date-fns/locale";
import { fetchServiceUnitNonBPJSMixed } from "@/services/ServiceUnitNonBPJSMixedService";
import {
  fetchParamedicServiceUnit,
  ParamedicServiceUnit,
} from "@/services/ParamedicServiceUnitService";
import { fetchParamedicSchedule } from "@/services/ParamedicSchedule";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { useRouter } from "next/navigation"; // Buat Verifikasi Login Dulu Jika Belum Login atau Token Habis
import { useAuth } from "@/context/AuthContext"; // Buat Verifikasi Login Dulu Jika Belum Login atau Token Habis
type ParamedicWithUnits = ParamedicServiceUnit & { serviceunitnames: string[] };
type DoctorWithSchedule = ParamedicWithUnits & {
  schedules?: {
    serviceUnitId: string;
    serviceUnitName: string;
    startTime: string;
    endTime: string;
  }[];
};
import { format, addDays } from "date-fns";
import {
  toggleDoctorBookmark,
  isDoctorBookmarked,
} from "@/utils/doctorBookmark";

const resolveDoctorPhoto = (foto?: string) => {
  if (!foto) return "/doctor_dummy.png";
  if (foto.startsWith("data:image")) return foto; // jaga-jaga
  return `data:image/jpeg;base64,${foto}`;
};

const useItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12); // default SSR-safe

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setItemsPerPage(5);
      else if (window.innerWidth < 1024) setItemsPerPage(8);
      else setItemsPerPage(12);
    };

    update(); // initial
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return itemsPerPage;
};

export function DoctorCard({
  dokter,
  bookLabel,
  addFavorite,
  token,
  router,
  selectedDate,
  onUnfavorite,
}: {
  dokter: DoctorWithSchedule;
  bookLabel: string;
  addFavorite: string;
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
    <div className="relative flex flex-col h-full px-5 py-5 transition bg-white border border-gray-300 shadow rounded-xl hover:shadow-lg">
      {/* BOOKMARK POJOK KANAN ATAS */}
      <div className="absolute top-3 right-3 group">
        {/* TOOLTIP */}
        <span
          className="absolute z-10 px-2 py-1 text-xs text-white transition translate-x-1/2 bg-gray-800 rounded opacity-0 pointer-events-none  -top-8 right-1/2 whitespace-nowrap group-hover:opacity-100"
        >
          {addFavorite}
        </span>

        {/* ICON */}
        <button
          className={`transition ${
            bookmarked
              ? "text-yellow-500"
              : "text-gray-400 hover:text-yellow-500"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            const updated = toggleDoctorBookmark(dokter);
            const stillBookmarked = !!updated[dokter.paramedicid];

            setBookmarked(stillBookmarked);

            // 🔥 kalau sudah tidak di-bookmark & ada callback
            if (!stillBookmarked && onUnfavorite) {
              onUnfavorite(dokter.paramedicid);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 3c-.55 0-1 .45-1 1v18l8-5 8 5V4c0-.55-.45-1-1-1H5z" />
          </svg>
        </button>
      </div>

      {/* TOP: FOTO + INFO */}
      <div className="flex items-center shrink-0 gap-4 pr-8">
        {/* FOTO DOKTER */}
        <img
          src={resolveDoctorPhoto(dokter.foto_base64)}
          alt={dokter.paramedicname}
          className="object-cover object-top border rounded-full w-14 h-14"
        />

        {/* INFO */}
        <div className="flex-1">
          <h3 className="text-[12px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-[13px] font-semibold text-gray-800 leading-snug">
            {dokter.paramedicname}
          </h3>

          <p className="text-[11px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-[12px] text-gray-400 mt-1 leading-snug">
            {dokter.serviceunitnames
              ? dokter.serviceunitnames.map((name, i) => (
                  <span key={i} className="block">
                    {name}
                  </span>
                ))
              : dokter.serviceunitname}
          </p>
        </div>
      </div>

      <div className="shrink-0 my-3 border-t border-gray-400" />

      {dokter.schedules && dokter.schedules.length > 0 && (
        <div className="mt-2 mb-2 text-[12px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-[12px] text-gray-600 space-y-1 max-h-20 overflow-y-auto pr-2 custom-scrollbar grow">
          {dokter.schedules.map((s, i) => (
            <div key={i} className="flex justify-between">
              <span>{s.serviceUnitName}</span>
              <span className="font-medium text-gray-600">
                {s.startTime} - {s.endTime}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        className="
          mt-auto
          w-full
          bg-blue-900
          hover:bg-blue-500
          text-white
          text-sm
          font-medium
          py-2.5
          rounded-lg
          transition
          cursor-pointer
          shrink-0
        "
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
      >
        {bookLabel}
      </button>
    </div>
  );
}

export default function CariDokterPage() {
  const { lang } = useLang();
  const hasMounted = useRef(false);
  const t = lang === "ID" ? ID : EN;
  const dateLocale = lang === "ID" ? id : enUS;
  const dateFormat =
    lang === "ID" ? "EEEE, dd MMMM yyyy" : "EEEE, MMMM dd, yyyy";
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [poliOptions, setPoliOptions] = useState<
    { value: string; label: string; type: string }[]
  >([]);
  const [dokterList, setDokterList] = useState<ParamedicWithUnits[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorWithSchedule[]>(
    [],
  );
  const doctorsToRender = filteredDoctors;
  const [selectedPoli, setSelectedPoli] = useState<{
    value: string;
    label: string;
    type: string;
  } | null>(null);
  const [searchName, setSearchName] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedParamedicId, setSelectedParamedicId] = useState<string>("");
  const [showDoctorSuggest, setShowDoctorSuggest] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState<{
    date: Date | null;
    poliLabel: string;
    doctorName: string;
  } | null>(null);
  const [activePanel, setActivePanel] = useState<"filter" | "recent">("filter");
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const itemsPerPage = useItemsPerPage();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(doctorsToRender.length / itemsPerPage);
  const paginatedDoctors = doctorsToRender.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const doctorListRef = useRef<HTMLDivElement | null>(null);
  const isManualPageChange = useRef(false);
  const { token } = useAuth();
  const router = useRouter();

  //const [showPatientModal, setShowPatientModal] = useState(false);
  //const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<DoctorWithSchedule | null>(null);
  //const [selectedPatientType, setSelectedPatientType] = useState<string>("");

  const doctorSuggestions = dokterList.filter((dokter) =>
    dokter.paramedicname.toLowerCase().includes(searchName.toLowerCase()),
  );

  const handlePageChange = (page: number) => {
    isManualPageChange.current = true;
    setCurrentPage(page);

    requestAnimationFrame(() => {
      doctorListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const filterTitle = () => {
    if (!appliedFilter) return "";

    const parts: string[] = [];

    if (appliedFilter.date) {
      parts.push(
        format(appliedFilter.date, dateFormat, { locale: dateLocale }),
      );
    }

    if (appliedFilter.poliLabel) {
      parts.push(appliedFilter.poliLabel);
    }

    if (appliedFilter.doctorName) {
      parts.push(appliedFilter.doctorName);
    }

    return parts.length ? `: ${parts.join(" - ")}` : "";
  };

  const DateInput = forwardRef<HTMLInputElement, any>(
    ({ value, onClick, placeholder }, ref) => (
      <div className="relative">
        <input
          ref={ref}
          value={value}
          onClick={onClick}
          placeholder={placeholder}
          readOnly
          inputMode="none" // ✅ MOBILE TIDAK MUNCUL KEYBOARD
          className="w-full px-4 py-3 text-base text-gray-700 border border-gray-400 rounded-lg cursor-pointer  caret-transparent focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />

        {/* ICON KALENDER */}
        <div
          className="absolute text-blue-500 -translate-y-1/2 pointer-events-none  right-4 top-1/2"
        >
          <FiCalendar size={18} />
        </div>
      </div>
    ),
  );
  DateInput.displayName = "DateInput";

  useEffect(() => {
    if (!selectedDate) return;

    let isActive = true;
    startLoading();
    setScheduleError(null);

    const runFilter = async () => {
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");

        const schedules = await fetchParamedicSchedule({
          dateStart: dateStr,
          dateEnd: dateStr,
          serviceUnitId: selectedPoli?.value || "",
          paramedicId: selectedParamedicId || "",
        });

        if (!isActive) return;

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

        const unitNameToIdMap = new Map(
          poliOptions.map((u) => [u.label, u.value]),
        );
        const unitNameToId = (name: string) => unitNameToIdMap.get(name) || "";

        let result: DoctorWithSchedule[] = dokterList
          .map((dokter) => {
            const schedules = scheduleMap.get(dokter.paramedicid);
            if (!schedules) return null;

            const allowedUnitIds = new Set(
              dokter.serviceunitnames
                .map((name) => unitNameToId(name))
                .filter(Boolean),
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

        // 🔎 FILTER DOKTER HANYA JIKA USER MEMILIH DARI LIST
        if (selectedParamedicId) {
          result = result.filter((d) => d.paramedicid === selectedParamedicId);
        }

        setFilteredDoctors(result);
        setCurrentPage(1);

        setAppliedFilter({
          date: selectedDate,
          poliLabel: selectedPoli?.label || "",
          doctorName: selectedParamedicId
            ? dokterList.find((d) => d.paramedicid === selectedParamedicId)
                ?.paramedicname || ""
            : "",
        });
      } catch {
        setFilteredDoctors([]);
        setScheduleError(
          lang === "ID"
            ? "Jadwal Dokter Tidak Tersedia"
            : "Doctor Schedule Unavailable",
        );
      } finally {
        endLoading();
      }
    };

    runFilter();

    return () => {
      isActive = false;
    };
  }, [
    selectedDate,
    selectedPoli?.value,
    selectedParamedicId,
    dokterList,
    poliOptions,
  ]);

  useEffect(() => {
    let isActive = true;

    startLoading();
    hasMounted.current = true;

    Promise.all([fetchServiceUnitNonBPJSMixed(), fetchParamedicServiceUnit()])
      .then(([serviceUnits, doctors]) => {
        if (!isActive) return;

        // ================= POLI =================
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
                acc[doc.paramedicid].serviceunitnames!.push(
                  doc.serviceunitname,
                );
              }
              return acc;
            },
            {} as Record<string, ParamedicWithUnits>,
          ),
        );

        setDokterList(groupedDoctors); // ✅ tipe aman
        setCurrentPage(1);
      })
      .finally(() => {
        if (!hasMounted.current) return;
        endLoading();
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isInitialLoad) return;
    if (!selectedDate || dokterList.length === 0) return;

    const runInitial = async () => {
      startLoading();

      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const schedules = await fetchParamedicSchedule({
          dateStart: dateStr,
          dateEnd: dateStr,
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

        // buat map: paramedicId => Set of ServiceUnitID aktif
        const activePoliMap = new Map<string, Set<string>>();
        schedules.forEach((s) => {
          if (!activePoliMap.has(s.ParamedicID)) {
            activePoliMap.set(s.ParamedicID, new Set());
          }
          activePoliMap.get(s.ParamedicID)!.add(s.ServiceUnitID);
        });

        // map unitName -> unitId
        const unitNameToIdMap = new Map(
          poliOptions.map((u) => [u.label, u.value]),
        );
        const unitNameToId = (name: string) => unitNameToIdMap.get(name) || "";

        let result: DoctorWithSchedule[] = dokterList
          .map((dokter) => {
            const schedules = scheduleMap.get(dokter.paramedicid);
            if (!schedules) return null;

            // 🔑 poli resmi dokter (berdasarkan serviceUnitName → ID)
            const allowedUnitIds = new Set(
              dokter.serviceunitnames
                .map((name) => unitNameToId(name))
                .filter(Boolean),
            );

            // 🔥 FILTER SCHEDULE SESUAI RELASI DOKTER
            const filteredSchedules = schedules.filter((s) =>
              allowedUnitIds.has(s.serviceUnitId),
            );

            if (filteredSchedules.length === 0) return null;

            // 🔥 sinkronkan ulang serviceunitnames dari schedule
            const filteredUnits = dokter.serviceunitnames.filter((name) =>
              allowedUnitIds.has(unitNameToId(name)),
            );

            return {
              ...dokter,
              serviceunitnames: filteredUnits,
              schedules: filteredSchedules,
            };
          })
          .filter(Boolean) as DoctorWithSchedule[];

        setFilteredDoctors(result);
        setCurrentPage(1);

        setAppliedFilter({
          date: selectedDate,
          poliLabel: "",
          doctorName: "",
        });
      } finally {
        endLoading();
        //setHasSearched(true);   // 🔥 INI KUNCINYA
        setIsInitialLoad(false); // 🔥 MATIKAN AUTO LOAD
      }
    };

    runInitial();
  }, [isInitialLoad, selectedDate, dokterList, poliOptions]);

  return (
    <>
    {/* FOTO / BANNER */}
      <div className="relative w-full h-[180px] sm:h-[220px] md:h-[300px] lg:h-[360px]">
        <img
          src="/foto_kumpul_dokter.png" // ⬅️ taruh di folder /public
          alt="Cari Dokter"
          className="w-full h-full object-cover object-[50%_23%]"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-3xl font-semibold tracking-wide text-white md:text-5xl drop-shadow-sm">
            {t.cariDokter}
          </h1>
        </div>
      </div>

      {/* CONTENT - kasih padding kiri kanan yang cukup */}
      <div className="px-6 pt-5 mx-auto sm:px-8 md:px-10 lg:px-12 xl:px-16 max-w-8xl">
        {/* NAV BUTTON (MD ONLY) */}
        <div className="flex justify-between gap-3 mb-4 lg:hidden">
          <button
            onClick={() => setActivePanel("filter")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              activePanel === "filter"
                ? "bg-blue-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t.filterDoctor}
          </button>

          <button
            onClick={() => setActivePanel("recent")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              activePanel === "recent"
                ? "bg-blue-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t.recentlyViewed}
          </button>
        </div>

        <div className="relative mb-6 overflow-hidden lg:overflow-visible">
          <div
            className={`
            flex transition-transform duration-300 ease-in-out
            ${activePanel === "recent" ? "-translate-x-full" : "translate-x-0"}
            lg:translate-x-0
            lg:grid lg:grid-cols-2 lg:gap-8
          `}
          >
            {/* ================= FILTER SEARCH ================= */}
            <div className="min-w-full px-6 py-6 bg-white border border-gray-300 shadow lg:min-w-0 rounded-xl">
              <h2 className="mb-5 text-xl font-semibold text-black">
                {t.filterDoctor}
              </h2>

              {/* Search Nama */}
              <div className="relative mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-500">
                  {t.searchDoctorName}
                </label>
                <div className="flex items-center gap-3 px-4 py-2 border border-gray-400 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200">
                  <FiSearch className="text-blue-600" />
                  <input
                    type="text"
                    placeholder={t.typeDoctorName}
                    value={searchName}
                    onChange={(e) => {
                      setSearchName(e.target.value);
                      setSelectedParamedicId("");
                      setShowDoctorSuggest(true);
                    }}
                    className="w-full text-base text-black placeholder-gray-400 bg-transparent outline-none"
                  />
                </div>

                {/* 🔽 AUTOCOMPLETE LIST */}
                {showDoctorSuggest &&
                  searchName &&
                  doctorSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 z-50 mt-1 overflow-y-auto bg-white border border-gray-400 rounded-md shadow max-h-52">
                      {doctorSuggestions.slice(0, 6).map((dokter) => (
                        <div
                          key={dokter.paramedicid}
                          onClick={() => {
                            setSearchName(dokter.paramedicname);
                            setSelectedParamedicId(dokter.paramedicid);
                            setShowDoctorSuggest(false);
                          }}
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50"
                        >
                          <div className="font-medium text-gray-800">
                            {dokter.paramedicname}
                          </div>
                          <div className="text-xs text-gray-500">
                            {dokter.serviceunitnames?.join(", ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Poli */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-500">
                  {t.selectClinic}
                </label>
                <Select
                  instanceId="poli-select"
                  options={poliOptions}
                  placeholder={t.selectClinic}
                  isSearchable
                  isClearable // 🔥 INI KUNCINYA
                  value={selectedPoli}
                  onChange={(val) => setSelectedPoli(val)}
                  classNamePrefix="rs"
                  menuPlacement="auto"
                  maxMenuHeight={5 * 42}
                />
              </div>

              {/* Jadwal Dokter */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-500">
                  {t.selectScheduleDate}
                </label>

                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  locale={dateLocale}
                  dateFormat="EEEE, dd MMMM yyyy"
                  placeholderText={t.selectScheduleDate}
                  minDate={new Date()} // ⛔ tidak bisa pilih kemarin
                  maxDate={addDays(new Date(), 30)} // opsional: max 30 hari
                  withPortal
                  portalId="datepicker-portal"
                  customInput={<DateInput />}
                />
              </div>
            </div>

            {/* ================= TERAKHIR DILIHAT ================= */}
            <div className="min-w-full px-6 py-6 bg-white border border-gray-300 shadow lg:min-w-0 rounded-xl">
              <h2 className="mb-5 text-xl font-semibold text-black">
                {t.recentlyViewed}
              </h2>

              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 pb-4 mb-4 border-b last:border-none last:mb-0"
                >
                  {/* FOTO */}
                  <img
                    src="/doctor_dummy.png" // dummy foto
                    alt="Dokter"
                    className="object-cover w-16 h-16 rounded-full"
                  />

                  {/* INFO */}
                  <div className="flex-1">
                    <p className="font-semibold text-blue-600">
                      dr. Contoh Dokter {i}
                    </p>
                    <p className="text-sm text-gray-600">Poli Penyakit Dalam</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= LIST DOKTER ================= */}
          <div
            ref={doctorListRef}
            className="flex flex-col w-full px-6 py-6 text-gray-300 bg-white border border-gray-300 shadow scroll-mt-41 mt-7 lg:col-span-2 rounded-xl"
          >
            <h2 className="text-xl mb-6 text-black font-semibold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[20px] xl:text-[20px]">
              {t.doctorList}
              <span className="text-gray-500 font-normal text-[16px] sm:text-[18px] md:text-[20px] lg:text-[20px] xl:text-[20px]">
                {filterTitle()}
              </span>
            </h2>

            {doctorsToRender.length === 0 ? (
              // 🔴 EMPTY STATE
              <div className="py-16 text-center text-gray-500">
                <p className="text-lg font-medium">{t.doctorNotFound}</p>
                <p className="mt-2 text-sm">{t.changeFilter}</p>
              </div>
            ) : (
              <div
                className="grid items-stretch grid-cols-1 gap-6  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 auto-rows-fr"
              >
                {paginatedDoctors.map((dokter) => (
                  <DoctorCard
                    key={dokter.paramedicid}
                    dokter={dokter}
                    bookLabel={t.bookAppointment}
                    addFavorite={t.AddFavorite}
                    token={token}
                    router={router}
                    selectedDate={selectedDate}
                  />
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                ),
              )}

              {/* NEXT */}
              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
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
        </div>
      </div>
      <div id="datepicker-portal" />
    </>
  );
}
