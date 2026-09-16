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

  try {
    const response = await fetch(
      "https://app.rsimmanuel.net/showListBanners",
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
    console.error(err);

    return res.status(500).json({
      status: "ERROR",
      message: "Internal Server Error",
    });
  }
}