// pages/api/send-otp.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Wajib POST
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email wajib diisi",
    });
  }

  try {
    const response = await fetch(
      `https://app.rsimmanuel.net/sendOtpPasswordResetEmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const result = await response.json().catch(() => null);

    // Forward status dari backend
    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Send OTP API error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
