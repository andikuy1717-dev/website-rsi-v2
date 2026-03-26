// src/api/guarantor_count.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://app.rsimmanuel.net/master/guarantor/count-active");

    if (!response.ok) throw new Error("Failed to fetch guarantor count");

    const result = await response.json();

    // result biasanya:
    // {
    //   "status": true,
    //   "message": "Success",
    //   "data": {
    //     "total_uniqe_guarantor": 400
    //   }
    // }

    res.status(200).json(result.data ?? {});
  } catch (error) {
    console.error("Guarantor count fetch error:", error);
    res.status(500).json({});
  }
}
