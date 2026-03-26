export interface PaymentRequest {
  type?: string | null;
  name: string;
  lastname?: string;
  email?: string;
  address: string;
  postcode?: string;
  state?: string;
  city?: string;
  country?: string;
  //deviceToken: string;
  appointmentNo: string;
  medicalNo: string;
  paramedicName: string;
  serviceUnitName: string;
  amount: string;
  phone: string;
}

export interface PaymentResponse {
  message?: string[];
  response?: any;
}

export async function createPayment(
  payload: PaymentRequest
): Promise<PaymentResponse> {

  try {

    // ================= AMBIL TOKEN =================
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken");

    if (!token) {
      console.error("TOKEN KOSONG");
      return { message:["JWT tidak ditemukan"], response:null };
    }

    console.log("PAYMENT SEND TOKEN:", token.slice(0,30)+"...");

    // ================= CALL NEXT API =================
    const res = await fetch("/api/payment_doku", {

      method:"POST",

      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token.trim()}`   // ⭐ trim penting
      },

      body:JSON.stringify(payload)

    });

    const raw = await res.text();

    console.log("PAYMENT STATUS:",res.status);
    console.log("PAYMENT RAW:",raw);

    // ================= HANDLE NON JSON =================
    if (!raw.startsWith("{")) {

      return {
        message:["Server RS tidak kirim JSON",raw.slice(0,200)],
        response:null
      };

    }

    const data = JSON.parse(raw);

    // ================= HANDLE HTTP ERROR =================
    if (!res.ok) {

      return {
        message:["HTTP ERROR "+res.status],
        response:data
      };

    }

    return data;

  }
  catch(err:any){

    console.error("PAYMENT SERVICE ERROR:",err);

    return {
      message:[err.message || "UNKNOWN ERROR"],
      response:null
    };

  }

}