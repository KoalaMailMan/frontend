import { useAuthStore } from "@/lib/stores/authStore";
import { getUserProfileAPI, logouAPI, refreshTokenAPI } from "./api";
import { getURLQuery } from "./\butils";
import { ENV } from "@/const";
import { apiClient } from "@/lib/api/client";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { emptyDummyData } from "../mandala/service";

export const handleGoogleLogin = () => {
  window.location.href = ENV.BACKEND_URL + "/api/auth/login/google";
  useAuthStore.getState().setLastProvider("google");
};

export const handleNaverLogin = () => {
  window.location.href = ENV.BACKEND_URL + "/api/auth/login/naver";
  useAuthStore.getState().setLastProvider("naver");
};

export const handleLogin = () => {
  const token = getURLQuery("access_token");
  if (token) {
    const currentTime = new Date().toISOString();
    useAuthStore.getState().setAccessToken(token);
    useAuthStore.getState().setWasLoggedIn(true);
    useAuthStore.getState().setLastLoginTime(currentTime);
    useAuthStore.getState().setTemporaryAuth(false);
    handleUnknownData();
    handleUserLookup(token);
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};
export const handleUnknownData = () => {
  const saved = localStorage.getItem("mandalart");
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.state.data) {
      delete parsed.state.data;
      localStorage.setItem("mandalart", JSON.stringify(parsed));
    }
  }
};

export const handleLogout = () => {
  try {
    logoutMiddleWare();
    logouAPI();
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    useAuthStore.getState().setWasLoggedIn(false);
    useAuthStore.getState().setAccessToken(null);
    useMandalaStore.getState().setData(emptyDummyData.data);
  }
};

export const logoutMiddleWare = () => {
  apiClient.addResponseInterceptor({
    onSuccess: async (res: Response) => {
      if (res.status === 204) {
        console.log("로그아웃 성공");
        return;
      }
      return await res.json();
    },
  });
};

let refreshInProgress: Promise<string | null> | null = null;
export const reissueWithRefreshToken = async () => {
  if (refreshInProgress) {
    // 이미 리프레시가 진행중이라면, 진행중인 리프레시 반환
    return refreshInProgress;
  }

  refreshInProgress = (async () => {
    try {
      const newAccessToken = await refreshTokenAPI();
      useAuthStore.getState().setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("refresh failed:", error);
      handleLogout();
      return null;
    } finally {
      refreshInProgress = null;
    }
  })();
};

export const shouldAttemptRefresh = () => {
  const accessToken = useAuthStore.getState().accessToken;
  const wasLoggedIn = useAuthStore.getState().wasLoggedIn;
  return !accessToken && wasLoggedIn;
};

export const handleUserLookup = async (accessToken: string) => {
  if (!accessToken) return;
  const res = await getUserProfileAPI(accessToken);
  const user = res?.data;
  if (user) {
    useAuthStore.getState().setUserInfo(user);
  }
};
