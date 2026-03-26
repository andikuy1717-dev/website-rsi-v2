// src/services/ParamedicCountService.ts
export async function fetchParamedicCount() {
  try {
    const response = await fetch(`/api/paramedic_count`, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch paramedic count");

    const result = await response.json();

    // result biasanya:
    // { active_paramedic_count: 17 }
    return result ?? {};
  } catch (error) {
    console.error("ParamedicCount fetch error:", error);
    return {};
  }
}


