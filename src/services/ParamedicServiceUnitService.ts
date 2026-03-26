export interface ParamedicServiceUnit {
  paramedicid: string;
  paramedicname: string;
  serviceunitid: string;
  serviceunitname: string;
  foto_base64?: string;
}

export async function fetchParamedicServiceUnit(): Promise<
  ParamedicServiceUnit[]
> {
  try {
    const response = await fetch(`/api/paramedic_service_unit`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch paramedic service unit");
    }

    const result = await response.json();
    return result ?? [];
  } catch (error) {
    console.error("ParamedicServiceUnit fetch error:", error);
    return [];
  }
}
