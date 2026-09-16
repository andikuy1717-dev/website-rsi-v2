export interface UpcomingEventItem {
  id: number;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  category: string;
  registration_url: string;
  order: number;
}

export interface UpcomingEventResponse {
  success: boolean;
  data: UpcomingEventItem[];
}

export async function getUpcomingEvents(): Promise<UpcomingEventResponse> {
  try {
    const response = await fetch("/api/get_upcoming_events");

    const result: UpcomingEventResponse = await response.json();

    return result;
  } catch (err) {
    console.error("Gagal mengambil upcoming events:", err);

    return {
      success: false,
      data: [],
    };
  }
}