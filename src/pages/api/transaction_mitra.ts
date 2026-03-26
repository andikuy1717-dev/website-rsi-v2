import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token = req.headers.authorization;
  console.log("BODY DIKIRIM KE AVICENNA:", req.body);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token tidak ada" });
  }

  try {
    const response = await fetch(
      "https://app.rsimmanuel.net/transaction-mitra",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // ⬅️ kirim bearer dari frontend
        },
        body: JSON.stringify(req.body),
      }
    );
    const result = await response.json().catch(() => null);
    console.log("STATUS AVICENNA:", response.status);
    console.log("RESPONSE AVICENNA:", result);

    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Transaction Mitra API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}