export interface ParamedicSchedule {
  ParamedicID: string;
  ParamedicName: string;
  ServiceUnitID: string;
  ServiceUnitName: string;
  ScheduleDate: string;
  OperationalTimeName: string;
  StartTime1: string;
  EndTime1: string;
  Quota: number;
  QuotaBpjs: number;
}

export async function fetchParamedicSchedule(params: {
  dateStart: string;
  dateEnd: string;
  paramedicId?: string;
  serviceUnitId?: string;
}): Promise<ParamedicSchedule[]> {
  const query = new URLSearchParams({
    dateStart: params.dateStart,
    dateEnd: params.dateEnd,
    paramedicId: params.paramedicId ?? "",
    serviceUnitId: params.serviceUnitId ?? "",
  });

  const response = await fetch(`/api/paramedic_schedule?${query}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch paramedic schedule");
  }

  const json = await response.json();

  return Array.isArray(json) ? json : json.data ?? [];
}

