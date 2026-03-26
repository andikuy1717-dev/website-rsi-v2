import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 🔒 Wajib POST
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  const { medicalNo } = req.body;

  // Ambil token dari Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!medicalNo) {
    return res.status(400).json({
      message: "Medical No wajib diisi",
    });
  }

  if (!token) {
    return res.status(401).json({
      message: "Token tidak ditemukan",
    });
  }

  try {
    const response = await fetch(
      `https://app.rsimmanuel.net/getMedicalNumbers?medicalNo=${encodeURIComponent(
        medicalNo
      )}`,
      {
        method: "POST",
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
    console.error("Get Medical Numbers API error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}