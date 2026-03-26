export interface LoginWithOtpResponse {
  status: "OK" | "ERROR";
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

export const loginWithOtp = async (
  email: string,
  otp: string
): Promise<LoginWithOtpResponse> => {
  const res = await fetch("/api/login_with_otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  return res.json();
};
