export interface AppointmentItem {
  ServiceUnitID: string;
  ServiceUnitName: string;
  ParamedicID: string;
  ParamedicName: string;
  AppointmentDate: string;
  AppointmentTime: string;
  AppointmentQue: string;
  AppointmentNo: string;
  PatientID: string;
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
  Email: string;
  GuarantorID: string;
  GuarantorName: string;
  Notes: string;
  AppointmentStatus: string;
  AppointmentStatusName: string;
  MedicalNo: string;
  BirthPlace: string;
  Sex: string;
  Ssn: string;
  MobilePhoneNo: string;
  Quota: string;
  JmlhBO: string;
  SisaQuota: string;
  AppointmentQueFormattedNo: string;
  AppointmentDate_yMdHms?: string;
  DateOfBirth_yMdHms: string,
  appointmentNo: string,
  notes: string,
  isParamedicLeave: string,
  estimatedHandlingTime: string,
  IsRehab: string
}

export interface GetAppointmentResponse {
  status?: string;
  errorCode?: string;
  message?: string;
  data?: AppointmentItem[];
}


export async function getAppointmentList(
  medicalNo: string,
  token: string
): Promise<GetAppointmentResponse> {

  try {

    const response = await fetch("/api/get_appointment_list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // optional biar konsisten
      },
      body: JSON.stringify({
        medicalNo,
      }),
    });

    const result: GetAppointmentResponse = await response.json();

    if (!response.ok) {
      return {
        status: "ERR",
        errorCode: result.errorCode ?? String(response.status),
        message: result.message,
      };
    }

    return result;

  } catch (error) {

    console.error("AppointmentList service error:", error);

    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}

