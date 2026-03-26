import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { medicalNo } = req.body;

  if (!medicalNo) {
    return res.status(400).json({ message: "MedicalNo wajib" });
  }

  try {
    const response = await fetch(
      `https://avi.rsimmanuel.net/avicenna/WebService/V1_1/AppointmentWS.asmx/PatientGetOneByMedicalNo?AccessKey=AvcMblPat&MedicalNo=${encodeURIComponent(
        medicalNo
      )}`
    );

    const text = await response.text();

    // API ini BALIK XML
    return res.status(200).send(text);
  } catch (error) {
    console.error("Patient API error:", error);
    return res.status(500).json({ message: "Gagal ambil data pasien" });
  }
}
