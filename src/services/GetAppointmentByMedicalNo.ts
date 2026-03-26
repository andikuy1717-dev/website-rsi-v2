export const getAppointmentByMedicalNo = async (medicalNo: string) => {
  try {
    const res = await fetch(
      `/api/get_appointment_by_medical_no?medicalNo=${medicalNo}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch appointment list");
    }

    return await res.json();
  } catch (error) {
    console.error("SERVICE ERROR:", error);
    throw error;
  }
};