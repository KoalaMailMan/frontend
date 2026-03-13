import { useAuthStore } from "@/lib/stores/authStore";
import { cleanQuery } from "@/shared/utils/query";
import { useCallback } from "react";
import { clearMandalart } from "../service";
import { logouAPI } from "../api";

export const performLogout = () => {
  useAuthStore.getState().setWasLoggedIn(false);
  useAuthStore.getState().setAccessToken(null);
  useAuthStore.getState().setUserInfo({ nickname: "", email: "" });
  cleanQuery();
  clearMandalart();
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
