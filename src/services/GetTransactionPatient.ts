export interface TransactionItem {
  id: number;
  medicalno: string;
  inv: string | null;
  created_at: string;
  updated_at: string;
  appointmentNo: string;
  status: string;
  link: string | null;
  paramedicName: string;
  serviceUnitName: string;
  amount: string | null;
  type: string;
}

export interface GetTransactionsResponse {
  status?: string;
  message?: string;
  errorCode?: string;
  errorMessages?: string;
  data?: TransactionItem[];
}

export async function getTransactions(
  medicalNo: string,
  token: string
): Promise<GetTransactionsResponse> {
  try {
    const response = await fetch("/api/get_transaction_patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        medicalNo,
      }),
    });

    const result: GetTransactionsResponse = await response.json();

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
    console.error("Get Transactions service error:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}
