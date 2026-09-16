export interface AwardItem {
  id: number;
  year: number;
  title: string;
  description: string;
  order: number;
}

export interface AwardResponse {
  success: boolean;
  data: AwardItem[];
}

export async function getAwards(): Promise<AwardResponse> {
  try {
    const response = await fetch("/api/get_awards");

    const result: AwardResponse = await response.json();

    return result;
  } catch (err) {
    console.error("Gagal mengambil data penghargaan:", err);

    return {
      success: false,
      data: [],
    };
  }
}