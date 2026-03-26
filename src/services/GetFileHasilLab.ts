export const viewHasilLab = async (
  file: string,
  token: string
) => {
  const response = await fetch(
    `/api/get_lab_file?file=${encodeURIComponent(file)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Gagal membuka file");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  window.open(url, "_blank");
};