// src/services/PatientCountService.ts
export async function fetchPatientCount() {
  try {
    const response = await fetch(`/api/patient_count`, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch patient count");

    const result = await response.json();

    // result biasanya:
    // { total_patient_count: 590 }
    return result ?? {};
  } catch (error) {
    console.error("PatientCount fetch error:", error);
    return {};
  }
}
