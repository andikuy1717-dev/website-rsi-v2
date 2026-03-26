export interface LogoutResponse {
  message?: string;
  error?: string;
}

export async function logoutUser(token: string): Promise<LogoutResponse> {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result: LogoutResponse = await response.json();

    if (!response.ok) {
      return {
        error: result.error ?? "Logout gagal",
      };
    }

    return result;
  } catch (error) {
    console.error("Logout service error:", error);
    return {
      error: "Gagal terhubung ke server",
    };
  }
}
