import { useAuthStore } from "@/lib/stores/authStore";
import useRefresh from "../hooks/useRefresh";
import { useEffect } from "react";
import { handleLogout } from "../service";
import { toast } from "sonner";
import MandalaBoard from "@/feature/mandala/pages/MandalaBoard";
import useUserInfo from "../hooks/useUserInfo";

type Props = {
  getCurrentBackground: () => Record<string, string>;
};

export default function AuthEntry({ getCurrentBackground }: Props) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setWasLoggedIn = useAuthStore((state) => state.setWasLoggedIn);
  const setLastLoginTime = useAuthStore((state) => state.setLastLoginTime);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

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
      console.error(refreshError);
      handleLogout();
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

  return <MandalaBoard getCurrentBackground={getCurrentBackground} />;

  // if (temporaryAuth === "temporary")
  //   return <MandalaBoard getCurrentBackground={getCurrentBackground} />;
  // if (temporaryAuth === "loggedIn" && accessToken)
  // return <MandalaBoard getCurrentBackground={getCurrentBackground} />;

  // return <HomePage getCurrentBackground={getCurrentBackground} />;
}
