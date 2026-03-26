// src/services/bannerService.ts
export async function fetchPoster(limit = 1) {
  try {
    const response = await fetch(`/api/poster?limit=${limit}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch banner");

    const result = await response.json();
    return result ?? [];
  } catch (error) {
    console.error("Poster fetch error:", error);
    return [];
  }
}
