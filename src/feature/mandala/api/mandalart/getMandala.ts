import { apiClient } from "@/lib/api/client";

export const getMandalaAPI = async (accessToken: string) => {
  const MANDALA_URL = "/api/mandalart";
  try {
    const res = await apiClient.get(MANDALA_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    return res;
  } catch (error) {
    console.error("getMandalaAPI failed:", error);
  }
};
