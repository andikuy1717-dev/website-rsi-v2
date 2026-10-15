import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const body = req.body;

    const params = new URLSearchParams({
      AccessKey: "AvcMblPat",
      ServiceUnitID: body.ServiceUnitID ?? "",
      ParamedicID: body.ParamedicID ?? "",
      AppointmentDate: body.AppointmentDate ?? "",
      AppointmentTime: body.AppointmentTime ?? "",
      PatientID: body.PatientID ?? "",
      FirstName: body.FirstName ?? "",
      MiddleName: body.MiddleName ?? "",
      LastName: body.LastName ?? "",
      DateOfBirth: body.DateOfBirth ?? "",
      StreetName: body.StreetName ?? "",
      District: body.District ?? "",
      County: body.County ?? "",
      City: body.City ?? "",
      State: body.State ?? "",
      ZipCode: body.ZipCode ?? "",
      PhoneNo: body.PhoneNo ?? "",
      Email: body.Email ?? "",
      GuarantorID: body.GuarantorID ?? "",
      Notes: body.Notes ?? "",
      BirthPlace: body.BirthPlace ?? "",
      Sex: body.Sex ?? "",
      Ssn: body.Ssn ?? "",
      MobilePhoneNo: body.MobilePhoneNo ?? "",
    });

    const response = await fetch(
      "http://10.200.200.185/avc/WebService/V1_1/AppointmentWS.asmx/AppointmentCreate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const text = await response.text(); // biasanya XML
    return res.status(response.status).send(text);
  } catch (error) {
    console.error("AppointmentCreate API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}