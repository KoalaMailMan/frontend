import { apiClient } from "@/lib/api/client";
import type { RefreshType, UserType } from "./type";

export const logouAPI = async () => {
  const LOGOUT_URL = "/api/auth/logout";
  try {
    const res = await apiClient.post(
      LOGOUT_URL,
      { requiresAuth: false },
      {
        method: "POST",
        credentials: "include",
      }
    );
    return res;
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const refreshTokenAPI = async () => {
  const REFRESH_URL = "/api/auth/refresh";

  try {
    const res = await apiClient.post<RefreshType>(
      REFRESH_URL,
      { requiresAuth: false },
      {
        credentials: "include",
      }
    );

    const accessToken = res.data.accessToken;
    return accessToken;
  } catch (error) {
    console.error("refresh failed:", error);
  }
};

export const getUserProfileAPI = async (): Promise<UserType | undefined> => {
  const USER_URL = "/api/user";
  try {
    const res = await apiClient.get<UserType>(USER_URL, {
      requiresAuth: true,
      credentials: "include",
    });
    return res;
  } catch (error) {
    console.error("refresh failed:", error);
  }
};
