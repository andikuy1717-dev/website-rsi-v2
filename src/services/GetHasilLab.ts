export interface FtpFileItem {
  file_name: string;
  view_url: string;
}

export interface FtpPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface GetFtpFilesResponse {
  status?: string;
  errorCode?: string;
  message?: string;
  errorMessages?: string[];
  data?: {
    files: FtpFileItem[];
    pagination: FtpPagination;
  };
}

export async function getFtpFiles(
  medicalNo: string,
  token: string
): Promise<GetFtpFilesResponse> {
  try {
    const response = await fetch(
      `/api/get_hasil_lab?medicalNo=${encodeURIComponent(medicalNo)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: GetFtpFilesResponse = await response.json();

    if (!response.ok) {
      return {
        status: "ERR",
        errorCode: result.errorCode ?? String(response.status),
        message: result.message,
        errorMessages: result.errorMessages,
      };
    }

    return result;
  } catch (error) {
    console.error("Get FTP Files service error:", error);
    return {
      status: "ERROR",
      message: "Gagal terhubung ke server",
    };
  }
}
