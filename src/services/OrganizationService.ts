export interface OrganizationItem {
  id: number;
  name: string;
  position: string;
  periode: string;
  photo: string;
  photo_url: string;
  order: number;
  children: OrganizationItem[];
}

export interface OrganizationResponse {
  success: boolean;
  data: OrganizationItem[];
}

export async function getOrganization(): Promise<OrganizationResponse> {
  try {
    const response = await fetch("/api/get_organization");

    const result: OrganizationResponse = await response.json();

    return result;
  } catch (err) {
    console.error("Gagal mengambil data struktur organisasi:", err);

    return {
      success: false,
      data: [],
    };
  }
}