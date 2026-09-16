export interface PromoItem {
  id: number;
  title: string;
  description: string;
  detail_description: string;
  category: string;
  content_type: string;
  image: string;
  image_url: string;
  video_url: string | null;
  whatsapp_url: string;
  order: number;
  published_at: string | null;
  expired_at: string | null;
}

export interface PromoResponse {
  success: boolean;
  data: PromoItem[];
}

export async function getPromos(): Promise<PromoResponse> {
  try {
    const response = await fetch("/api/get_promos");

    const result: PromoResponse = await response.json();

    return result;
  } catch (err) {
    console.error("Gagal mengambil data promo:", err);

    return {
      success: false,
      data: [],
    };
  }
}