// src/api/patient_count.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://app.rsimmanuel.net/master/patient/count-active");

    if (!response.ok) throw new Error("Failed to fetch patient count");

    const result = await response.json();

    // result biasanya:
    // {
    //   "status": true,
    //   "message": "Success",
    //   "data": {
    //     "total_patient_count": 590
    //   }
    // }

    res.status(200).json(result.data ?? {});
  } catch (error) {
    console.error("Patient count fetch error:", error);
    res.status(500).json({});
  }
}
