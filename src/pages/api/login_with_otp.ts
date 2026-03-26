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
      status: "ERROR",
      errorCode: "VALIDATION_ERROR",
      message: "Email dan OTP wajib diisi",
    });
  }

  try {
    // HIT API BACKEND LOGIN OTP
    const response = await fetch(
      `https://app.rsimmanuel.net/loginWithOTP?email=${encodeURIComponent(
        email
      )}&otp=${encodeURIComponent(otp)}`,
      {
        method: "POST", // backend minta POST walaupun pakai query
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json().catch(() => null);

    // Forward response backend apa adanya
    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Login With OTP API error:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Internal server error",
    });
  }
}
