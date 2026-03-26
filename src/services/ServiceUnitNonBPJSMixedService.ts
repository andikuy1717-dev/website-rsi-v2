// src/services/ServiceUnitNonBPJSMixedService.ts

export interface ServiceUnitNonBPJSMixed {
  serviceunitname: string;
  serviceunitid: string;
  type: string;
}

export async function fetchServiceUnitNonBPJSMixed(
  type?: string
): Promise<ServiceUnitNonBPJSMixed[]> {
  try {

    const url = type
      ? `/api/service_unit_non_bpjs_mixed?type=${type}`
      : `/api/service_unit_non_bpjs_mixed`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch service unit Non BPJS & Mixed");
    }

    const result = await response.json();

    return result ?? [];

  } catch (error) {
    console.error("ServiceUnitNonBPJSMixed fetch error:", error);
    return [];
  }
}