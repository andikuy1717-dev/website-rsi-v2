export interface ResetPasswordResponse {
  status: "OK" | "ERROR";
  errorCode?: string;
  message?: string;
  errorMessages?: any;
  data?: any;
}

export const resetNewPasswordByEmail = async (
  email: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  try {
    const response = await fetch("/api/reset_confirm_new_password_email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        new_password: newPassword,
        new_password_confirmation: newPassword,
      }),
    });

    const result = await response.json();

    // 🔥 apapun HTTP status → FE tetap konsisten
    if (!response.ok) {
      return {
        status: "ERROR",
        errorCode: result.errorCode ?? "UNKNOWN_ERROR",
        message: result.message,
        errorMessages: result.errorMessages,
        data: result.data,
      };
    }

    return result;
  } catch (error) {
    return {
      status: "ERROR",
      errorCode: "NETWORK_ERROR",
      message: "Tidak dapat terhubung ke server",
    };
  }
};
