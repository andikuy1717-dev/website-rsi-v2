export async function getPatientFirstName(medicalNo: string) {
  const response = await fetch("/api/first_name_patient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ medicalNo }),
  });

  const json = await response.json();

  return json?.data?.FirstName ?? null;
}
