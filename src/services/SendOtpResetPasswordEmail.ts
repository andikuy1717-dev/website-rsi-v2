// services/SendResetOtpEmail.ts
export interface SendOtpResponse {
  status?: string;
  message?: string;
  errorCode?: string;
  errorMessages?: string;
  data?: any;
}

export async function sendResetOtpEmail(email: string): Promise<SendOtpResponse> {
  try {
    const response = await fetch("/api/send_otp_reset_password_email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result: SendOtpResponse = await response.json();

    // Jika status HTTP bukan OK, handle error
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
    console.error("Send OTP service error:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}
