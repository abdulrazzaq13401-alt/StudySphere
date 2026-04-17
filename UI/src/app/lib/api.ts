export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:5001";

export async function parseApiError(response: Response) {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;
  return payload?.message ?? "Request failed.";
}
