import { apiClient } from "@/lib/api/client";
import type { ServerMandalaType } from "../../service/type";

export const getMandalaAPI = async () => {
  const MANDALA_URL = "/api/mandalart";
  try {
    const res = await apiClient.get<ServerMandalaType>(MANDALA_URL, {
      requiresAuth: true,
      credentials: "include",
    });
    return res;
  } catch (error) {
    console.error("getMandalaAPI failed:", error);
    throw error;
  }
};
