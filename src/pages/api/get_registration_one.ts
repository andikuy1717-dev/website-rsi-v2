import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { registrationNo } = req.body;

  const cleanReg =
    typeof registrationNo === "string" ? registrationNo.trim() : "";

  if (!cleanReg) {
    return res.status(400).json({
      message: "Registration No tidak valid",
    });
  }

  try {

    const url =
`https://avi.rsimmanuel.net/avicenna/WebService/MobileWS2.asmx/RegistrationGetOne?AccessKey=AvcMblPat&RegistrationNo=${encodeURIComponent(cleanReg)}`;

    const response = await fetch(url);

    // 🔥 baca sebagai TEXT dulu (AMAN)
    const text = await response.text();

    // 🔥 coba parse JSON
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("NOT JSON FROM AVICENNA:", text);
      return res.status(500).json({
        message: "Webservice tidak return JSON",
        raw: text.substring(0,300)
      });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error("RegistrationGetOne API error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}