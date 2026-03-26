import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    medicalNo,
    serviceUnitId = "",
    paramedicId = "",
    dateStart = "",
    dateEnd = "",
  } = req.query;

  if (!medicalNo) {
    return res.status(400).json({ message: "MedicalNo wajib" });
  }

  try {
    const url =
      "https://avi.rsimmanuel.net/avicenna/WebService/MobileWS2.asmx/PatientRegistrationHistory" +
      `?AccessKey=AvcMblPat` +
      `&MedicalNo=${encodeURIComponent(String(medicalNo))}` +
      `&ServiceUnitID=${encodeURIComponent(String(serviceUnitId))}` +
      `&ParamedicID=${encodeURIComponent(String(paramedicId))}` +
      `&DateStart=${encodeURIComponent(String(dateStart))}` +
      `&DateEnd=${encodeURIComponent(String(dateEnd))}`;

    const response = await fetch(url); // ⬅️ TANPA HEADER

    const text = await response.text(); // XML

    return res.status(response.status).send(text); // ⬅️ KIRIM MENTAH
  } catch (error) {
    console.error("PatientRegistrationHistory API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}