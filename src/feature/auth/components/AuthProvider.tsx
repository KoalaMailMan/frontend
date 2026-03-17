import { useAuthStore } from "@/lib/stores/authStore";
import useRefresh from "../hooks/useRefresh";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import useUserInfo from "../hooks/useUserInfo";
import useOAuthCallback from "../hooks/useLogin";
import { apiClient } from "@/lib/api/client";
import { reissueWithRefreshToken } from "../service";
import { performLogout } from "../hooks/useLogout";
import { cleanQuery } from "@/shared/utils/query";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setWasLoggedIn = useAuthStore((state) => state.setWasLoggedIn);
  const setLastLoginTime = useAuthStore((state) => state.setLastLoginTime);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  useEffect(() => {
    apiClient.setTokenRefresher(reissueWithRefreshToken);
  }, []);

  useOAuthCallback();

  const {
    data: token,
    isSuccess: isTokenReady,
    isError,
    error: refreshError,
  } = useRefresh();

  const { data: userInfo, isSuccess: isUserReady } = useUserInfo();

  useEffect(() => {
    if (isTokenReady) {
      setAccessToken(token);
    }
    if (isError) {
      performLogout();
      toast("세션 종료로 인해 처음 화면으로 돌아갑니다.");
    }
  }, [token, isTokenReady, isError]);

  useEffect(() => {
    if (userInfo && isUserReady) {
      const currentTime = new Date().toISOString();
      setWasLoggedIn(true);
      setLastLoginTime(currentTime);
      setUserInfo(userInfo);
    }
  }, [userInfo, isUserReady]);

  return <>{children}</>;

  // if (temporaryAuth === "temporary")
  //   return <MandalaBoard getCurrentBackground={getCurrentBackground} />;
  // if (temporaryAuth === "loggedIn" && accessToken)
  // return <MandalaBoard getCurrentBackground={getCurrentBackground} />;

  // return <HomePage getCurrentBackground={getCurrentBackground} />;
}
