// src/services/GuarantorCountService.ts
export async function fetchGuarantorCount() {
  try {
    const response = await fetch(`/api/guarantor_count`, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch guarantor count");

    const result = await response.json();

    // result biasanya:
    // { total_uniqe_guarantor: 400 }
    return result ?? {};
  } catch (error) {
    console.error("GuarantorCount fetch error:", error);
    return {};
  }
}
