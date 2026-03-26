export interface LoginResponse {
  status?: string;
  message?: string;
  errorCode?: string;
  errorMessages?: string;
  data?: {
    token?: string;
    is_feature_apt_active?: boolean;
    user?: {
      id: number;
      nik?: string | null;
      medicalNo?: string;
      phoneNumber?: string;
      email: string;
      noKK?: string;
      device_token?: string | null;
      last_login_token?: string;
      is_verified?: string;
      created_at?: string;
      updated_at?: string;
      deleted_at?: string | null;
    };
  };
}

export async function loginUser(
  emailOrMedicalNo: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailOrMedicalNo,
        password,
      }),
    });

    const result: LoginResponse = await response.json();

    // Handle status code
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
    console.error("Login service error:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}
