export interface PrescriptionItem {
  PrescriptionNo: string;
  MedicalNo: string;
  RegistrationNo: string;
  ParamedicID: string;
  ParamedicName: string;
  PrescriptionDate: string;
  PrescriptionDate_yMdHms: string;
}

export interface GetPrescriptionResponse {
  status?: string;
  errorCode?: string;
  message?: string;
  data?: PrescriptionItem[];
}

export async function getPrescriptionList(
  medicalNo: string,
  token: string
): Promise<GetPrescriptionResponse> {

  try {
    const response = await fetch("/api/get_prescription_list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // optional (biar konsisten sama API lain)
      },
      body: JSON.stringify({
        medicalNo,
      }),
    });

    const result: GetPrescriptionResponse = await response.json();

    if (!response.ok) {
      return {
        status: "ERR",
        errorCode: result.errorCode ?? String(response.status),
        message: result.message,
      };
    }

    return result;

  } catch (error) {
    console.error("PrescriptionList service error:", error);

    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}