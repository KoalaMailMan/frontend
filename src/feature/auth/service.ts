import { useAuthStore } from "@/lib/stores/authStore";
import { logouAPI, refreshTokenAPI } from "./api";
import { getURLQuery } from "./\butils";
import { ENV } from "@/const";

export const handleGoogleLogin = () => {
  window.location.href = ENV.BACKEND_URL + "/api/auth/login/google";
  useAuthStore.getState().setLastProvider("google");
};

export const handleNaverLogin = () => {
  window.location.href = ENV.BACKEND_URL + "/api/auth/login/naver";
  useAuthStore.getState().setLastProvider("naver");
};

export const handleLogin = () => {
  const token = getURLQuery();
  if (token) {
    const currentTime = new Date().toISOString();
    useAuthStore.getState().setAccessToken(token);
    useAuthStore.getState().setWasLoggedIn(true);
    useAuthStore.getState().setLastLoginTime(currentTime);
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

export const handleLogout = () => {
  try {
    const res = logouAPI();
    useAuthStore.getState().setWasLoggedIn(false);
    useAuthStore.getState().setAccessToken(null);
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const reissueWithRefreshToken = async () => {
  try {
    const accessToken = await refreshTokenAPI();

    useAuthStore.getState().setAccessToken(accessToken);

    return true;
  } catch (error) {
    console.error("refresh failed:", error);

    // 실패 시 로그아웃 처리
    handleLogout();

    return false;
  }
};

export const shouldAttemptRefresh = () => {
  const accessToken = useAuthStore.getState().accessToken;
  const wasLoggedIn = useAuthStore.getState().wasLoggedIn;
  return !accessToken && wasLoggedIn;
};
