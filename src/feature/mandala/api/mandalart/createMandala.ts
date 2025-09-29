import { apiClient } from "@/lib/api/client";

export const createMandalaAPI = async (accessToken: string, data: any) => {
  const MANDALA_URL = "/api/mandalart";
  try {
    const res = await apiClient.put(MANDALA_URL, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    return res;
  } catch (error) {
    console.error("createMandalaAPI failed:", error);
  }
};
