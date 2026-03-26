export interface ValidateOtpResetPasswordEmailResponse {
  status?: string;
  message?: string;
  errorCode?: string;
  errorMessages?: string;
  data?: any;
}

export async function validateResetOtpEmail(
  email: string,
  otp: string
): Promise<ValidateOtpResetPasswordEmailResponse> {
  try {
    const response = await fetch("/api/validate_otp_reset_password_email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const result: ValidateOtpResetPasswordEmailResponse = await response.json();

    if (!response.ok) {
      return {
        status: "ERROR",
        errorCode: result.errorCode ?? String(response.status),
        message: result.message,
        errorMessages: result.errorMessages,
      };
    }

    return result;
  } catch (error) {
    console.error("Validate OTP service error:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}
