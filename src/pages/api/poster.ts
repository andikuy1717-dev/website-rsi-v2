// src/api/poster.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const limit = req.query.limit || 1;

  try {
    const response = await fetch(`https://app.rsimmanuel.net/showListBanners?limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch banner");

    const result = await response.json();
    res.status(200).json(result.data ?? []);
  } catch (error) {
    console.error("Poster fetch error:", error);
    res.status(500).json([]);
  }
}
