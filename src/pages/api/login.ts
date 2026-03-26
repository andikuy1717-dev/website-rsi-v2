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

  const { emailOrMedicalNo, password } = req.body;

  if (!emailOrMedicalNo || !password) {
    return res.status(400).json({
      message: "Email / No RM dan password wajib diisi",
    });
  }

  try {
    const response = await fetch(
      `https://app.rsimmanuel.net/login?emailOrMedicalNo=${encodeURIComponent(
        emailOrMedicalNo
      )}&password=${encodeURIComponent(password)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json().catch(() => null);

    // 🔥 Forward status dari backend
    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Login API error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
