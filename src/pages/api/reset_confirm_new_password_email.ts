// pages/api/reset_confirm_new_password_email.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, new_password, new_password_confirmation } = req.body;

  if (!email || !new_password || !new_password_confirmation) {
    return res.status(400).json({
      status: "ERROR",
      errorCode: "VALIDATION_ERROR",
      message: "Data tidak lengkap",
    });
  }

  try {
    const response = await fetch(
      "https://app.rsimmanuel.net/registerNewPasswordEmail",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          new_password,
          new_password_confirmation,
        }),
      }
    );

    const result = await response.json().catch(() => null);
    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      status: "ERROR",
      errorCode: "SERVER_ERROR",
      message: "Gagal reset password",
    });
  }
}
