import { apiClient } from "@/lib/api/client";
import type { ServerMandalaType } from "../../service";

export const createMandalaAPI = async (data: ServerMandalaType) => {
  const MANDALA_URL = "/api/mandalart";
  try {
    const res = await apiClient.put(MANDALA_URL, data, {
      requiresAuth: true,
      credentials: "include",
    });
    return res;
  } catch (error) {
    console.error("createMandalaAPI failed:", error);
  }
};
