import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  try {
    const response = await fetch(
      "https://app.rsimmanuel.net/vision-mission",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const result = await response.json();

    return res.status(response.status).json(result);
  } catch (err) {
    console.error("Gagal mengambil data visi dan misi:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: {
        vision: [],
        missions: [],
      },
    });
  }
}