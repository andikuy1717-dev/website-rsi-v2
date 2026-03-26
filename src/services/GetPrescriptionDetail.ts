export interface PrescriptionDetailItem {
  ItemID: string;
  ItemName: string;
  PrescriptionQty: number;
  ConsumeMethod: string;
}

export interface GetPrescriptionDetailResponse {
  status?: string;
  errorCode?: string;
  message?: string;
  data?: PrescriptionDetailItem[];
}

export async function getPrescriptionDetail(
  prescriptionNo: string,
  token: string
): Promise<GetPrescriptionDetailResponse> {

  try {

    const response = await fetch("/api/get_prescription_detail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        prescriptionNo,
      }),
    });

    const result: GetPrescriptionDetailResponse = await response.json();

    if (!response.ok) {
      return {
        status: "ERR",
        errorCode: result.errorCode ?? String(response.status),
        message: result.message,
      };
    }

    return result;

  } catch (error) {

    console.error("PrescriptionDetail service error:", error);

    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}