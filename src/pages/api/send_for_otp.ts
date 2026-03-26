// pages/api/send_for_otp.ts
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
    // HIT API BACKEND
    const response = await fetch(
      `https://app.rsimmanuel.net/SendOtpLogin?email=${encodeURIComponent(
        email
      )}`,
      {
        method: "POST", // BE minta POST walaupun param di query
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json().catch(() => null);

    // Forward status & response backend apa adanya
    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Send OTP Login API error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
