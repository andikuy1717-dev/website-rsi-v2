// services/SendLoginOtp.ts

export interface SendLoginOtpResponse {
  status?: string;
  message?: string;
  errorCode?: string;
  errorMessages?: string;
  data?: any;
}

export async function sendLoginOtp(
  email: string
): Promise<SendLoginOtpResponse> {
  try {
    const response = await fetch("/api/send_for_otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result: SendLoginOtpResponse = await response.json();

    // Kalau HTTP status error
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
    console.error("Send Login OTP service error:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}
