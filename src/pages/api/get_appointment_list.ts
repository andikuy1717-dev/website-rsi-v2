import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  const { medicalNo } = req.body;

  const cleanMedicalNo =
    typeof medicalNo === "string" ? medicalNo.trim() : "";

  if (!cleanMedicalNo) {
    return res.status(400).json({
      message: "Medical No tidak valid",
    });
  }

  try {

    const url =
      `https://app.rsimmanuel.net/get-appointment-list-by-medical-no` +
      `?medical_no=${encodeURIComponent(cleanMedicalNo)}`;

    const response = await fetch(url, { method: "GET" });

    // WAJIB text dulu (biar aman kalau server kadang aneh)
    const raw = await response.text();

    let result;

    try {
      result = JSON.parse(raw);
    } catch {
      console.error("NON JSON RESPONSE:", raw);
      result = {
        status: "ERROR",
        message: "Response bukan JSON",
        raw,
      };
    }

    return res.status(200).json(result);

  } catch (error) {

    console.error("AppointmentList API error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}