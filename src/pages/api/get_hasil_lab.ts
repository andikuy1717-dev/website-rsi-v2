import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 🔒 Wajib GET
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  const { medicalNo } = req.query;

  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  const cleanMedicalNo =
    typeof medicalNo === "string" ? medicalNo.trim() : "";

  if (!cleanMedicalNo) {
    return res.status(400).json({
      message: "Medical No tidak valid",
    });
  }

  if (!token) {
    return res.status(401).json({
      message: "Token tidak ditemukan",
    });
  }

  try {
    const response = await fetch(
      `https://app.rsimmanuel.net/ftp/view/${encodeURIComponent(
        cleanMedicalNo
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json().catch(() => null);

    // 🔥 Forward status + response asli
    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Get FTP Files API error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}