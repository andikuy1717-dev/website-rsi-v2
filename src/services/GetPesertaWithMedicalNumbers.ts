export interface PatientItem {
  id: number;
  medicalNo: string;
  fullName: string;
  relation: string;
}

export interface GetPatientsResponse {
  status?: string;
  message?: string;
  patients?: PatientItem[];
  errorCode?: string;
  errorMessages?: string;
}

export async function getPatients(
  medicalNo: string,
  token: string
): Promise<GetPatientsResponse> {
  try {
    const response = await fetch("/api/get_peserta_with_medical_numbers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ medicalNo }),
    });

    const result: GetPatientsResponse = await response.json();

    if (!response.ok) {
      return {
        status: "ERR",
        errorCode: result.errorCode ?? String(response.status),
        message: result.message,
        errorMessages: result.errorMessages,
      };
    }

    return result;
  } catch (error) {
    console.error("Get Patients service error:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}