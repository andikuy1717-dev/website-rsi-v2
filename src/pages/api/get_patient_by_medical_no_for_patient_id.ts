import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { medicalNo } = req.query;

  if (!medicalNo) {
    return res.status(400).json({ message: "MedicalNo wajib" });
  }

  try {
    const url =
      "https://avi.rsimmanuel.net/avicenna/WebService/V1_1/AppointmentWS.asmx/PatientGetOneByMedicalNo" +
      `?AccessKey=AvcMblPat` +
      `&MedicalNo=${encodeURIComponent(String(medicalNo))}`;

    const response = await fetch(url);

    const text = await response.text(); // karena asmx biasanya return XML

    return res.status(response.status).send(text); // kirim mentah
  } catch (error) {
    console.error("PatientGetOneByMedicalNo API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}