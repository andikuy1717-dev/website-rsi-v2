// pages/api/validate-otp-reset-password-email.ts
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

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "Email dan OTP wajib diisi",
    });
  }

  try {
    const response = await fetch(
      `https://app.rsimmanuel.net/validateOtpResetEmail?email=${encodeURIComponent(
        email
      )}&otp=${otp}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json().catch(() => null);

    // forward status dari backend
    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Validate OTP API error:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Internal server error",
    });
  }
}
