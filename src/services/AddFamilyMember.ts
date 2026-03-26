export interface AddFamilyMemberRequest {
  user_id: number;
  medicalNo: string;
  nik: string;
  relation: string;
}

export interface AddFamilyMemberResponse {
  status: "success" | "error" | "ERROR";
  message: string;
  data?: {
    id: number;
    user_id: number;
    medicalNo: string;
    nik: string;
    relation: string;
  };
  errors?: any;
}

export async function addFamilyMember(
  payload: AddFamilyMemberRequest
): Promise<AddFamilyMemberResponse> {
  try {
    const response = await fetch("/api/add_family_member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("API RESPONSE:", result);

    if (!response.ok) {
      return {
        status: "error",
        message: result?.message || "Gagal menambahkan anggota keluarga",
        errors: result?.errors,
      };
    }

    return result;
  } catch (error) {
    console.error("Add Family Member service error:", error);

    return {
      status: "error",
      message: "Gagal terhubung ke server",
    };
  }
}