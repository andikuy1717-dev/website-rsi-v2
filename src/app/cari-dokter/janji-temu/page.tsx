"use client";

import Swal from "sweetalert2";
import { useRouter, useSearchParams } from "next/navigation";
import { forwardRef, Suspense, useEffect, useState } from "react";import Image from "next/image";
import { fetchParamedicServiceUnit } from "@/services/ParamedicServiceUnitService";
import { fetchParamedicSchedule, ParamedicSchedule } from "@/services/ParamedicSchedule";
import { fetchServiceUnitNonBPJSMixed } from "@/services/ServiceUnitNonBPJSMixedService";
import { checkBRS } from "@/services/CheckPatientBRS"; // import service baru
import { startLoading, endLoading } from "@/utils/LoadingManager";
import DatePicker from "react-datepicker";
import { id, enUS } from "date-fns/locale";
import { FiCalendar, FiClock, FiArrowLeft, FiCheckCircle, FiUser } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { addDays, format } from "date-fns";
import Select from "react-select";
import { getPatients, PatientItem } from "@/services/GetPesertaWithMedicalNumbers";
import ModalKonfirmasiAppointment from "./components/ModalKonfirmasiAppointment";
import { createAppointment } from "@/services/AppointmentCreateService";
import { getPatientByMedicalNo } from "@/services/GetPatientByMedicalNoForPatientId";
import { createTransactionMitra } from "@/services/TransactionMitraService";
import { getAppointmentByMedicalNo } from "@/services/GetAppointmentByMedicalNo";
import { fetchAutoBillingList, AutoBillingResponse } from "@/services/RegistrationAutoBillingService";
import { PaymentTestRequest, PaymentTestResponse, createPaymentTest } from "@/services/PaymentDokuTest";

type DoctorDetail = {
  paramedicid: string;
  paramedicname: string;
  serviceunitnames: string[]; // ✅ ubah ini dari string ke array
  foto_base64?: string;
};

function JanjiTemuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams?.get("date");
  const dokterId = searchParams?.get("dokterId"); // 👈 dari URL
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;

  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const dateLocale = lang === "ID" ? id : enUS;

  const [selectedPeserta, setSelectedPeserta] = useState<{ value: string; label: string; } | null>(null);
  const [pesertaOptions, setPesertaOptions] = useState<{ value: string; label: string }[]>([]);
  const [doctorSchedules, setDoctorSchedules] = useState<ParamedicSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<ParamedicSchedule | null>(null);

  type PatientType = "Tunai" | "Mitra" | "YBRS";
  const [patientType, setPatientType] = useState<PatientType | null>(null);

  const isFormComplete = Boolean(patientType) && Boolean(selectedPeserta) && Boolean(selectedSchedule);
  const [hasBRS, setHasBRS] = useState(false);
  const maxDays = patientType === "Tunai" ? 7 : 30;
  const [brsUnitIds, setBrsUnitIds] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [billingTotal, setBillingTotal] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openConfirmModal = async () => {

    if (patientType !== "Tunai") {
      setBillingTotal(null);
      setShowConfirmModal(true);
      return;
    }

    if (selectedSchedule && doctor) {
      try {
        const billing: AutoBillingResponse =
          await fetchAutoBillingList(
            selectedSchedule.ServiceUnitID,
            doctor.paramedicid
          );

        const total = billing?.data?.reduce(
          (sum, item) => sum + Number(item.Total),
          0
        ) ?? 0;

        setBillingTotal(total);

      } catch {
        setBillingTotal(0);
      }
    }

    setShowConfirmModal(true);
  };

  const getPatientTypeLabel = (type: PatientType | null) => {
    if (!type) return "";
    switch (type) {
      case "Tunai":
        return t.pasienTunai;
      case "Mitra":
        return t.pasienMitra;
      case "YBRS":
        return t.pasienYBRS;
      default:
        return type;
    }
  };

  const formatTimeRange = (start?: string, end?: string) => {
    if (!start || !end) return "";

    const today = new Date().toISOString().split("T")[0];

    const startDate = new Date(`${today}T${start}`);
    const endDate = new Date(`${today}T${end}`);

    if (lang === "EN") {
      return `${format(startDate, "hh:mm a")} - ${format(endDate, "hh:mm a")}`;
    }

    return `${format(startDate, "HH:mm")} - ${format(endDate, "HH:mm")}`;
  };


  // ================= CHECK BRS =================
  useEffect(() => {
    const medicalNo = localStorage.getItem("medicalNo");
    const token = localStorage.getItem("token");

    if (!medicalNo || !token) {
      setHasBRS(false);
      return;
    }

    startLoading();
    checkBRS(medicalNo, token)
      .then(res => {
        if (res.status === "SUCCESS" && res.data?.status) {
          setHasBRS(true); // ada BRS, tampilkan radio YBRS
        } else {
          setHasBRS(false); // tidak ada, sembunyikan
        }
      })
      .catch(() => setHasBRS(false))
      .finally(() => endLoading());
  }, []);

  useEffect(() => {
    if (patientType !== "YBRS") {
      setBrsUnitIds(new Set());
      return;
    }

    startLoading();
    fetchServiceUnitNonBPJSMixed()
      .then((units) => {
        const brsOnly = units
          .filter(u => u.type?.toLowerCase() === "brs")
          .map(u => u.serviceunitid);

        setBrsUnitIds(new Set(brsOnly));
      })
      .catch(() => setBrsUnitIds(new Set()))
      .finally(() => endLoading());
  }, [patientType]);

  useEffect(() => {
    setSelectedSchedule(null);
  }, [selectedDate, selectedPeserta]);

  useEffect(() => {
    const today = new Date();
    const maxAllowedDate = addDays(today, patientType === "Tunai" ? 7 : 30);

    if (!dateParam) {
      setSelectedDate(today);
      return;
    }

    const parsed = new Date(dateParam);

    if (isNaN(parsed.getTime())) {
      setSelectedDate(today);
      return;
    }

    if (parsed > maxAllowedDate || parsed < today) {
      setSelectedDate(today);
    } else {
      setSelectedDate(parsed);
    }
  }, [dateParam, patientType]);

  const DateInput = forwardRef<HTMLInputElement, any>(
    ({ value, onClick, placeholder }, ref) => (
      <div className="relative w-full">
        <input
          ref={ref}
          value={value}
          onClick={onClick}
          placeholder={placeholder}
          readOnly
          inputMode="none"
          className="
            w-full
            h-[52px]
            rounded-xl
            border
            border-[#DCE1EE]
            bg-white
            px-4
            pr-12
            text-[13px]
            sm:text-[14px]
            font-medium
            text-[#1B2A78]
            cursor-pointer
            caret-transparent
            outline-none
            transition-all
            hover:border-[#AEB8D5]
            focus:border-[#1B2A78]
            focus:ring-2
            focus:ring-[#1B2A78]/10
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            flex
            items-center
            justify-center
            text-[#1B2A78]
          "
        >
          <FiCalendar size={18} />
        </div>
      </div>
    )
  );

  DateInput.displayName = "DateInput";

  /* ================= FETCH DOKTER ================= */
  useEffect(() => {
    if (!dokterId) {
      setError("Dokter tidak ditemukan");
      return;
    }

    startLoading();

    fetchParamedicServiceUnit()
      .then((list) => {
        // grouping per paramedicid
        const grouped = list.reduce<Record<string, DoctorDetail>>((acc, d) => {
          if (!acc[d.paramedicid]) {
            acc[d.paramedicid] = {
              paramedicid: d.paramedicid,
              paramedicname: d.paramedicname,
              serviceunitnames: [d.serviceunitname],
              foto_base64: d.foto_base64,
            };
          } else {
            if (!acc[d.paramedicid].serviceunitnames.includes(d.serviceunitname)) {
              acc[d.paramedicid].serviceunitnames.push(d.serviceunitname);
            }
          }
          return acc;
        }, {});

        // ✅ AMBIL SESUAI dokterId
        const selectedDoctor = grouped[dokterId];

        if (!selectedDoctor) {
          setError("Dokter tidak ditemukan");
          setDoctor(null);
        } else {
          setDoctor(selectedDoctor);
          setError(null);
        }
      })
      .catch(() => {
        setError("Data dokter tidak dapat dimuat");
      })
      .finally(() => endLoading());
  }, [dokterId]);

  /* ================= FETCH PESERTA ================= */
  useEffect(() => {
    const medicalNo = localStorage.getItem("medicalNo");
    const token = localStorage.getItem("token"); // pastikan lo simpan token juga di localStorage

    if (!medicalNo || !token) return;

    startLoading();
    getPatients(medicalNo, token)
      .then((res) => {
        if (res.status === "success" && res.patients) {
          const options = res.patients.map((p: PatientItem) => ({
            value: p.medicalNo,
            label: `${p.fullName}`,
          }));

          setPesertaOptions(options);
          setSelectedPeserta(null); // 🔥 reset supaya tidak mismatch
        } else {
          setPesertaOptions([]);
        }
      })
      .catch(() => setPesertaOptions([]))
      .finally(() => endLoading());
  }, []);

  // ================= FETCH SCHEDULE =================
  useEffect(() => {
    if (!selectedDate || !doctor) {
      setDoctorSchedules([]);
      return;
    }

    const dateStr = selectedDate.toLocaleDateString("en-CA"); // YYYY-MM-DD

    startLoading();
    fetchParamedicSchedule({
      dateStart: dateStr,
      dateEnd: dateStr,
      paramedicId: doctor.paramedicid,
    })
      .then((schedules) => {
        // 🔥 BANGUN MAP unitName -> unitId (AMAN)
        const unitNameToIdMap = new Map<string, string>();
        schedules.forEach(s => {
          unitNameToIdMap.set(s.ServiceUnitName, s.ServiceUnitID);
        });

        // 🔥 allowed unit ID dokter
        const allowedUnitIds = new Set(
          doctor.serviceunitnames
            .map(name => unitNameToIdMap.get(name))
            .filter(Boolean)
        );

        // ✅ FILTER PAKAI ID (SAMA PERSIS KAYAK CARI-DOKTER)
        const filteredSchedules = schedules.filter(s =>
          allowedUnitIds.has(s.ServiceUnitID)
        );

        setDoctorSchedules(filteredSchedules);
      })
      .catch(() => setDoctorSchedules([]))
      .finally(() => endLoading());
  }, [selectedDate, doctor]);

  // ================= TOMBOL DAFTAR APPOINTMENT MODAL KONFIRMASI =================
  const handleSubmitAppointment = async () => {
    if (isSubmitting) return; // 🚫 cegah klik kedua

    setIsSubmitting(true); // 🔒 lock
    setShowConfirmModal(false);

  try {
    const selectedPatientId = selectedPeserta?.value;

    if (!selectedPatientId) {
      await Swal.fire({
        icon: "error",
        title: lang === "ID" ? "Gagal" : "Failed",
        text: t.medicalNumberTidakDitemukan,
        scrollbarPadding: false,
      });
      return;
    }

    if (!selectedDate) {
      await Swal.fire({
        icon: "warning",
        title: lang === "ID" ? "Perhatian!" : "Warning!",
        text: t.tanggalBelumDipilih,
        scrollbarPadding: false,
      });
      return;
    }

    if (!selectedSchedule || !doctor) {
      await Swal.fire({
        icon: "warning",
        title: lang === "ID" ? "Perhatian!" : "Warning!",
        text: t.dataJadwalTidakLengkap,
        scrollbarPadding: false,
      });
      return;
    }

    const appointmentDate = selectedDate.toISOString().split("T")[0];

    // 1️⃣ GET PATIENT ID
    const patient = await getPatientByMedicalNo(selectedPatientId);

    if (patient.status !== "OK" || !patient.data) {
      await Swal.fire({
        icon: "error",
        title: lang === "ID" ? "Gagal" : "Failed",
        text: t.dataPasienTidakDitemukan,
        scrollbarPadding: false,
      });
      return;
    }

    const patientId = patient.data.PatientID;

    // 2️⃣ CREATE APPOINTMENT
    const appointment = await createAppointment({
      ServiceUnitID: selectedSchedule.ServiceUnitID,
      ParamedicID: doctor.paramedicid,
      AppointmentDate: appointmentDate,
      AppointmentTime: "AUTO",
      PatientID: patientId,
      FirstName: patient.data.FirstName,
      MiddleName: patient.data.MiddleName,
      LastName: patient.data.LastName,
      DateOfBirth: patient.data.DateOfBirth_yMdHms.split(" ")[0],
      Sex: patient.data.Sex as "M" | "F",
      MobilePhoneNo: patient.data.MobilePhoneNo,
      Email: patient.data.Email,
      GuarantorID: "P2553",
      StreetName: patient.data.StreetName,
      District: patient.data.District,
      County: patient.data.County,
      State: patient.data.State,
      City: patient.data.City,
      ZipCode: patient.data.ZipCode,
      PhoneNo: patient.data.PhoneNo,
      Notes: patientType ?? undefined,
      Ssn: patient.data.Ssn,
      BirthPlace: patient.data.BirthPlace,      
    });

    console.log("APPOINTMENT FULL RESPONSE:", appointment);

    if (!appointment || appointment.status !== "OK") {
      await Swal.fire({
        icon: "error",
        title: lang === "ID" ? "Gagal" : "Failed",
        text: appointment?.message ?? t.failedCreateAppointment,
        scrollbarPadding: false,
      });
      return;
    }

    const avicenna = appointment.data;

    // ================= HANDLE ERROR DARI AVICENNA =================
    if (!avicenna || avicenna.status === "ERR") {

      const errorCode = avicenna?.errorCode;
      let errorMessage = avicenna?.data || "Terjadi kesalahan";

      // 🔥 MAPPING ERROR CODE
      switch (errorCode) {
        case "210": {
          const response = await getAppointmentByMedicalNo(selectedPatientId);

          console.log("LIST APPOINTMENT RESPONSE:", response);

          // 🔥 AMBIL ARRAY NYA DENGAN AMAN
          const appointmentList =
            response?.data ??
            response?.d ??
            response ??
            [];

          if (!Array.isArray(appointmentList)) {
            console.error("Appointment list bukan array:", appointmentList);
          }

          const matched = Array.isArray(appointmentList)
            ? appointmentList.find((item: any) => {
                return (
                  item.ServiceUnitName === selectedSchedule?.ServiceUnitName &&
                  item.ParamedicName === doctor?.paramedicname &&
                  item.AppointmentDate_yMdHms?.split(" ")[0] === appointmentDate &&
                  item.AppointmentStatus === "01" // 🔥 hanya OPEN
                );
              })
            : null;

          const existingAppointmentNo = matched?.AppointmentNo ?? "";

          const tanggalFormatted = selectedDate
            ? selectedDate.toLocaleDateString(
                lang === "ID" ? "id-ID" : "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )
            : appointmentDate;

          await Swal.fire({
            icon: "error",
            title:
              lang === "ID"
                ? "Appointment Sudah Terdaftar"
                : "Appointment Already Registered",
                customClass: {
                  title: "swal-title-small-for-appointment"
                },

            html: `
              <div style="text-align:left;font-size:14px;line-height:1.8">
                
                <p style="margin-bottom:10px;">
                  ${
                    lang === "ID"
                      ? "Anda sudah pernah membuat janji temu dengan detail berikut:"
                      : "You have already made an appointment with the following details:"
                  }
                </p>

                <hr style="margin:10px 0;border:0;border-top:1px solid #e5e7eb;" />

                <div style="
                  display:grid;
                  grid-template-columns: 160px 1fr;
                  row-gap:8px;
                  column-gap:10px;
                  align-items:start;
                ">

                  ${
                    existingAppointmentNo
                      ? `
                        <div><strong>${
                          lang === "ID" ? "Nomor Appointment" : "Appointment Number"
                        }</strong></div>
                        <div style="color:#1e40af;font-weight:600;">
                          : ${existingAppointmentNo}
                        </div>
                      `
                      : ""
                  }

                  <div><strong>${lang === "ID" ? "Tanggal" : "Date"}</strong></div>
                  <div>: ${tanggalFormatted}</div>

                  <div><strong>${lang === "ID" ? "Poli / Klinik" : "Clinic"}</strong></div>
                  <div>: ${selectedSchedule?.ServiceUnitName}</div>

                  <div><strong>${lang === "ID" ? "Dokter" : "Doctor"}</strong></div>
                  <div>: ${doctor?.paramedicname}</div>

                </div>

                <hr style="margin:12px 0;border:0;border-top:1px dashed #d1d5db;" />

                <p style="font-size:13px;color:#6b7280;">
                  ${
                    lang === "ID"
                      ? "Silakan gunakan appointment yang sudah ada atau batalkan terlebih dahulu sebelum membuat yang baru."
                      : "Please use the existing appointment or cancel it first before creating a new one."
                  }
                </p>

              </div>
            `,
            confirmButtonColor: "#1e40af",
            confirmButtonText: lang === "ID" ? "Baik, Mengerti" : "Understood",
            scrollbarPadding: false,
          });

          return;
        }

      // ================= SLOT TIDAK ADA =================
      case "201":
        await Swal.fire({
          icon: "error",
          title: lang === "ID" ? "Slot Tidak Tersedia" : "Slot Not Available",
          text: t.slotUnavailableAppointment,
          confirmButtonColor: "#1e40af",
        });
        return;


      // ================= DOKTER TIDAK PRAKTEK =================
      case "202":
        await Swal.fire({
          icon: "error",
          title: lang === "ID" ? "Dokter Tidak Memiliki Jadwal" : "Doctor Has No Schedule",
          text: t.doctorNoScheduleAppointment,
          confirmButtonColor: "#1e40af",
        });
        return;


      // ================= SLOT SUDAH DIAMBIL =================
      case "400":
        await Swal.fire({
          icon: "warning",
          title: lang === "ID" ? "Slot Sudah Terisi" : "Slot Already Taken",
          text: t.slotTakenCreateAppointment,
          confirmButtonColor: "#1e40af",
        });
        return;


      // ================= FIELD KOSONG =================
      case "300":
        await Swal.fire({
          icon: "error",
          title: lang === "ID" ? "Data Tidak Lengkap" : "Incomplete Data",
          text: errorMessage || t.incompleteCreateAppointment,
          confirmButtonColor: "#1e40af",
        });
        return;


      // ================= DATA INVALID =================
      case "301":
        await Swal.fire({
          icon: "error",
          title: lang === "ID" ? "Data Tidak Valid" : "Invalid Data",
          text: errorMessage || t.invalidCreateAppointment,
          confirmButtonColor: "#1e40af",
        });

      return;
        default:
          errorMessage = errorMessage || t.failedCreateAppointment;
      }

      await Swal.fire({
        icon: "error",
        title: lang === "ID" ? "Appointment Gagal" : "Failed Appointment",
        text: errorMessage,
        confirmButtonColor: "#1e40af",
        scrollbarPadding: false,
      });

      return; // 🔥 STOP JANGAN LANJUT TRANSAKSI
    }

    // ================= SUCCESS =================
    const appointmentNo = avicenna.data?.AppointmentNo;

    if (!appointmentNo) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: lang === "ID" ? "Nomor Appointment Tidak Ditemukan" : "Appointment Number Not Found",
        scrollbarPadding: false,
      });
      return;
    }

      // 3️⃣ HANDLE TRANSAKSI SESUAI TIPE PASIEN
      if (patientType === "Mitra") {
        // 🔹 MITRA → Simpan transaksi Mitra
        const trx = await createTransactionMitra({
          medicalNo: patient.data.MedicalNo,
          appointmentNo,
          paramedicName: doctor.paramedicname,
          serviceUnitName: selectedSchedule.ServiceUnitName,
        });

        if (trx.status !== "SUCCESS") {
          await Swal.fire({
            icon: "error",
            title: lang === "ID" ? "Transaksi Gagal" : "Failed Transaction",
            text: trx.message ?? t.transaksiMitraGagal,
            scrollbarPadding: false,
          });
          return;
        }

        await Swal.fire({
          icon: "success",
          title: lang === "ID" ? "Appointment Berhasil!" : "Appointment Created!",
          html: `
            <div style="text-align:center">
              <p>${lang === "ID" ? "Nomor Appointment" : "Appointment Number"}</p>
              <h2 style="margin:0;color:#1e40af;">${appointmentNo}</h2>
              <hr style="margin:16px 0;border-top:1px dashed #ccc;" />
              <p style="font-size:14px;color:#555;">
                ${lang === "ID"
                  ? "Silahkan Lakukan Check In pada Aplikasi IMMA Mobile Apps atau Hubungi Petugas."
                  : "Please check in via the IMMA mobile app or contact a staff member."}
              </p>
            </div>
          `,
          confirmButtonText: lang === "ID" ? "OK" : "OK",
          confirmButtonColor: "#1e40af",
          scrollbarPadding: false,
        });

        router.push("/cari-dokter");
      } 
      else if (patientType === "Tunai") {
        // 🔹 TUNAI → TEST DOKU SANDBOX

        const paymentPayload: PaymentTestRequest = {
          type: "doku",
          appointmentNo,
          medicalNo: patient.data.MedicalNo,
          paramedicName: doctor.paramedicname,
          serviceUnitName: selectedSchedule.ServiceUnitName,

          amount: billingTotal?.toString() ?? "0",

          name: patient.data.FirstName,
          lastname: patient.data.LastName || "",
          phone: patient.data.MobilePhoneNo || "",
          email: patient.data.Email || "",
          address: patient.data.StreetName || "-",
          postcode: patient.data.ZipCode || "-",
          state: patient.data.District || "-",
          city: patient.data.City || "-",
          country: patient.data.County || "-",
        };

        // 🔥 CALL DOKU SANDBOX
        const payment: PaymentTestResponse =
          await createPaymentTest(paymentPayload);

        console.log("PAYMENT TEST RESPONSE:", payment);

        if (!payment?.response) {
          await Swal.fire({
            icon: "error",
            title:
              lang === "ID"
                ? "Payment gagal"
                : "Payment failed",
            text: Array.isArray(payment?.message)
              ? payment.message.join(", ")
              : payment?.message || "Terjadi kesalahan",
            scrollbarPadding: false,
          });

          return;
        }

        // 🔥 AMBIL CHECKOUT URL DOKU SANDBOX
        const checkoutUrl =
          payment.response?.payment?.url ||
          payment.response?.checkoutUrl ||
          payment.response?.paymentUrl ||
          payment.response?.url;

        if (!checkoutUrl) {
          await Swal.fire({
            icon: "error",
            title: "Payment error",
            text: "Checkout URL tidak ditemukan",
            scrollbarPadding: false,
          });

          return;
        }

        console.log("DOKU SANDBOX CHECKOUT URL:", checkoutUrl);

        // 🔥 BUKA DOKU SANDBOX
        window.open(
          checkoutUrl,
          "_blank",
          "noopener,noreferrer"
        );

        router.push("/cari-dokter");
      }
      else {
        await Swal.fire({
          icon: "success",
          title: lang === "ID" ? "Berhasil!" : "Success!",
          text: lang === "ID"
            ? "Appointment berhasil dibuat."
            : "Appointment successfully created.",
          confirmButtonColor: "#1e40af",
          scrollbarPadding: false,
        });
        router.push("/cari-dokter");
      }

    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false); // 🔓 unlock
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F6FC]">

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden bg-[#1B2A78]">

        {/* Decorative background */}
        <div
          className="
            absolute
            -right-24
            -top-24
            h-[320px]
            w-[320px]
            rounded-full
            bg-white/5
            blur-3xl
          "
        />

        <div
          className="
            absolute
            left-1/3
            bottom-[-120px]
            h-[240px]
            w-[240px]
            rounded-full
            bg-[#E0A918]/10
            blur-3xl
          "
        />

        {/* ================= HERO BANNER SECTION ================= */}
        <div className="w-full bg-[#182772] px-6 pb-20 pt-15 text-white sm:px-8 sm:pb-24 md:px-12 lg:px-16 xl:px-20">
          <div className="mx-auto w-full max-w-[1440px]">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

              <div className="flex max-w-xl flex-col gap-3">

                <p className="text-xs font-normal leading-none text-white/75 sm:text-sm">
                  Beranda / Cari Dokter / Buat Janji Temu
                </p>

                <div>
                  <h1 className="mb-3 text-[32px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[42px] md:text-[48px] lg:text-[52px] lg:leading-[1.1]">
                    {t.bookAppointment}
                  </h1>

                  <p className="max-w-xl text-[14px] font-normal leading-[1.6] text-[#C2CEEB] sm:text-base md:text-[17px]">
                    {t.pilihJadwalKunjunganDokter}
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>

      </section>

      {/* =========================================================
          MAIN CONTENT
          Overlap hero seperti halaman Cari Dokter
      ========================================================== */}
      <main
          className="
            relative
            mx-auto
            -mt-[50px]
            w-full
            max-w-[1280px]
            px-5
            sm:px-6
            lg:px-8
            pb-12
          "
        >

        {/* =======================================================
            BOOKING CARD
        ======================================================== */}
        <section
          className="
            relative
            rounded-[20px]
            border
            border-[#E0E4EF]
            bg-white
            shadow-[0_16px_40px_rgba(13,22,66,0.10)]
          "
        >

          {/* ================= CARD HEADER ================= */}
          <div
            className="
              border-b
              border-[#E8EAF1]
              px-5
              sm:px-7
              lg:px-8
              py-5
              sm:py-6
            "
          >

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    sm:text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#E0A918]
                  "
                >
                  Jadwal & Pemesanan
                </p>

                <h2
                  className="
                    mt-1
                    text-[18px]
                    sm:text-[21px]
                    lg:text-[23px]
                    font-extrabold
                    tracking-[-0.025em]
                    text-[#0D1642]
                  "
                >
                  {doctor?.paramedicname || "Dokter"}
                </h2>

              </div>


              {/* Doctor unit */}
              {doctor?.serviceunitnames?.length ? (
                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  {doctor.serviceunitnames.map((name, index) => (
                    <span
                      key={index}
                      className="
                        rounded-full
                        bg-[#F1F3FA]
                        px-3
                        py-1.5
                        text-[10px]
                        sm:text-[11px]
                        font-semibold
                        text-[#1B2A78]
                      "
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ) : null}

            </div>

          </div>


          {/* =====================================================
              FORM CONTENT
          ====================================================== */}
          <div className="px-5 sm:px-7 lg:px-8 py-6 sm:py-7 lg:py-8">


            {/* ===================================================
                DOCTOR MOBILE CARD
            ==================================================== */}
            <div
              className="
                mb-7
                flex
                sm:hidden
                items-center
                gap-4
                rounded-2xl
                border
                border-[#E3E6EF]
                bg-[#F8F9FD]
                p-4
              "
            >

              <div
                className="
                  h-[64px]
                  w-[64px]
                  shrink-0
                  overflow-hidden
                  rounded-xl
                  bg-[#E9ECF7]
                "
              >
                <Image
                  src={
                    doctor?.foto_base64
                      ? `data:image/jpeg;base64,${doctor.foto_base64}`
                      : "/doctor_dummy.png"
                  }
                  alt="Doctor"
                  width={64}
                  height={64}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              </div>

              <div className="min-w-0">

                {error ? (
                  <p className="text-[12px] text-red-500">
                    {error}
                  </p>
                ) : doctor ? (
                  <>
                    <p
                      className="
                        text-[14px]
                        font-extrabold
                        leading-snug
                        text-[#0D1642]
                      "
                    >
                      {doctor.paramedicname}
                    </p>

                    <div className="mt-1">
                      {doctor.serviceunitnames?.map((name, i) => (
                        <p
                          key={i}
                          className="
                            text-[11px]
                            leading-5
                            text-[#747B90]
                          "
                        >
                          {name}
                        </p>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-[12px] text-gray-400">
                    {t.memuatJadwalDokter}
                  </p>
                )}

              </div>

            </div>


            {/* ===================================================
                JENIS PASIEN
            ==================================================== */}
            <div>

              <div className="mb-3">

                <h3
                  className="
                    text-[14px]
                    sm:text-[15px]
                    font-extrabold
                    text-[#0D1642]
                  "
                >
                  {t.sebagaiPasien}
                </h3>

                <p
                  className="
                    mt-1
                    text-[11px]
                    sm:text-[12px]
                    text-[#8A90A3]
                  "
                >
                  Pilih jenis pasien untuk melanjutkan pendaftaran.
                </p>

              </div>


              {(() => {

                const patientOptions = [
                  {
                    label: t.pasienTunai,
                    value: "Tunai",
                  },
                  {
                    label: t.pasienMitra,
                    value: "Mitra",
                  },
                  {
                    label: t.pasienYBRS,
                    value: "YBRS",
                  },
                ].filter(
                  item =>
                    item.value.toUpperCase() !== "YBRS" ||
                    hasBRS
                );


                const desktopCols =
                  patientOptions.length === 2
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-3";


                return (
                  <div
                    className={`
                      grid
                      grid-cols-1
                      ${desktopCols}
                      gap-3
                    `}
                  >

                    {patientOptions.map(item => {

                      const selected =
                        patientType === item.value;


                      return (
                        <label
                          key={item.value}
                          className={`
                            group
                            relative
                            flex
                            min-h-[62px]
                            items-center
                            gap-3
                            rounded-xl
                            border
                            px-4
                            py-3
                            cursor-pointer
                            transition-all
                            duration-200

                            ${
                              selected
                                ? `
                                  border-[#1B2A78]
                                  bg-[#F3F5FB]
                                  ring-1
                                  ring-[#1B2A78]/10
                                `
                                : `
                                  border-[#E1E5EF]
                                  bg-white
                                  hover:border-[#AEB7D2]
                                  hover:bg-[#FAFBFE]
                                `
                            }
                          `}
                        >

                          <input
                            type="radio"
                            name="patient-type"
                            value={item.value}
                            checked={selected}
                            onChange={() =>
                              setPatientType(
                                item.value as PatientType
                              )
                            }
                            className="
                              h-4
                              w-4
                              shrink-0
                              accent-[#1B2A78]
                            "
                          />

                          <span
                            className={`
                              text-[13px]
                              sm:text-[14px]
                              font-bold
                              transition-colors

                              ${
                                selected
                                  ? "text-[#1B2A78]"
                                  : "text-[#39415A]"
                              }
                            `}
                          >
                            {item.label}
                          </span>


                          {selected && (
                            <FiCheckCircle
                              size={17}
                              className="
                                absolute
                                right-4
                                text-[#1B2A78]
                              "
                            />
                          )}

                        </label>
                      );

                    })}

                  </div>
                );

              })()}

            </div>


            {/* ===================================================
                PESERTA + TANGGAL
            ==================================================== */}
            <div
              className="
                mt-7
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >

              {/* ================= PESERTA ================= */}
              <div>

                <label
                  className="
                    mb-2
                    block
                    text-[12px]
                    font-bold
                    text-[#0D1642]
                  "
                >
                  {t.pilihPeserta}
                </label>


                <Select
                  instanceId="peserta-select"
                  options={pesertaOptions}
                  placeholder={t.pilihPeserta}
                  isSearchable
                  isClearable
                  value={
                    pesertaOptions.find(
                      o =>
                        o.value ===
                        selectedPeserta?.value
                    ) || null
                  }
                  onChange={val =>
                    setSelectedPeserta(val)
                  }
                  classNamePrefix="rs"
                  menuPlacement="auto"
                  maxMenuHeight={5 * 42}

                  styles={{
                    control: (base, state) => ({
                      ...base,
                      minHeight: 52,
                      height: 52,
                      borderRadius: 12,
                      borderColor: state.isFocused
                        ? "#1B2A78"
                        : "#DCE1EE",
                      boxShadow: state.isFocused
                        ? "0 0 0 3px rgba(27,42,120,0.08)"
                        : "none",
                      "&:hover": {
                        borderColor: "#AEB8D5",
                      },
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#1B2A78",
                    }),

                    valueContainer: base => ({
                      ...base,
                      paddingLeft: 16,
                      paddingRight: 8,
                    }),

                    placeholder: base => ({
                      ...base,
                      color: "#9AA1B3",
                    }),

                    singleValue: base => ({
                      ...base,
                      color: "#1B2A78",
                      fontWeight: 600,
                    }),

                    indicatorSeparator: () => ({
                      display: "none",
                    }),

                    dropdownIndicator: base => ({
                      ...base,
                      color: "#1B2A78",
                    }),

                    clearIndicator: base => ({
                      ...base,
                      color: "#8A90A3",
                    }),

                    menu: base => ({
                      ...base,
                      zIndex: 50,
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "1px solid #E1E5EF",
                      boxShadow:
                        "0 14px 30px rgba(13,22,66,0.12)",
                    }),

                    option: (base, state) => ({
                      ...base,
                      fontSize: 13,
                      padding: "11px 14px",
                      backgroundColor:
                        state.isSelected
                          ? "#F1F3FA"
                          : state.isFocused
                            ? "#F8F9FD"
                            : "#FFFFFF",
                      color:
                        state.isSelected
                          ? "#1B2A78"
                          : "#39415A",
                      fontWeight:
                        state.isSelected ? 700 : 500,
                    }),
                  }}
                />

              </div>


              {/* ================= TANGGAL ================= */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    className="
                      block
                      text-[12px]
                      font-bold
                      text-[#0D1642]
                    "
                  >
                    {t.pilihTanggalJanjiTemu}
                  </label>


                  {patientType === "Tunai" && (
                    <span
                      className="
                        text-[10px]
                        font-semibold
                        text-[#8A90A3]
                      "
                    >
                      {t.maks7Hari}
                    </span>
                  )}

                </div>


                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) =>
                    setSelectedDate(date)
                  }
                  locale={dateLocale}
                  dateFormat="EEEE, dd MMMM yyyy"
                  placeholderText={
                    t.pilihTanggalJanjiTemu
                  }
                  minDate={new Date()}
                  maxDate={addDays(
                    new Date(),
                    maxDays
                  )}
                  withPortal
                  portalId="datepicker-portal"
                  customInput={<DateInput />}
                />

              </div>

            </div>


            {/* ===================================================
                JADWAL DOKTER
            ==================================================== */}
            <div
              className="
                mt-7
                rounded-2xl
                border
                border-[#E1E5EF]
                bg-[#F7F8FC]
                p-4
                sm:p-5
              "
            >

              {/* ================= HEADER ================= */}
              <div
                className="
                  mb-4
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >

                <div>

                  <div className="flex items-center gap-2">

                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#1B2A78]
                        text-white
                      "
                    >
                      <FiClock size={16} />
                    </div>

                    <div>

                      <p
                        className="
                          text-[13px]
                          sm:text-[14px]
                          font-extrabold
                          text-[#0D1642]
                        "
                      >
                        Jadwal Dokter
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          sm:text-[11px]
                          text-[#8A90A3]
                        "
                      >
                        Pilih waktu kunjungan Anda
                      </p>

                    </div>

                  </div>

                </div>


                {doctor && doctorSchedules.length > 0 && (
                  <span
                    className="
                      shrink-0
                      rounded-full
                      bg-[#E0A918]/15
                      px-3
                      py-1.5
                      text-[9px]
                      sm:text-[10px]
                      font-bold
                      text-[#967000]
                    "
                  >
                    Tersedia
                  </span>
                )}

              </div>


              {/* ================= NO SCHEDULE ================= */}
              {doctor &&
              doctorSchedules.length === 0 ? (

                <div
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-[#D9DEEA]
                    bg-white
                    px-4
                    py-8
                    text-center
                  "
                >

                  <FiCalendar
                    size={24}
                    className="
                      mx-auto
                      mb-2
                      text-[#AEB5C7]
                    "
                  />

                  <p
                    className="
                      text-[13px]
                      font-semibold
                      text-[#6F7689]
                    "
                  >
                    {t.jadwalDokterTidakTersedia}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-[#9AA1B3]
                    "
                  >
                    Silakan pilih tanggal lainnya.
                  </p>

                </div>

              ) : doctor ? (

                /* ================= SCHEDULE LIST ================= */
                doctorSchedules.length > 0 ? (

                  <ul className="space-y-2">

                    {doctorSchedules.map(
                      (schedule, idx) => {

                        const radioId =
                          `schedule-${idx}`;

                        const selected =
                          selectedSchedule ===
                          schedule;


                        return (
                          <li
                            key={idx}
                            onClick={() =>
                              setSelectedSchedule(
                                schedule
                              )
                            }
                            className={`
                              flex
                              min-h-[58px]
                              items-center
                              justify-between
                              gap-3
                              rounded-xl
                              border
                              px-3
                              sm:px-4
                              py-3
                              cursor-pointer
                              transition-all
                              duration-200

                              ${
                                selected
                                  ? `
                                    border-[#1B2A78]
                                    bg-white
                                    ring-1
                                    ring-[#1B2A78]/10
                                    shadow-[0_5px_15px_rgba(27,42,120,0.06)]
                                  `
                                  : `
                                    border-[#E0E4EE]
                                    bg-white
                                    hover:border-[#AEB7D2]
                                    hover:shadow-sm
                                  `
                              }
                            `}
                          >

                            {/* LEFT */}
                            <label
                              htmlFor={radioId}
                              className="
                                flex
                                min-w-0
                                flex-1
                                cursor-pointer
                                items-center
                                gap-3
                              "
                            >

                              <input
                                id={radioId}
                                type="radio"
                                name="doctor-schedule"
                                checked={selected}
                                onChange={() =>
                                  setSelectedSchedule(
                                    schedule
                                  )
                                }
                                className="
                                  h-4
                                  w-4
                                  shrink-0
                                  accent-[#1B2A78]
                                "
                              />

                              <span
                                className={`
                                  min-w-0
                                  text-[11px]
                                  sm:text-[13px]
                                  font-semibold
                                  leading-5

                                  ${
                                    selected
                                      ? "text-[#1B2A78]"
                                      : "text-[#39415A]"
                                  }
                                `}
                              >
                                {schedule.ServiceUnitName}
                              </span>

                            </label>


                            {/* RIGHT */}
                            <span
                              className={`
                                flex
                                shrink-0
                                items-center
                                gap-1
                                rounded-lg
                                px-2.5
                                py-1.5
                                text-[10px]
                                sm:text-[11px]
                                font-bold

                                ${
                                  selected
                                    ? `
                                      bg-[#1B2A78]
                                      text-white
                                    `
                                    : `
                                      bg-[#F0F2F8]
                                      text-[#1B2A78]
                                    `
                                }
                              `}
                            >

                              <FiClock size={12} />

                              {formatTimeRange(
                                schedule.StartTime1,
                                schedule.EndTime1
                              )}

                            </span>

                          </li>
                        );

                      }
                    )}

                  </ul>

                ) : null

              ) : (

                <div
                  className="
                    py-8
                    text-center
                    text-[12px]
                    text-[#9AA1B3]
                  "
                >
                  {t.memuatJadwalDokter}
                </div>

              )}

            </div>


            {/* ===================================================
                SUBMIT
            ==================================================== */}
            <div className="mt-6">

              <button
                disabled={!isFormComplete}
                onClick={() => {

                  if (!isFormComplete) {
                    return;
                  }

                  openConfirmModal();

                }}
                className={`
                  flex
                  h-[54px]
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  text-[13px]
                  sm:text-[14px]
                  font-extrabold
                  transition-all
                  duration-200

                  ${
                    isFormComplete
                      ? `
                        bg-[#1B2A78]
                        text-white
                        shadow-[0_10px_24px_rgba(27,42,120,0.18)]
                        hover:bg-[#0D1642]
                        hover:-translate-y-[1px]
                        cursor-pointer
                      `
                      : `
                        bg-[#DDE2EF]
                        text-[#949BAD]
                        cursor-not-allowed
                      `
                  }
                `}
              >
                {t.daftarAppointment}
              </button>

            </div>

          </div>

        </section>


        {/* =======================================================
            BACK BUTTON
        ======================================================== */}
        <button
          onClick={() => router.back()}
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-lg
            px-1
            py-2
            text-[12px]
            sm:text-[13px]
            font-semibold
            text-[#626A80]
            transition-colors
            hover:text-[#1B2A78]
          "
        >
          <FiArrowLeft size={16} />

          {lang === "ID"
            ? "Kembali"
            : "Back"}
        </button>

      </main>


      {/* =========================================================
          CONFIRMATION MODAL
      ========================================================== */}
      <ModalKonfirmasiAppointment
        isOpen={showConfirmModal}
        onClose={() =>
          setShowConfirmModal(false)
        }
        onConfirm={handleSubmitAppointment}
        isSubmitting={isSubmitting}
        doctorName={
          doctor?.paramedicname ?? ""
        }
        serviceUnitName={
          selectedSchedule?.ServiceUnitName ?? ""
        }
        billingTotal={billingTotal}
        patientType={patientType}
        patientTypeLabel={
          getPatientTypeLabel(patientType)
        }
        time={
          selectedSchedule
            ? formatTimeRange(
                selectedSchedule.StartTime1,
                selectedSchedule.EndTime1
              )
            : ""
        }
        appointmentDate={
          selectedDate
            ? selectedDate.toLocaleDateString(
                lang === "ID"
                  ? "id-ID"
                  : "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )
            : ""
        }
        patientName={
          selectedPeserta?.label ?? ""
        }
        registerTime={new Date().toLocaleTimeString(
          lang === "ID"
            ? "id-ID"
            : "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}
      />

    </div>
  );
}

function LoadingJanjiTemu() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#21368B]" />
    </div>
  );
}

export default function JanjiTemuPage() {
  return (
    <Suspense fallback={<LoadingJanjiTemu />}>
      <JanjiTemuContent />
    </Suspense>
  );
}

