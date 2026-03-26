import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 🔥 API INI GET
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { ServiceUnitID, ParamedicID } = req.query;

    const params = new URLSearchParams({
      AccessKey: "AvcMblPat",
      ServiceUnitID: String(ServiceUnitID ?? ""),
      ParamedicID: String(ParamedicID ?? ""),
    });

    const response = await fetch(
      `https://avi.rsimmanuel.net/avicenna/WebService/MobileWS2.asmx/RegistrationGetAutoBillingList?${params.toString()}`,
      {
        method: "GET",
      }
    );

    const text = await response.text();

    return res.status(response.status).send(text);
  } catch (error) {
    console.error("RegistrationGetAutoBillingList API error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}