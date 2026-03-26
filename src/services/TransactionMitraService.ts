export interface TransactionMitraRequest {
  medicalNo: string;
  appointmentNo: string;
  paramedicName: string;
  serviceUnitName: string;
}

export interface TransactionMitraResponse {
  status?: string;
  message?: string;
  errorCode?: string;
  errorMessages?: string;
  error?: any;
  data?: {
    medicalNo: string;
    appointmentNo: string;
    paramedicName: string;
    serviceUnitName: string;
  };
}

export async function createTransactionMitra(
  payload: TransactionMitraRequest
): Promise<TransactionMitraResponse> {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        status: "UNAUTHORIZED",
        message: "Token tidak ditemukan",
      };
    }

    const response = await fetch("/api/transaction_mitra", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ⬅️ ambil dari localStorage
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        status: "ERR",
        message: result?.message ?? "Gagal membuat transaksi",
        error: result,
      };
    }

    return result;
  } catch (error) {
    console.error("Transaction Mitra service error:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}