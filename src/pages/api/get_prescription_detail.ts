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

  const { prescriptionNo } = req.body;

  const cleanPrescriptionNo =
    typeof prescriptionNo === "string" ? prescriptionNo.trim() : "";

  if (!cleanPrescriptionNo) {
    return res.status(400).json({
      message: "PrescriptionNo tidak valid",
    });
  }

  try {

    const url =
      `https://avi.rsimmanuel.net/avicenna/WebService/MobileWS2.asmx/PrescriptionDetail` +
      `?AccessKey=AvcMblPat` +
      `&PrescriptionNo=${encodeURIComponent(cleanPrescriptionNo)}`;

    const response = await fetch(url, { method: "GET" });

    // wajib text dulu (ASMx kadang XML / JSON campur)
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

    console.error("PrescriptionDetail API error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}