export interface PaymentTestRequest {
  type?: string | null;
  name: string;
  lastname?: string;
  email?: string;
  address: string;
  postcode?: string;
  state?: string;
  city?: string;
  country?: string;
  appointmentNo: string;
  medicalNo: string;
  paramedicName: string;
  serviceUnitName: string;
  amount: string;
  phone: string;
}

export interface PaymentTestResponse {
  message?: string[];
  response?: any;
}

export async function createPaymentTest(
  payload: PaymentTestRequest
): Promise<PaymentTestResponse> {
  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken");

    if (!token) {
      console.error("TOKEN KOSONG");

      return {
        message: ["JWT tidak ditemukan"],
        response: null,
      };
    }

    console.log(
      "PAYMENT TEST SEND TOKEN:",
      token.slice(0, 30) + "..."
    );

    const res = await fetch("/api/payment_doku_test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.trim()}`,
      },
      body: JSON.stringify({
        ...payload,
        amount: Number(payload.amount),
      }),
    });

    const raw = await res.text();

    console.log("PAYMENT TEST STATUS:", res.status);
    console.log("PAYMENT TEST RAW:", raw);

    if (!raw.startsWith("{")) {
      return {
        message: [
          "Server RS tidak kirim JSON",
          raw.slice(0, 200),
        ],
        response: null,
      };
    }

    const data = JSON.parse(raw);

    // Simpan invoice sebelum browser diarahkan ke DOKU.
    const invoiceNumber =
      data?.response?.order?.invoice_number ??
      data?.invoiceNumber;

    if (invoiceNumber) {
      localStorage.setItem(
        "paymentTestInvoice",
        String(invoiceNumber)
      );

      console.log(
        "PAYMENT TEST INVOICE DISIMPAN:",
        invoiceNumber
      );
    }

    if (!res.ok) {
      return {
        message: ["HTTP ERROR " + res.status],
        response: data,
      };
    }

    return data;

  } catch (err: any) {
    console.error("PAYMENT TEST SERVICE ERROR:", err);

    return {
      message: [
        err.message || "UNKNOWN ERROR",
      ],
      response: null,
    };
  }
}

export interface PaymentTestStatusResponse {
  success: boolean;
  invoiceNumber?: string;
  appointmentNo?: string;
  status?: string;
  amount?: number;
  message?: string;
}

export async function getPaymentTestStatus(
  invoiceNumber: string
): Promise<PaymentTestStatusResponse> {
  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken");

    if (!token) {
      return {
        success: false,
        message: "JWT tidak ditemukan",
      };
    }

    const res = await fetch(
      `/api/payment_doku_test_status?invoiceNumber=${encodeURIComponent(invoiceNumber)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `HTTP ERROR ${res.status}`,
      };
    }

    return data;
  } catch (err: any) {
    console.error("PAYMENT TEST STATUS ERROR:", err);

    return {
      success: false,
      message: err.message || "Gagal memeriksa status pembayaran",
    };
  }
}

