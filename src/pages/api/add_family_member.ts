import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const body = req.body;

    const response = await fetch(
      "https://app.rsimmanuel.net/addFamilyMember",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: body.user_id,
          medicalNo: body.medicalNo,
          nik: body.nik,
          relation: body.relation,
        }),
      }
    );

    const result = await response.json();

    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Add Family Member API error:", error);

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}