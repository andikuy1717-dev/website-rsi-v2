export interface DeleteFamilyMemberResponse {
  status: "success" | "error";
  message: string;
}

export async function deleteFamilyMember(
  id: number
): Promise<DeleteFamilyMemberResponse> {
  try {
    const response = await fetch(`/api/delete_family_member?id=${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        message: result?.message || "Gagal menghapus anggota keluarga",
      };
    }

    return result;
  } catch (error) {
    console.error("Delete Family Member service error:", error);

    return {
      status: "error",
      message: "Gagal terhubung ke server",
    };
  }
}