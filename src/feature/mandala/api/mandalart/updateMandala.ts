import { apiClient } from "@/lib/api/client";

export const updateMandalaAPI = async (
  accessToken: string,
  mandalartId: string,
  data: any
) => {
  const MANDALA_URL = "/api/mandalart/" + mandalartId;
  try {
    const res = await apiClient.put(MANDALA_URL, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    return res;
  } catch (error) {
    console.error("updateMandala failed:", error);
  }
};
