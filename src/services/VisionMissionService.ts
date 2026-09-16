export interface VisionMissionItem {
  id: number;
  content: string;
  order: number;
}

export interface VisionMissionData {
  vision: VisionMissionItem[];
  missions: VisionMissionItem[];
}

export interface VisionMissionResponse {
  success: boolean;
  data: VisionMissionData;
}

export async function getVisionMission(): Promise<VisionMissionResponse> {
  try {
    const response = await fetch(
      `/api/get_vision_mission?timestamp=${Date.now()}`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );

    const result: VisionMissionResponse = await response.json();
    console.log("Vision Mission API:", result);
    return result;
  } catch (err) {
    console.error("Gagal mengambil data visi dan misi:", err);

    return {
      success: false,
      data: {
        vision: [],
        missions: [],
      },
    };
  }
}