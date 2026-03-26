import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      "https://app.rsimmanuel.net/getParamedicnServiceUnit",
      { method: "GET" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch paramedic service unit");
    }

    const result = await response.json();

    // API response:
    // {
    //   status: "OK",
    //   data: [...]
    // }

    res.status(200).json(result?.data ?? []);
  } catch (error) {
    console.error("Paramedic Service Unit fetch error:", error);
    res.status(500).json([]);
  }
}
