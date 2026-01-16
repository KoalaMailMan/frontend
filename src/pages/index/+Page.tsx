import { APIWithRetry, getURLQuery } from "@/feature/auth/\butils";
import {
  handleLogin,
  handleLogout,
  reissueWithRefreshToken,
  shouldAttemptRefresh,
} from "@/feature/auth/service";
import HomePage from "@/feature/home/pages/HomePage";
import MandalaBoard from "@/feature/mandala/pages/MandalaBoard";
import { handleMandalaData } from "@/feature/mandala/service";
import { useAuthStore } from "@/lib/stores/authStore";
import useResize from "@/shared/hooks/useResize";
import useTheme from "@/shared/hooks/useTheme";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { getCurrentBackground } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const temporaryAuth = useAuthStore((state) => state.temporaryAuth);
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);
  const setTemporaryAuth = useAuthStore((state) => state.setTemporaryAuth);
  useResize();

  useEffect(() => {
    setIsClient(true);

    const initApp = async () => {
      try {
        const tokenFromURL = getURLQuery("access_token");
        if (tokenFromURL) {
          handleLogin();
          await handleMandalaData();
          return;
        }

        if (shouldAttemptRefresh()) {
          const success = await APIWithRetry(reissueWithRefreshToken);
          if (!success) {
            handleLogout();
            toast("세션 종료로 인해 처음 화면으로 돌아갑니다.");
            return;
          }
          setTemporaryAuth("loggedIn");
          await handleMandalaData();
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setTemporaryAuth("none");
      }
    };
    initApp();
  }, []);

  if (!isClient) {
    return <HomePage getCurrentBackground={getCurrentBackground} />;
  }

  return temporaryAuth !== "none" || wasLoggedIn ? (
    <MandalaBoard getCurrentBackground={getCurrentBackground} />
  ) : (
    <HomePage getCurrentBackground={getCurrentBackground} />
  );
}
