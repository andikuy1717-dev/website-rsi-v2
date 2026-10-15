import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).json({
        message: "JWT tidak ada",
      });
    }

    const api = await fetch(
      "https://app.rsimmanuel.net/api/payment-test",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth,
          "Accept": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const text = await api.text();

    console.log("PAYMENT TEST STATUS:", api.status);
    console.log("PAYMENT TEST RAW:", text);

    try {
      return res
        .status(api.status)
        .json(JSON.parse(text));
    } catch {
      return res
        .status(api.status)
        .send(text);
    }

  } catch (e: any) {
    console.error("PAYMENT TEST ERROR:", e);

    return res.status(500).json({
      error: e.message,
    });
  }
}