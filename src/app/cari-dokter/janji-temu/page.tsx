"use client";

import Swal from "sweetalert2";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, forwardRef } from "react";
import Image from "next/image";
import { fetchParamedicServiceUnit } from "@/services/ParamedicServiceUnitService";
import { fetchParamedicSchedule, ParamedicSchedule } from "@/services/ParamedicSchedule";
import { fetchServiceUnitNonBPJSMixed } from "@/services/ServiceUnitNonBPJSMixedService";
import { checkBRS } from "@/services/CheckPatientBRS"; // import service baru
import { startLoading, endLoading } from "@/utils/LoadingManager";
import DatePicker from "react-datepicker";
import { id, enUS } from "date-fns/locale";
import { FiCalendar } from "react-icons/fi";
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
import { PaymentRequest, PaymentResponse, createPayment } from "@/services/PaymentDoku";

type DoctorDetail = {
  paramedicid: string;
  paramedicname: string;
  serviceunitnames: string[]; // ✅ ubah ini dari string ke array
  foto_base64?: string;
};

export default function JanjiTemuPage() {
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

  type PatientType = "Tunai" | "Mitra" | "Ybrs";
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
      case "Ybrs":
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
    if (patientType !== "Ybrs") {
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
          className="w-full border border-gray-400 rounded-lg px-4 py-3 text-base text-gray-700 cursor-pointer caret-transparent focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />

        {/* ICON */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-blue-600">
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
                  ? "Silahkan tunjukan bukti appointment kepada petugas di loket pendaftaran."
                  : "Please show this appointment proof to the registration counter staff."}
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
        // 🔹 TUNAI → Simpan payload untuk Doku & redirect ke payment page
        const paymentPayload: PaymentRequest = {
          type: "doku", // penting supaya bukan BRS
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
          //deviceToken: "",
        };

        // 🔥 CALL API PAYMENT (INI YANG KURANG)
        const payment: PaymentResponse = await createPayment(paymentPayload);

        console.log("PAYMENT RESPONSE:", payment);

        if (!payment?.response) {
          await Swal.fire({
            icon: "error",
            title: lang === "ID" ? "Payment gagal" : "Payment failed",
            text: Array.isArray(payment?.message)
              ? payment.message.join(", ")
              : payment?.message || "Terjadi kesalahan",
            scrollbarPadding: false,
          });
          return;
        }

        const checkoutUrl =
          payment.response?.payment?.url ||   // 🔥 ini struktur asli dari backend lu
          payment.response?.checkoutUrl ||
          payment.response?.paymentUrl ||
          payment.response?.url;

        if (!checkoutUrl) {
          await Swal.fire({
            icon: "error",
            title: "Payment error",
            text: "Checkout URL tidak ditemukan",
          });
          return;
        }

        // 🔥 OPEN TAB BARU KE DOKU
        window.open(checkoutUrl, "_blank", "noopener,noreferrer");
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
    <div className="w-full mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 max-w-8xl py-12">

      {/* ================= PAGE TITLE ================= */}
      <div className="mb-6">
        <h1 className="text-[24px] sm:text-[24px] md:text-[24px] lg:text-[24px] xl:text-[26px] font-bold text-gray-900">
          {t.bookAppointment}
        </h1>
        <p className="text-gray-400 text-[14px] sm:text-[14px] md:text-[14px] lg:text-[13px] xl:text-[14px] mt-1">
          {t.pilihJadwalKunjunganDokter}
        </p>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* ================= LEFT : INFO DOKTER ================= */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-400">
            <div className="flex items-center gap-4">

              {/* FOTO */}
              <Image
                src={
                  doctor?.foto_base64
                    ? `data:image/jpeg;base64,${doctor.foto_base64}`
                    : "/doctor_dummy.png"
                }
                alt="Doctor"
                width={60}
                height={60}
                className="rounded-full object-cover border"
              />

              {/* INFO */}
              <div className="flex-1">
                {error ? (
                  <p className="text-red-500 text-sm">{error}</p>
                ) : doctor ? (
                  <>
                    <p className="font-semibold text-[13px] sm:text-[13px] md:text-[13px] lg:text-[12px] xl:text-[13px] text-gray-900 leading-snug">
                      {doctor.paramedicname}
                    </p>
                    <p className="text-[11px] sm:text-[11px] md:text-[11px] lg:text-[10px] xl:text-[11px] text-gray-400">
                      {doctor?.serviceunitnames?.map((name, i) => (
                        <span key={i} className="block">{name}</span>
                      ))}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">
                   {t.memuatJadwalDokter}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* ================= RIGHT : BOOKING ================= */}
        <div className="lg:col-span-3">
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-400">

              <h3 className="text-[16px] sm:text-[18px] md:text-[18px] lg:text-[18px] xl:text-[20px] font-semibold text-gray-900 mb-4">
                {t.jadwalDanPemesanan} : {doctor?.paramedicname}
              </h3>

             {/* ================= JENIS PASIEN ================= */}
              <div className="mt-6 mb-8 rounded-xl border border-gray-400 bg-white">
                <div className="px-6 py-4">
                  <p className="text-[16px] sm:text-[14px] md:text-[16px] lg:text-[15px] xl:text-[16px] mb-4 font-medium text-gray-700">
                    {t.sebagaiPasien}
                  </p>

                  {(() => {
                    const patientOptions = [
                      { label: t.pasienTunai, value: "Tunai" },
                      { label: t.pasienMitra, value: "Mitra" },
                      { label: t.pasienYBRS, value: "YBRS" },
                    ].filter(item => item.value.toUpperCase() !== "YBRS" || hasBRS);

                    const desktopCols = patientOptions.length === 2 ? "md:grid-cols-2 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-3";

                    return (
                      <div className={`grid grid-cols-1 sm:grid-cols-1 gap-4 ${desktopCols}`}>
                        {patientOptions.map((item) => (
                          <label
                            key={item.value}
                            className={`
                              flex items-center gap-3 px-4 py-3 rounded-lg border transition cursor-pointer
                              ${patientType === item.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-400 bg-white hover:border-blue-400"
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name="patient-type"
                              value={item.value}
                              checked={patientType === item.value}
                              onChange={() => setPatientType(item.value as PatientType)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />

                            <span className="text-[16px] sm:text-[14px] md:text-[16px] lg:text-[15px] xl:text-[16px] font-semibold text-gray-700">
                              {item.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

             {/* ================= GRID 2 KOLON: Peserta + DatePicker ================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-20 mb-6">

                {/* LEFT: DROPBOX PESERTA */}
                <div className="mb-4">
                  <label className="block text-[14px] sm:text-[14px] md:text-[14px] lg:text-[13px] xl:text-[14px] font-medium mb-2 text-gray-500">
                    {t.pilihPeserta}
                  </label>

                  <Select
                    instanceId="peserta-select"
                    options={pesertaOptions}
                    placeholder={t.pilihPeserta}
                    isSearchable
                    isClearable
                    value={pesertaOptions.find(o => o.value === selectedPeserta?.value) || null}
                    onChange={(val) => setSelectedPeserta(val)}
                    classNamePrefix="rs"
                    menuPlacement="auto"
                    maxMenuHeight={5 * 42}
                  />
                </div>

                {/* RIGHT: DATE PICKER */}
                <div>
                  <p className="text-[14px] sm:text-[14px] md:text-[14px] lg:text-[13px] xl:text-[14px] font-medium text-gray-500 mb-2">
                    {t.pilihTanggalJanjiTemu}
                    {patientType === "Tunai" && (
                      <span className="text-gray-500 font-semibold">
                        {t.maks7Hari}
                      </span>
                    )}
                  </p>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    locale={dateLocale}
                    dateFormat="EEEE, dd MMMM yyyy"
                    placeholderText={t.pilihTanggalJanjiTemu}
                    minDate={new Date()}
                    maxDate={addDays(new Date(), maxDays)}
                    withPortal
                    portalId="datepicker-portal"
                    customInput={<DateInput />}
                  />
                </div>

              </div>

              {/* ================= JADWAL DOKTER TERSEDIA ================= */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-400 w-full md:w-2/3">
                  {/* ===== JUDUL / STATUS JADWAL ===== */}
                    {doctor && doctorSchedules.length === 0 ? (
                      <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-[18px] font-semibold text-gray-400 text-center mb-1 mt-1">
                        {t.jadwalDokterTidakTersedia}
                      </p>
                    ) : (
                      <p className="text-[14px] sm:text-[14px] md:text-[14px] lg:text-[12px] xl:text-[14px] font-medium text-gray-500 mb-5 text-center">
                        {t.jadwalDokterTersedia}
                      </p>
                    )}

                  {doctor ? (
                    doctorSchedules.length > 0 ? (
                     <ul className="space-y-2">
                      {doctorSchedules.map((schedule, idx) => {
                        const radioId = `schedule-${idx}`;

                        return (
                          <li
                            key={idx}
                            className={`
                              flex items-center justify-between gap-4
                              rounded-lg border px-4 py-3 cursor-pointer transition
                              ${selectedSchedule === schedule
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 bg-white hover:border-blue-400"}
                            `}
                            onClick={() => setSelectedSchedule(schedule)}
                          >
                            {/* LEFT : RADIO + NAMA UNIT */}
                            <label htmlFor={radioId} className="flex items-center gap-3 cursor-pointer flex-1">
                              <input
                                id={radioId}
                                type="radio"
                                name="doctor-schedule"
                                checked={selectedSchedule === schedule}
                                onChange={() => setSelectedSchedule(schedule)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />

                              <span className="text-[12px] sm:text-[14px] md:text-[14px] lg:text-[12px] xl:text-[14px] text-gray-700 font-medium">
                                {schedule.ServiceUnitName}
                              </span>
                            </label>

                            {/* RIGHT : JAM */}
                            <span className="text-[11px] sm:text-[13px] md:text-[13px] lg:text-[11px] xl:text-[13px] font-semibold text-gray-700 whitespace-nowrap">
                              {formatTimeRange(schedule.StartTime1, schedule.EndTime1)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    ) : (
                      null
                    )
                  ) : (
                    <p className="text-sm text-gray-400 text-center">{t.memuatJadwalDokter}</p>
                  )}
                </div>
              </div>

              {/* ================= BUTTON DAFTAR ================= */}
              <div className="mt-6">
                <button
                  disabled={!isFormComplete}
                  onClick={() => {
                    if (!isFormComplete) return;
                    openConfirmModal();
                  }}
                  className={`
                    w-full
                    py-3
                    rounded-lg
                    text-[16px] sm:text-[16px] md:text-[18px] lg:text-[16px] xl:text-[18px] font-semibold
                    transition
                    ${isFormComplete
                      ? "bg-blue-800 text-white hover:bg-blue-500 cursor-pointer"
                      : "bg-blue-300 text-white cursor-not-allowed"
                    }
                  `}
                >
                  {t.daftarAppointment}
                </button>
              </div>

            </div>
          </div>
        </div>

      </div> 

      {/* ================= BACK BUTTON ================= */}
      <button
        onClick={() => router.back()}
        className="mt-10 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition"
      >
        ← Kembali
      </button>

      <ModalKonfirmasiAppointment
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmitAppointment}
        isSubmitting={isSubmitting} 
        doctorName={doctor?.paramedicname ?? ""}
        serviceUnitName={selectedSchedule?.ServiceUnitName ?? ""}
        billingTotal={billingTotal}
        patientType={patientType}
        patientTypeLabel={getPatientTypeLabel(patientType)}
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
            ? selectedDate.toLocaleDateString(lang === "ID" ? "id-ID" : "en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""
        }
        patientName={selectedPeserta?.label ?? ""}
        registerTime={new Date().toLocaleTimeString(lang === "ID" ? "id-ID" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    </div>
  );
}

