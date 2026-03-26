// src/api/service_unit_non_bpjs_mixed.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

    const { type } = req.query; // 🔥 AMBIL QUERY PARAM

    const response = await fetch(
      "https://app.rsimmanuel.net/getAllServiceUnitNonBPJSnMixed",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch service unit Non BPJS & Mixed");
    }

    const result = await response.json();

    if (!Array.isArray(result)) {
      return res.status(200).json([]);
    }

    // 🔥 FILTER DI SINI
    let filtered = result;

    if (type) {
      filtered = result.filter((item: any) =>
        String(item.type).toLowerCase() === String(type).toLowerCase()
      );
    }

    return res.status(200).json(filtered);
    
  } catch (error) {
    console.error("Service Unit Non BPJS Mixed fetch error:", error);
    res.status(500).json([]);
  }
}
