import { apiClient } from "@/lib/api/client";

export const logouAPI = async () => {
  const LOGOUT_URL = "/api/auth/logout";
  try {
    const res = await apiClient.post(LOGOUT_URL, null, {
      method: "POST",
      credentials: "include",
    });
    return res;
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const refreshTokenAPI = async () => {
  const REFRESH_URL = "/api/auth/refresh";

  try {
    const res = await apiClient.post(REFRESH_URL, null, {
      method: "POST",
      credentials: "include",
    });

    const accessToken = res.data.accessToken;
    if (!accessToken) throw new Error("refresh failed");

    return accessToken;
  } catch (error) {
    console.error("refresh failed:", error);
  }
};
