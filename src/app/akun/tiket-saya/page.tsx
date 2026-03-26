"use client";

import DatePicker from "react-datepicker";
import { FiCalendar, FiRotateCcw } from "react-icons/fi";
import Select from "react-select";
import { useEffect, useState, forwardRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { getAppointmentList } from "@/services/GetAppointmentList";
import { getPatientRegistrationHistory } from "@/services/GetPatientRegistrationHistory";
import { getRegistrationOne } from "@/services/GetRegistrationOne";

export default function TiketSayaPage() {

    const { medicalNo, token } = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState<any>(null);
    const [jenisFilter, setJenisFilter] = useState<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [regData, setRegData] = useState<any[]>([]);
    const [regPage, setRegPage] = useState(1);
    const [openReg, setOpenReg] = useState<string | null>(null);
    const [regDetail, setRegDetail] = useState<Record<string, any>>({});
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);
    const REG_PER_PAGE = 6;

    const getPaginationRange = (
        current: number,
        total: number,
        delta: number = 2
        ) => {
            const range = [];

            const start = Math.max(1, current - delta);
            const end = Math.min(total, current + delta);

            for (let i = start; i <= end; i++) {
                range.push(i);
        }
        return range;
    };

    // DEFAULT → Bukti Booking
    const [activePanel, setActivePanel] = useState<"filter" | "recent">("filter");

    const { lang } = useLang();
    const t = lang === "ID" ? ID : EN;

    const DateInput = forwardRef<HTMLInputElement, any>(
        ({ value, onClick, placeholder }, ref) => (
        <div className="relative">
        <input
            ref={ref}
            value={value}
            onClick={onClick}
            placeholder={placeholder}
            readOnly
            inputMode="none"      // ✅ MOBILE TIDAK MUNCUL KEYBOARD
            className="
            w-full
            border border-gray-400
            rounded-lg
            px-3
            py-2
            text-base
            text-gray-700
            cursor-pointer
            caret-transparent
            focus:border-blue-600
            focus:outline-none
            "
        />

        {/* ICON KALENDER */}
            <div
            className="
                pointer-events-none
                absolute right-4 top-1/2 -translate-y-1/2
                text-blue-500
            "
            >
            <FiCalendar size={18} />
            </div>
        </div>
        )
    );
    DateInput.displayName = "DateInput";

    const statusOptions = [
        { value: "ALL", label: t.allStatus },
        { value: "Open", label: "Open" },
        { value: "Confirm", label: "Confirm" },
        { value: "Cancel", label: "Cancel" },
        { value: "Closed", label: "Closed" },
        { value: "No Response", label: "No Response" },
        { value: "Queue Booking", label: "Queue Booking" },
    ];

    const jenisOptions = [
        { value: "ALL", label: t.allJenis },
        { value: "Tunai", label: t.Tunai },
        { value: "Mitra", label: t.Mitra },
    ];

    const notesLabelMap: Record<string,string> = {
        tunai: t.Tunai,
        mitra: t.Mitra,
    };

    const filteredData = data.filter(item => {
        const statusOk =
            !statusFilter ||
            statusFilter.value === "ALL" ||
            item.AppointmentStatusName?.toLowerCase() === statusFilter.value.toLowerCase();

        const jenisOk =
            !jenisFilter ||
            jenisFilter.value === "ALL" ||
            item.Notes?.toLowerCase().includes(jenisFilter.value.toLowerCase());
        return statusOk && jenisOk;
    });

    async function handleOpenDetail(regNo:string){
        // kalau klik yang sudah terbuka → tutup
        if(openReg === regNo){
            setOpenReg(null);
            return;
        }

        // kalau belum pernah load → hit API
        if(!regDetail[regNo]){
            startLoading();

            const res = await getRegistrationOne(regNo);

            const detail = res?.data?.[0];

            if(detail){
            setRegDetail(prev => ({
                ...prev,
                [regNo]: detail
            }));
            }

            endLoading();
        }

        setOpenReg(regNo);
    }

    useEffect(()=>{

        if(activePanel==="filter"){
            // baru masuk booking → reset booking saja
            setStatusFilter(null);
            setJenisFilter(null);
            setCurrentIndex(0);
        }

        if(activePanel==="recent"){
            // baru masuk daftar → reset daftar saja
            setDateFrom(null);
            setDateTo(null);
            setRegPage(1);
            setOpenReg(null);
        }

    },[activePanel]);

    function resetDateFilter(){
        setDateFrom(null);
        setDateTo(null);
        setRegPage(1);   // optional biar balik page 1
    }

    useEffect(()=>{
        setCurrentIndex(0);
    },[statusFilter, jenisFilter, data]);

    useEffect(() => {
        async function load() {
            if (!medicalNo || !token) return;   // ✅ WAJIB dua-duanya
            startLoading();

            const res = await getAppointmentList(medicalNo, token);

            if (res?.data) {
            setData(res.data);
            }
            endLoading();
        }
        load();
    }, [medicalNo]);

    useEffect(() => {
        async function loadReg() {

            if (!medicalNo) return;

            startLoading();

            const res = await getPatientRegistrationHistory({medicalNo});

            if(res?.data){

                setRegData(res.data);

                // 🔥 preload semua detail
                const detailMap:any = {};

                await Promise.all(
                    res.data.map(async (r:any)=>{
                        const d = await getRegistrationOne(r.RegistrationNo);
                        if(d?.data?.[0]){
                            detailMap[r.RegistrationNo] = d.data[0];
                        }
                    })
                );

                setRegDetail(detailMap);
            }

            endLoading();
        }

        loadReg();

    },[medicalNo]);

    const filteredReg = regData.filter(r => {
        const d = parseDotNetDate(r.RegistrationDate);
        if(!d) return true;

        if(dateFrom && d < new Date(dateFrom.setHours(0,0,0,0))) return false;
        if(dateTo && d > new Date(dateTo.setHours(23,59,59,999))) return false;

        return true;
    });
 
    const regStart = (regPage - 1) * REG_PER_PAGE;
    const paginatedReg = filteredReg.slice(regStart, regStart + REG_PER_PAGE);
    const regTotalPages = Math.ceil(filteredReg.length / REG_PER_PAGE);

    function formatDateForRegistration(rawDate: string, registrationTime?: string) {
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
    }

    function formatRegistrationType(type?: string) {
        if (!type) return "-";

        if (type === "OPR") return "Rawat Jalan";
        if (type === "IPR") return "Rawat Inap";

        return type;
    }

    function formatAppointmentDate(dateString?: string) {
        if (!dateString) return "-";

        // ambil angka dari /Date(123123123)/
        const match = dateString.match(/\d+/);
        if (!match) return dateString;

        const date = new Date(Number(match[0]));

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function parseDotNetDate(raw?: string){
        if(!raw) return null;
            const match = raw.match(/\d+/);
        if(!match) return null;
            return new Date(Number(match[0]));
    }

    function BookingCard({ item }: { item: any}) {

        const tanggal = formatAppointmentDate(item.AppointmentDate);

        const estimasi = `${tanggal} ${item.AppointmentTime}`;

        const status = item.AppointmentStatusName?.toLowerCase();

        const statusColor =
            status === "cancel"
                ? "text-red-500"
                : status === "closed"
                ? "text-gray-500"
                : "text-green-600";

    return (
        <div className="relative max-w-md mx-auto rounded-3xl p-px mb-6 bg-gray-400 shadow-sm overflow-hidden">
            
            {/* 🔵 BLUE CIRCLE LEFT */}
            <div className="absolute left-0 top-[60%] -translate-y-1/2 -translate-x-1/2 w-11 h-10 bg-blue-300 rounded-full"></div>

            {/* 🔵 BLUE CIRCLE RIGHT */}
            <div className="absolute right-0 top-[60%] -translate-y-1/2 translate-x-1/2 w-11 h-10 bg-blue-300 rounded-full"></div>

            {/* INNER CARD */}
            <div
                className="relative bg-white rounded-3xl p-5 overflow-hidden"
                style={{
                WebkitMaskImage: `
                    radial-gradient(circle 22px at left 60%, transparent 98%, black 100%),
                    radial-gradient(circle 22px at right 60%, transparent 98%, black 100%),
                    linear-gradient(black, black)
                `,
                WebkitMaskComposite: "destination-out",
                maskComposite: "exclude",
                }}
            >

        {/* PAYMENT BADGE */}
        <div className="flex gap-2 ml-auto mb-3 flex-row-reverse">
        {/* badge untuk Notes asli */}
        <div className="bg-gray-300 px-4 py-1 text-black rounded-md text-[12px] sm:text-[12px] md:text-[11px] lg:text-[12px] xl:text-[14px]">
            {notesLabelMap[item.Notes?.toLowerCase()] ?? item.Notes}
        </div>

        {/* badge untuk Tunai */}
        {item.Notes?.toLowerCase() === "ybrs" && (
            <div className="bg-gray-300 px-4 py-1 text-black rounded-md text-[12px] sm:text-[12px] md:text-[11px] lg:text-[12px] xl:text-[14px]">
            {t.Tunai}
            </div>
        )}
        </div>

        <div className="space-y-2">

            <div className="font-bold text-[16px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[18px] text-center text-black">
            {t.rsImmanuelTicketBooking}
            </div>

            <div className="text-gray-700 text-[14px] sm:text-[14px] md:text-[12px] lg:text-[14px] xl:text-[16px] text-center">
            {item.ParamedicName}
            </div>

            <div className="flex justify-between text-black text-[14px] sm:text-[14px] md:text-[12px] lg:text-[14px] xl:text-[14px]">
            <span>{t.Poli} </span>
            <span className="text-gray-500">{item.ServiceUnitName}</span>
            </div>

            <div className="flex justify-between text-black text-[14px] sm:text-[14px] md:text-[12px] lg:text-[14px] xl:text-[14px]">
            <span>{t.Tanggal}</span>
            <span className="text-gray-500">{tanggal}</span>
            </div>

            <div className="flex justify-between text-black text-[14px] sm:text-[14px] md:text-[12px] lg:text-[14px] xl:text-[14px]">
            <span>{t.kodeBooking}</span>
            <span className="text-gray-500">{item.AppointmentNo}</span>
            </div>

            <div className="flex justify-between text-black text-[14px] sm:text-[14px] md:text-[12px] lg:text-[14px] xl:text-[14px]">
            <span>Status</span>
            <span className={statusColor}>
                {item.AppointmentStatusName}
            </span>
            </div>

        </div>

        {/* DASH LINE PERFECT CENTER */}
        <div className="my-6 relative">
            <div className="border-t-2 border-dashed border-gray-700"></div>
        </div>

        {/* QUEUE */}
        <div className="text-center text-black">

            <div className="font-semibold lg:text-[16px] xl:text-[18px]">
            {t.nomorAntrean}
            </div>

            <div className="text-3xl text-blue-600 font-bold my-1">
            {item.AppointmentQueFormattedNo || item.AppointmentQue}
            </div>

            <div className="font-semibold mt-3">
            {t.estimasiDilayani}
            </div>

            <div className="text-gray-600">
            {estimasi}
            </div>

        </div>

        </div>
        
        </div>
    );
  }
  

  return (
    <>
      {/* CONTENT */}
      <div className="px-4 md:px-5 max-w-8xl mx-auto">

        {/* NAV BUTTON — SEKARANG SEMUA SCREEN */}
        <div className="flex justify-between mb-4 gap-3">

          {/* BUKTI BOOKING */}
          <button
            onClick={() => setActivePanel("filter")}
            className={`flex-1 py-2 rounded-lg text-md font-medium transition cursor-pointer ${
              activePanel === "filter"
                ? "bg-blue-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t.buktiBooking}
          </button>


          {/* BUKTI DAFTAR */}
          <button
            onClick={() => setActivePanel("recent")}
            className={`flex-1 py-2 rounded-lg text-md font-medium transition cursor-pointer ${
              activePanel === "recent"
                ? "bg-blue-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t.buktiDaftar}
          </button>

        </div>


        {/* SLIDER CONTAINER */}
        <div className="relative overflow-hidden mb-6">

          <div
            className={`
              flex transition-transform duration-300 ease-in-out
              ${activePanel === "recent" ? "-translate-x-full" : "translate-x-0"}
            `}
          >

            {/* PANEL BOOKING */}
            <div className="w-full shrink-0">

            {/* FILTER BAR */}
            <div className="flex justify-center mb-5">
                <div className="flex flex-col md:flex-row gap-3 w-full max-w-xl">
                    <div className="flex-1">
                    <Select
                        instanceId="status-select"
                        options={statusOptions}
                        placeholder="Status Appoinment"
                        isSearchable
                        isClearable
                        value={statusFilter}
                        onChange={(val)=>setStatusFilter(val)}
                        classNamePrefix="rs"
                        menuPlacement="auto"
                        maxMenuHeight={5*42}
                    />
                    </div>

                    <div className="flex-1">
                    <Select
                        instanceId="jenis-select"
                        options={jenisOptions}
                        placeholder={t.jenisAppointment}
                        isSearchable
                        isClearable
                        value={jenisFilter}
                        onChange={(val)=>setJenisFilter(val)}
                        classNamePrefix="rs"
                        menuPlacement="auto"
                        maxMenuHeight={5*42}
                    />
                    </div>

                </div>

              </div>
              {filteredData.length === 0 && (
                <div className="text-gray-400">
                    {t.tidakAdaBooking}
                </div>
                )}

                {filteredData.length > 0 && (
                <div className="relative max-w-md mx-auto">
                    {/* CARD */}
                    {filteredData[currentIndex] && (
                      <BookingCard item={filteredData[currentIndex]} />
                    )}
                   
                    {/* PAGINATION — CONSISTENT STYLE */}
                    {filteredData.length > 1 && (
                    <div className="flex justify-center items-center flex-wrap gap-2 mt-6">

                    {/* PREV */}
                    <button
                    onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                    disabled={currentIndex === 0}
                    className={`
                        px-3 py-2 rounded-lg border text-sm
                        ${
                        currentIndex === 0
                            ? "text-gray-400 border-gray-300 cursor-not-allowed"
                            : "text-gray-700 border-gray-400 hover:bg-gray-100"
                        }
                    `}
                    >
                    ‹
                    </button>
                    {/* PAGE NUMBERS */}
                    {Array.from(
                    {
                        length: Math.min(5, filteredData.length),
                    },
                    (_, i) => {
                        const start = Math.max(
                        0,
                        Math.min(
                            currentIndex - 2,
                            filteredData.length - 5
                        )
                        );

                        return start + i;
                    }
                    )
                    .filter(i => i >= 0 && i < filteredData.length)
                    .map(i => (
                        <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`
                            px-3 py-2 rounded-lg text-sm border
                            ${
                            currentIndex === i
                                ? "bg-blue-900 text-white border-blue-900"
                                : "text-gray-700 border-gray-400 hover:bg-gray-100"
                            }
                        `}
                        >
                        {i + 1}
                        </button>
                    ))}
                    {/* NEXT */}
                    <button
                    onClick={() =>
                        setCurrentIndex(i => Math.min(filteredData.length - 1, i + 1))
                    }
                    disabled={currentIndex === filteredData.length - 1}
                    className={`
                        px-3 py-2 rounded-lg border text-sm
                        ${
                        currentIndex === filteredData.length - 1
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
                )}
            </div> 


            {/* PANEL DAFTAR */}
            <div className="w-full shrink-0">

            {/* DATE FILTER */}
            <div className="flex justify-center mb-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl justify-center items-center">

                    {/* FROM */}
                    <DatePicker
                    selected={dateFrom}
                    onChange={(d: Date | null)=>setDateFrom(d)}
                    customInput={<DateInput />}
                    placeholderText={t.dariTanggal}
                    dateFormat="yyyy-MM-dd"
                    wrapperClassName="w-full"
                    portalId="datepicker-portal"
                    />

                    {/* TEXT TENGAH */}
                    <div className="text-gray-600 font-semibold whitespace-nowrap">
                        {t.range}
                    </div>

                    {/* TO + RESET ICON WRAPPER */}
                    <div className="relative w-full flex items-center gap-2">

                    <div className="flex-1">
                        <DatePicker
                        selected={dateTo}
                        onChange={(d: Date | null)=>setDateTo(d)}
                        customInput={<DateInput />}
                        dateFormat="yyyy-MM-dd"
                        placeholderText={t.sampaiTanggal}
                        portalId="datepicker-portal"
                        wrapperClassName="w-full"
                        />
                    </div>

                    {/* RESET BUTTON */}
                    <button
                        onClick={resetDateFilter}
                        className="
                            flex items-center justify-center
                            w-10 h-10
                            border border-gray-400
                            rounded-lg
                            text-blue-600
                            hover:bg-blue-50
                            active:scale-95
                            transition
                            cursor-pointer
                        "
                        title="Reset"
                        >
                        <FiRotateCcw size={18}/>
                    </button>

                    </div>
                </div>
            </div>
  
            {filteredReg.length === 0 && (
                <div className="text-gray-400">
                    {t.tidakAdaBuktiDaftar}
                </div>
            )}
            {regData.length > 0 && (
            <>
            {/* CARD GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paginatedReg.map((item, index) => (

            <div
                key={index}
                className="relative border border-gray-400 rounded-xl p-3 bg-white shadow-sm hover:shadow-md transition"
            >

            <div className="flex items-start gap-3 mb-2">
                {/* LEFT → LOGO */}
                <img
                    src="/Logo RSI.png"
                    alt="RSI Logo"
                    className="w-10 h-10 object-contain opacity-90"
                />

                {/* RIGHT → REG NO + DATE */}
                <div className="text-left">
                    <div className="font-semibold text-black text-[14px] sm:text-[14px] md:text-[14px] lg:text-[12px] xl:text-[14px]">
                        {t.rsImmanuelForBuktiDaftar}
                    </div>

                    <div className="text-[12px] sm:text-[12px] md:text-[12px] lg:text-[11px] xl:text-[12px] text-gray-400">
                       Jl.Kopo No.161 Situsaeur Bandung 40233
                    </div>
                </div>

            </div>
            <div className="border-t border-gray-300 my-2"></div>

            <div className="text-[13px] sm:text-[13px] md:text-[13px] lg:text-[12px] xl:text-[13px] text-black font-bold mb-1">
                {t.noRegistrasi} {item.RegistrationNo}
            </div>

            <div className="text-[12px] sm:text-[12px] md:text-[12px] lg:text-[11px] xl:text-[12px] text-gray-500 font-semibold mb-1">
                {formatDateForRegistration(item.RegistrationDate, item.RegistrationTime)}
            </div>

            <div className="text-[13px] sm:text-[13px] md:text-[13px] lg:text-[12px] xl:text-[13px] text-black mb-1">
                {item.ParamedicName || "-"}
            </div>

            <div className="text-[12px] sm:text-[12px] md:text-[12px] lg:text-[11px] xl:text-[12px] text-gray-400 mb-2">
                {item.ServiceUnitName}
                <span className="text-gray-400 font-normal">
                    {" "}— {formatRegistrationType(item.SRRegistrationType)}
                </span>
            </div>

            <div className="text-[12px] sm:text-[12px] md:text-[12px] lg:text-[11px] xl:text-[12px] text-gray-600">
                {t.catatan} {item.Notes || "-"}
            </div>

            <div className="border-t border-gray-300 my-1"></div>
               {/* LIHAT DETAIL BUTTON FULL */}
                <div className="px-2 pb-2">
                    <button
                        onClick={()=>handleOpenDetail(item.RegistrationNo)}
                        className="
                        w-full
                        flex items-center justify-center gap-2
                        bg-blue-800 hover:bg-blue-500
                        text-white font-semibold
                        py-1.5
                        rounded-lg
                        transition
                        cursor-pointer
                        "
                    >
                        {t.lihatDetail}

                        {/* CHEVRON DOWN */}
                        <svg
                        className={`w-5 h-5 transition-transform duration-300
                        ${openReg === item.RegistrationNo ? "rotate-180" : ""}
                        `}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.8"
                        viewBox="0 0 24 24"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                        </svg>
                    </button>

                    {/* DETAIL PANEL */}
                    <div
                    className={`
                    overflow-hidden
                    transition-all duration-500
                    ${openReg === item.RegistrationNo ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"}
                    `}
                    >

                    {regDetail[item.RegistrationNo] && (

                    <div className="border rounded-lg p-3 bg-gray-50 text-black text-[12px] sm:text-[12px] md:text-[12px] lg:text-[11px] xl:text-[12px]">

                    <div className="grid grid-cols-[122px_10px_1fr] sm:grid-cols-[122px_10px_1fr] md:grid-cols-[122px_10px_1fr] lg:grid-cols-[112px_10px_1fr] xl:grid-cols-[125px_10px_1fr] gap-y-1">

                        <div className="font-semibold">{t.Nama}</div>
                        <div>:</div>
                        <div>{regDetail[item.RegistrationNo].FirstName}</div>

                        <div className="font-semibold">{t.noMedicalRecord}</div>
                        <div>:</div>
                        <div>{regDetail[item.RegistrationNo].MedicalNo}</div>

                        <div className="font-semibold">{t.penjamin}</div>
                        <div>:</div>
                        <div>{regDetail[item.RegistrationNo].GuarantorName}</div>

                        <div className="font-semibold">{t.jenisKunjungan}</div>
                        <div>:</div>
                        <div>{regDetail[item.RegistrationNo].VisitTypeName || "-"}</div>

                        <div className="font-semibold">Diagnosis</div>
                        <div>:</div>
                        <div>{regDetail[item.RegistrationNo].DiagnosisText || "-"}</div>

                    </div>

                    </div>

                    )}

                    </div>
                </div>
            </div>

            ))}

            </div>

            {/* PAGINATION */}
            {regTotalPages > 1 && (
            <div className="flex justify-center items-center flex-wrap gap-2 mt-6">
                {/* PREV */}
                <button
                    onClick={()=>setRegPage(p=>Math.max(1,p-1))}
                    disabled={regPage===1}
                    className={`
                    px-3 py-2 rounded-lg border text-sm
                    ${
                    regPage===1
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-gray-700 border-gray-400 hover:bg-gray-100"
                    }
                `}
                >
                ‹
                </button>
                {/* NUMBERS */}
                {getPaginationRange(regPage, regTotalPages).map(p => (
                <button
                    key={p}
                    onClick={()=>setRegPage(p)}
                    className={`
                    px-3 py-2 rounded-lg text-sm border
                    ${
                    regPage===p
                    ? "bg-blue-900 text-white border-blue-900"
                    : "text-gray-700 border-gray-400 hover:bg-gray-100"
                    }
                `}
                >
                {p}
                </button>

                ))}
                {/* NEXT */}
                <button
                    onClick={()=>setRegPage(p=>Math.min(regTotalPages,p+1))}
                    disabled={regPage===regTotalPages}
                    className={`
                    px-3 py-2 rounded-lg border text-sm
                    ${
                    regPage===regTotalPages
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
          </div>
        </div>
      </div>

    </>
  );
}