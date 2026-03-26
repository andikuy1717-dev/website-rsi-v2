import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Family member id is required",
      });
    }

    const response = await fetch(
      `https://app.rsimmanuel.net/familyMember/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Delete Family Member API error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}