export interface BannerItem {
  id: number;
  title: string;
  image_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface BannerResponse {
  status: string;
  data: BannerItem[];
}

export async function getBannerPopup(): Promise<BannerResponse> {
  try {
    const response = await fetch("/api/get_banner_popup");

    const result: BannerResponse = await response.json();

    return result;
  } catch (err) {
    console.error(err);

    return {
      status: "ERROR",
      data: [],
    };
  }
}