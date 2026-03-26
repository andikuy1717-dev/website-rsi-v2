import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {

    const { token, old_password, new_password, new_password_confirmation } = req.body;

    const response = await fetch(
      "https://app.rsimmanuel.net/change-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password,
          new_password,
          new_password_confirmation,
        }),
      }
    );

    const result = await response.json();

    return res.status(response.status).json(result);

  } catch (error) {

    console.error("Change Password API error:", error);

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });

  }
}