import { useAuthStore } from "@/lib/stores/authStore";
import { cleanQuery } from "@/shared/utils/query";
import { useCallback } from "react";
import { logouAPI } from "../api";
import { useMandalaStore } from "@/lib/stores/mandalaStore";

export const performLogout = () => {
  useAuthStore.getState().clearAuth();
  useMandalaStore.getState().clearMandalart();
  cleanQuery();
};

export default function useLogout() {
  return useCallback(async () => {
    try {
      await logouAPI();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      performLogout();
    }
  }, []);
}
