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

  const { file } = req.query;

  // Ambil token dari Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  const cleanFile =
    typeof file === "string" ? file.trim() : "";

  if (!cleanFile) {
    return res.status(400).json({
      message: "File parameter tidak valid",
    });
  }

  if (!token) {
    return res.status(401).json({
      message: "Token tidak ditemukan",
    });
  }

  try {
    const response = await fetch(
      `https://app.rsimmanuel.net/ftp/view-file?file=${encodeURIComponent(
        `lab/${cleanFile}`
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Gagal mengambil file",
      });
    }

    const buffer = await response.arrayBuffer();

    // 🔥 Forward PDF langsung
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    return res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error("Get Lab File API error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}