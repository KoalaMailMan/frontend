import { useAuthStore } from "@/lib/stores/authStore";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { handleLogout } from "../service";
import { toast } from "sonner";
import HomePage from "@/feature/home/pages/HomePage";
import MandalaBoard from "@/feature/mandala/pages/MandalaBoard";
import useUserInfo from "../hooks/useUserInfo";

type Props = {
  getCurrentBackground: () => Record<string, string>;
};

export default function AuthEntry({ getCurrentBackground }: Props) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const temporaryAuth = useAuthStore((state) => state.temporaryAuth);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setWasLoggedIn = useAuthStore((state) => state.setWasLoggedIn);
  const setLastLoginTime = useAuthStore((state) => state.setLastLoginTime);
  const setTemporaryAuth = useAuthStore((state) => state.setTemporaryAuth);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  const {
    data: token,
    isSuccess: isTokenReady,
    isError,
    error: refreshError,
  } = useAuth();

  const { data: userInfo, isSuccess: isUserReady } = useUserInfo();

  useEffect(() => {
    if (isTokenReady) {
      setAccessToken(token);
    }
    if (isError) {
      console.log(refreshError);
      handleLogout();
      toast("세션 종료로 인해 처음 화면으로 돌아갑니다.");
    }
  }, [token, isTokenReady, isError]);

  useEffect(() => {
    if (userInfo && isUserReady) {
      const currentTime = new Date().toISOString();
      setWasLoggedIn(true);
      setLastLoginTime(currentTime);
      setTemporaryAuth("loggedIn");
      setUserInfo(userInfo);
    }
  }, [userInfo, isUserReady]);

  if (temporaryAuth === "temporary")
    return <MandalaBoard getCurrentBackground={getCurrentBackground} />;
  if (temporaryAuth === "loggedIn" && accessToken)
    return <MandalaBoard getCurrentBackground={getCurrentBackground} />;

  return <HomePage getCurrentBackground={getCurrentBackground} />;
}
