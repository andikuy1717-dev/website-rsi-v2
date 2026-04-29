import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      "https://avi.rsimmanuel.net/avicenna/WebService/MobileWS2.asmx/BedAvailability?AccessKey=AvcMblPat"
    );

    const text = await response.text();

    // 🔥 karena .asmx kadang return XML, bukan JSON
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
      return res.status(200).json({
        status: "SUCCESS",
        raw: text, // fallback kalau XML
      });
    }
  } catch (error) {
    console.error("ERROR GET BED AVAILABILITY:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Internal Server Error",
    });
  }
}