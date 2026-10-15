import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const invoiceNumber = req.query.invoiceNumber;

  if (typeof invoiceNumber !== "string" || !invoiceNumber) {
    return res.status(400).json({
      success: false,
      message: "invoiceNumber is required",
    });
  }

  try {
    const response = await fetch(
      `https://app.rsimmanuel.net/api/payment-test/status?invoiceNumber=${encodeURIComponent(invoiceNumber)}`,
      { method: "GET" }
    );

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch {
    return res.status(502).json({
      success: false,
      message: "Unable to check payment status",
    });
  }
}