// 🔥 TYPE (flexibel dulu, nanti bisa lo adjust dari response asli)
export interface BedAvailabilityItem {
  ClassID?: string;
  ClassName?: string;
  JumlahTersedia?: number;
}

export interface BedAvailabilityResponse {
  status?: string;
  message?: string;
  data?: BedAvailabilityItem[];
  raw?: any; // fallback kalau XML
}

// 🔥 SERVICE
export async function getBedAvailability(): Promise<BedAvailabilityResponse> {
  try {
    const response = await fetch("/api/bed_availability", {
      method: "GET",
    });

    const result: any = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        status: "ERR",
        message: result?.message ?? "Gagal mengambil data ketersediaan kamar",
      };
    }

    return result;
  } catch (error) {
    console.error("Get Bed Availability error:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}