"use client";

import { useEffect, useState } from "react";
import { FaUsers, FaEye, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { startLoading, endLoading } from "@/utils/LoadingManager";
import { useLang } from "@/context/LanguageContext";
import { ID } from "@/lang/id";
import { EN } from "@/lang/en";
import { getPatients, PatientItem } from "@/services/GetPesertaWithMedicalNumbers";
import { deleteFamilyMember } from "@/services/DeleteFamilyMember";
import Swal from "sweetalert2";
import { addFamilyMember } from "@/services/AddFamilyMember";
import Select from "react-select";

export default function ProfilPage() {
  const router = useRouter();
  const { userId, medicalNo, token } = useAuth();
  const { lang } = useLang();
  const t = lang === "ID" ? ID : EN;
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [medicalNoInput,setMedicalNoInput] = useState("");
  const [nikInput,setNikInput] = useState("");
  const [relation,setRelation] = useState<any>(null);

  const resetForm = () => {
    setMedicalNoInput("")
    setNikInput("")
    setRelation(null)
  }

  const apiErrorMapping: Record<string, string> = {
    "Nomor Rekam Medis sudah terdaftar dalam Family Member": "medicalNoSudahTerdaftar",
    "No. RM dan NIK tidak sesuai. Hubungi CS untuk perubahan data": "rmNikTidakSesuai"
  }

  const fetchPatients = async (withLoading = true) => {
    if (!medicalNo || !token) return;

    if(withLoading) setLoadingPatients(true)

    try{
        const response = await getPatients(medicalNo, token)

        if(response.status === "success" && response.patients){
        setPatients(response.patients)
        }
    }catch(error){
        console.error(error)
    }finally{
        if(withLoading) setLoadingPatients(false)
    }
  }

  const relationOptions = [
    { 
        value: "Orang Tua", 
        label: lang === "ID" ? "Orang Tua" : "Parent" 
    },
    { 
        value: "Anak", 
        label: lang === "ID" ? "Anak" : "Child" 
    },
    { 
        value: "Suami", 
        label: lang === "ID" ? "Suami" : "Husband" 
    },
    { 
        value: "Istri", 
        label: lang === "ID" ? "Istri" : "Wife" 
    },
    { 
        value: "Kakek", 
        label: lang === "ID" ? "Kakek" : "Grandfather" 
    },
    { 
        value: "Nenek", 
        label: lang === "ID" ? "Nenek" : "Grandmother" 
    },
    { 
        value: "Teman", 
        label: lang === "ID" ? "Teman" : "Friend" 
    },
    { 
        value: "Lainnya", 
        label: lang === "ID" ? "Lainnya" : "Other" 
    }
  ];

  const submitAddMember = async () => {

    if(!medicalNoInput || !nikInput || !relation){
        Swal.fire({
        icon:"warning",
        title:t.formBelumLengkap,
        scrollbarPadding: false,
        })
        return
    }

    if(nikInput.length !== 16){
        Swal.fire({
         icon:"warning",
         title:t.Nik16Digit,
         scrollbarPadding: false,
         })
        return
    }

    if (!userId) {
        Swal.fire({
            icon: "error",
            title: "Session tidak valid",
            text: "Silakan login ulang",
            scrollbarPadding: false,
        })
        return
    }

    setShowAddModal(false)

    startLoading()

    const result = await addFamilyMember({
     user_id: userId,
     medicalNo:medicalNoInput,
     nik:nikInput,
     relation:relation.value
    })

    endLoading()

    if(result.status === "success" && result.data){

    const data = result.data

    await Swal.fire({
     icon:"success",
     title:"Berhasil",
     scrollbarPadding: false,
     text:result.message
    })

    await fetchPatients(false)

    resetForm()

    }else{

    let errorMessage = result.message

    if(apiErrorMapping[result.message]){
        const key = apiErrorMapping[result.message] as keyof typeof t
        errorMessage = t[key] as string
    }

    Swal.fire({
     icon:"error",
     title:t.errorTambahAnggota,
     scrollbarPadding: false,
     text:errorMessage
    })

    }
  }

  const formatRelation = (relation: string) => {
    if (relation?.toLowerCase() === "self") {
        return lang === "ID" ? "Saya Sendiri" : "Self";
    }

    if (relation?.toLowerCase() === "anak") {
        return lang === "ID" ? "Anak" : "Child";
    }

    return relation; // fallback kalau nanti ada relation lain
  };

  useEffect(() => {
    startLoading()
    fetchPatients().finally(endLoading)
  }, [medicalNo, token])

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-black md:text-[16px] lg:text-[18px] xl:text-[20px]">
        {t.tambahAnggota}
      </h1>

    <div className="mt-4">
        <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-900 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:bg-blue-500 active:scale-95 cursor-pointer"
        >
            <FaUsers className="w-5 h-5" />
           {t.tambahAnggota}
        </button>
    </div>

    {/* TITLE SECTION */}
    <h2 className="mt-8 mb-3 text-lg font-semibold text-gray-800">
    {t.anggotaKeluarga}
    </h2>

    {/* LIST CARD */}
    <div className="space-y-3">
    {loadingPatients ? (
        <div className="text-sm text-gray-500">Memuat data...</div>
    ) : patients.length === 0 ? (
        <div className="text-sm text-gray-500">
        Belum ada anggota keluarga
        </div>
    ) : (
        patients.map((item) => (
        <div
            key={item.id}
            className="w-full bg-white border border-gray-400 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
          
            <div className="flex justify-between items-center">

            {/* LEFT CONTENT */}
            <div>
                <p className="md:text-[14px] lg:text-[16px] font-semibold text-gray-800">
                {item.fullName}
                </p>
                <p className="text-sm text-gray-500">
                {t.sebagai} {formatRelation(item.relation)}
                </p>
                <p className="text-xs text-gray-400">
                {t.noMedicalRecord} : {item.medicalNo}
                </p>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-4">
            
                <button
                    title={t.lihatDetail}
                    onClick={() => router.push(`/akun/pengaturan-akun/profil?medicalNo=${item.medicalNo}`)}
                    className="text-blue-900 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                >
                    <FaEye className="w-5 h-5" />
                </button>

                <button
                    title={t.hapusAnggota}
                    disabled={item.relation?.toLowerCase() === "self"}
                    onClick={async () => {
                        if (item.relation?.toLowerCase() === "self") return;

                        const confirm = await Swal.fire({
                            title: t.titleHapusAnggota,
                            text: t.deskripsiHapusAnggota,
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#6b7280",
                            confirmButtonText: t.buttonHapus,
                            cancelButtonText: t.buttonBatal,
                            scrollbarPadding: false,
                        });

                        if (!confirm.isConfirmed) return;

                        startLoading();

                        const result = await deleteFamilyMember(item.id);

                        endLoading();

                        if (result.status === "success") {
                            setPatients((prev) => prev.filter((p) => p.id !== item.id));

                            await Swal.fire({
                            icon: "success",
                            title: t.titleAnggotaKeluargaBerhasilDihapus,
                            confirmButtonColor: "#1e3a8a",
                            scrollbarPadding: false,
                            });

                        } else {
                            Swal.fire({
                            icon: "error",
                            title: "Gagal",
                            text: result.message,
                            scrollbarPadding: false,
                            });
                        }
                    }}
                    className={`transition-colors duration-200 
                        ${item.relation?.toLowerCase() === "self"
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 hover:text-red-800 cursor-pointer"
                    }`}
                >
                    <FaTrash className="w-5 h-5" />
                </button>

                </div>
              </div>
            </div>
        ))
    )}
    </div>

    {showAddModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white w-[500px] rounded-xl p-6 shadow-lg">

        <h2 className="text-lg font-semibold mb-5 text-black">
            {t.tambahAnggota}
        </h2>

        <div className="space-y-4">

        {/* Medical No */}
        <div>
        <label className="block text-sm text-gray-500 mb-1">
            {t.noMedicalRecord}
        </label>

        <div className="flex items-center border border-gray-400 rounded-lg px-4 py-2 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200">
          <input
            type="text"
            value={medicalNoInput}
            onChange={(e)=>setMedicalNoInput(e.target.value)}
            className="w-full outline-none text-black"
            placeholder={t.noMedicalRecord}
          />
        </div>
        </div>


        {/* NIK */}
        <div>
        <label className="block text-sm text-gray-500 mb-1">
            {t.NIK}
        </label>

        <div className="flex items-center border border-gray-400 rounded-lg px-4 py-2 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200">
          <input
            type="text"
            maxLength={16}
            value={nikInput}
            onChange={(e)=>{
            const val = e.target.value.replace(/[^0-9]/g,"")
            setNikInput(val)
            }}
            className="w-full outline-none text-black"
            placeholder={t.NIK}
          />
        </div>
        </div>

        {/* RELATION */}
        <div>
        <label className="block text-sm text-gray-500 mb-1">
            {t.relasi}
        </label>

        <Select
          options={relationOptions}
          value={relation}
          onChange={(val)=>setRelation(val)}
          placeholder={t.pilihRelasi}
          isSearchable
          isClearable
          classNamePrefix="rs"
          menuPlacement="top"
        />

        </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={()=>{
            resetForm()
            setShowAddModal(false)
          }} 
          className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-300 cursor-pointer"
        >
          {t.buttonBatal}
        </button>

        <button
          onClick={submitAddMember}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-500 cursor-pointer"
        >
          {t.tombolTambahAnggota}
        </button>

        </div>

        </div>
        </div>
        )}

    </>
    
  );
}