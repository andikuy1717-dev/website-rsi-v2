import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  try {

    // kalau ada token → coba notify backend
    if (token) {

      await fetch("https://app.rsimmanuel.net/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).catch(()=>null);

    }

    // 🔥 logout harus selalu success
    return res.status(200).json({ ok: true });

  } catch (e) {

    console.error("Logout API error:", e);

    // tetap success
    return res.status(200).json({ ok: true });

  }

}