export interface AppointmentCreateRequest {
  ServiceUnitID: string;
  ParamedicID: string;
  AppointmentDate: string; // yyyy-mm-dd
  AppointmentTime: string; // hh:mm | AUTO | AUTO_10 | AUTO_10_5
  PatientID?: string;
  FirstName: string;
  MiddleName?: string;
  LastName?: string;
  DateOfBirth: string; // yyyy-mm-dd
  StreetName?: string;
  District?: string;
  County?: string;
  City?: string;
  State?: string;
  ZipCode?: string;
  PhoneNo?: string;
  Email?: string;
  GuarantorID?: string;
  Notes?: string;
  BirthPlace?: string;
  Sex: "M" | "F";
  Ssn?: string;
  MobilePhoneNo?: string;
}

export interface AppointmentCreateResponse {
  status?: string;
  message?: string;
  errorCode?: string;
  data?: any;
}

export async function createAppointment(
  payload: AppointmentCreateRequest
): Promise<AppointmentCreateResponse> {
  try {
    const response = await fetch("/api/appointment_create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resultText = await response.text(); // ambil raw response

    if (!response.ok) {
      return {
        status: "ERR",
        message: "Gagal membuat appointment",
      };
    }

    let parsedData: any = resultText;

    // 🔥 coba parse JSON kalau memungkinkan
    try {
      parsedData = JSON.parse(resultText);
    } catch {
      // bukan JSON → biarkan string (bisa XML / plain text)
    }

    return {
      status: "OK",
      data: parsedData,
    };
  } catch (error) {
    console.error("Create Appointment service error:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}