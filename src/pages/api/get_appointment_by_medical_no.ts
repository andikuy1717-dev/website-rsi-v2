import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { medicalNo } = req.query;

    if (!medicalNo) {
      return res.status(400).json({ message: "medicalNo is required" });
    }

    const response = await fetch(
      `https://avi.rsimmanuel.net/avicenna/WebService/V1_1/AppointmentWS.asmx/AppointmentGetListByMedicalNo?AccessKey=AvcMblPat&MedicalNo=${medicalNo}`
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("ERROR GET APPOINTMENT BY MEDICAL NO:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}