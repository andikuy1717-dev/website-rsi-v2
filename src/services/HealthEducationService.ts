export interface HealthEducationItem {
  id: number;
  title: string;
  description: string;
  detail_description: string;
  category: string;
  content_type: string;
  background_image: string;
  background_image_url: string;
  image: string;
  image_url: string;
  video_url: string | null;
  order: number;
  published_at: string | null;
}

export interface HealthEducationResponse {
  success: boolean;
  data: HealthEducationItem[];
}

export async function getHealthEducation(): Promise<HealthEducationResponse> {
  try {
    const response = await fetch("/api/get_health_education");

    const result: HealthEducationResponse = await response.json();

    return result;
  } catch (err) {
    console.error(err);

    return {
      success: false,
      data: [],
    };
  }
}