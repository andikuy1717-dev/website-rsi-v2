export interface PatientData {
  PatientID: string;
  MedicalNo: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DateOfBirth: string;
  StreetName: string;
  District: string;
  City: string;
  County: string;
  State: string;
  ZipCode: string;
  PhoneNo: string;
  MobilePhoneNo: string;
  Email: string;
  Ssn: string;
  GuarantorID: string;
  BirthPlace: string;
  Sex: string;
  SRReligion: string;
  SRReligionName: string;
  SREducation: string | null;
  SREducationName: string | null;
  SROccupation: string | null;
  SROccupationName: string | null;
  SRMaritalStatus: string | null;
  SRMaritalStatusName: string | null;
  SRTitle: string | null;
  SRTitleName: string | null;
  DateOfBirth_yMdHms: string;
}

export interface GetPatientByMedicalNoResponse {
  status?: string;
  errorCode?: string;
  message?: string;
  data?: PatientData;
}

export async function getPatientByMedicalNo(
  medicalNo: string
): Promise<GetPatientByMedicalNoResponse> {
  try {
    const response = await fetch(
      `/api/get_patient_by_medical_no_for_patient_id?medicalNo=${encodeURIComponent(
        medicalNo
      )}`,
      {
        method: "GET",
      }
    );

    const result: any = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        status: "ERR",
        errorCode: result?.errorCode ?? String(response.status),
        message: result?.message ?? "Gagal mengambil data pasien",
      };
    }

    return result;
  } catch (error) {
    console.error("Get Patient By MedicalNo service error:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}