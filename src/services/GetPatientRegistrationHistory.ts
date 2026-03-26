export interface PatientRegistrationItem {
  RegistrationNo: string;
  RegistrationDate: string;
  RegistrationTime: string;
  SRRegistrationType: string;
  ParamedicID: string;
  ParamedicName: string;
  ServiceUnitID: string;
  ServiceUnitName: string;
}

export interface GetPatientRegistrationHistoryResponse {
  status?: string;
  message?: string;
  errorCode?: string;
  errorMessages?: string;
  data?: PatientRegistrationItem[];
}

export async function getPatientRegistrationHistory(
  params: {
    medicalNo: string;
    serviceUnitId?: string;
    paramedicId?: string;
    dateStart?: string;
    dateEnd?: string;
  },
): Promise<GetPatientRegistrationHistoryResponse> {
  try {
    const query = new URLSearchParams({
      medicalNo: params.medicalNo,
      serviceUnitId: params.serviceUnitId ?? "",
      paramedicId: params.paramedicId ?? "",
      dateStart: params.dateStart ?? "",
      dateEnd: params.dateEnd ?? "",
    });

    const response = await fetch(
      `/api/get_patient_registration_history?${query.toString()}`,
      {
        method: "GET",
      }
    );

    const result: any = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        status: "ERR",
        errorCode: result?.errorCode ?? String(response.status),
        message: result?.message ?? "Gagal mengambil data",
        errorMessages: result?.errorMessages,
      };
    }

    return result;
  } catch (error) {
    console.error(
      "Get Patient Registration History service error:",
      error
    );
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}