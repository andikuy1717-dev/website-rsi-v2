import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { dateStart, dateEnd, paramedicId = "", serviceUnitId = "" } = req.query;

    const url =
      "https://avi.rsimmanuel.net/avicenna/WebService/V1_1/AppointmentWS.asmx/ParamedicScheduleDateGetList" +
      `?AccessKey=AvcMblPat` +
      `&DateStart=${dateStart}` +
      `&DateEnd=${dateEnd}` +
      `&ParamedicID=${paramedicId ?? ""}` +
      `&ServiceUnitID=${serviceUnitId ?? ""}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetch Avicenna failed");

    const json = await response.json();

    // 🔥 KIRIM LANGSUNG DATA ARRAY
    res.status(200).json(json.data ?? []);
  } catch (error) {
    console.error("Paramedic schedule API error:", error);
    res.status(500).json([]);
  }

}
