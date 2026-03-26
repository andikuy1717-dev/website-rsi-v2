export interface ChangePasswordRequest {
  token: string;
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ChangePasswordResponse {
  status?: "success" | "error";
  message: string;
  errors?: {
    old_password?: string[];
    new_password?: string[];
    new_password_confirmation?: string[];
  };
}

export async function changePassword(
  payload: ChangePasswordRequest
): Promise<ChangePasswordResponse> {

  try {

    const response = await fetch("/api/change_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("CHANGE PASSWORD RESPONSE:", result);

    if (!response.ok) {
      return {
        status: "error",
        message: result?.message || "Gagal mengubah password",
        errors: result?.errors,
      };
    }

    return result;

  } catch (error) {

    console.error("Change Password service error:", error);

    return {
      status: "error",
      message: "Gagal terhubung ke server",
    };

  }

}