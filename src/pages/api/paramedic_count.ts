// src/api/paramedic_count.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://app.rsimmanuel.net/master/paramedic/count-active");

    if (!response.ok) throw new Error("Failed to fetch paramedic count");

    const result = await response.json();

    // result biasanya:
    // {
    //   "status": true,
    //   "message": "Success",
    //   "data": {
    //     "active_paramedic_count": 17
    //   }
    // }

    res.status(200).json(result.data ?? {});
  } catch (error) {
    console.error("Paramedic count fetch error:", error);
    res.status(500).json({});
  }
}
