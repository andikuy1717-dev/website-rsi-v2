export interface AutoBillingItem {
  ItemID: string;
  ItemName: string;
  Qty: number;
  Price: number;
  Total: number;
}

export interface AutoBillingResponse {
  status?: string;
  message?: string;
  errorCode?: string;
  data?: AutoBillingItem[];
}

export async function fetchAutoBillingList(
  ServiceUnitID: string,
  ParamedicID: string
): Promise<AutoBillingResponse> {
  try {
    const response = await fetch(
      `/api/registration_auto_billing?ServiceUnitID=${encodeURIComponent(
        ServiceUnitID
      )}&ParamedicID=${encodeURIComponent(ParamedicID)}`,
      {
        method: "GET",
      }
    );

    const resultText = await response.text();

    if (!response.ok) {
      return {
        status: "ERR",
        message: "Gagal ambil billing list",
      };
    }

    let parsedData: any = resultText;

    // 🔥 coba parse JSON
    try {
      parsedData = JSON.parse(resultText);
    } catch {
      // kalau bukan JSON biarkan string
    }

    return {
      status: "OK",
      data: parsedData?.data ?? parsedData,
    };
  } catch (error) {
    console.error("AutoBilling service error:", error);

    return {
      status: "ERROR",
      message: "Gagal konek server",
    };
  }
}