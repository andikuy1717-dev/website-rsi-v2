export interface RegistrationItem {
  RegistrationNo: string;
  RegistrationDate: string;
  RegistrationTime: string;
  RegistrationQue: number;
  ParamedicName: string;
  ServiceUnitName: string;
  VisitTypeName: string;
  Notes: string;
  GuarantorName: string;
  MedicalNo: string;
  FirstName: string;
  DiagnosisText: string;
}

export interface GetRegistrationResponse {
  status?: string;
  errorCode?: string;
  data?: RegistrationItem[];
}

export async function getRegistrationOne(
  registrationNo: string
): Promise<GetRegistrationResponse> {
  try {
    const response = await fetch("/api/get_registration_one", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registrationNo,
      }),
    });

    const result: GetRegistrationResponse = await response.json();

    if (!response.ok) {
      return {
        status: "ERR",
        errorCode: result.errorCode ?? String(response.status),
      };
    }

    return result;
  } catch (error) {
    console.error("Get Registration service error:", error);

    return {
      status: "ERROR",
    };
  }
}