export interface CheckBRSResponse {
  status?: string;
  message?: string;
  data?: {
    status: boolean;
    guarantorName: string;
    guarantorCardNo: string;
  };
  errorCode?: string;
  errorMessages?: string[];
}

export async function checkBRS(
  medicalNo: string,
  token: string
): Promise<CheckBRSResponse> {
  try {
    const response = await fetch("/api/check_patient_brs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ medicalNo }),
    });

    const result: CheckBRSResponse = await response.json();

    return result;
  } catch (error) {
    console.error("Check BRS service error:", error);
    return {
      status: "ERROR",
      message: "Gagal cek BRS",
    };
  }
}