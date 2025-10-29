import { useEffect } from "react";
import {
  handleLogin,
  handleLogout,
  reissueWithRefreshToken,
  shouldAttemptRefresh,
} from "./feature/auth/service";
import { useAuthStore } from "./lib/stores/authStore";
import MandalaBoard from "./feature/mandala/pages/MandalaBoard";
import useTheme from "./shared/hooks/useTheme";
import { handleMandalaData } from "./feature/mandala/service";
import { APIWithRetry, getURLQuery } from "./feature/auth/\butils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./feature/ui/Sonner";
import { toast } from "sonner";
import Header from "./shared/\bcomponents/header/Header";
import { useTutorialStore } from "./lib/stores/tutorialStore";
import OnboardingTutorial from "./feature/tutorial/page";
import useResize from "./shared/hooks/useResize";
import AuthComponent from "./feature/auth/components/AuthComponent";

const queryClient = new QueryClient();

function App() {
  useResize();
  const { currentTheme, updateCurrentTheme, getCurrentBackground } = useTheme();
  const isOnboardingOpen = useTutorialStore((state) => state.isOnboardingOpen);
  const isAuthOpen = useAuthStore((state) => state.isAuthOpen);
  const authComponentText = useAuthStore((state) => state.authComponentText);

  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);

  useEffect(() => {
    const initApp = async () => {
      try {
        // 최초 로그인
        const tokenFromURL = getURLQuery("access_token");
        if (tokenFromURL) {
          handleLogin();
          await handleMandalaData();
          return;
        }

        // 새로고침 / 재접속이라면 refresh 시도
        if (shouldAttemptRefresh()) {
          const success = await APIWithRetry(reissueWithRefreshToken);
          if (!success) {
            handleLogout();
            toast("세션 종료로 인해 처음 화면으로 돌아갑니다.");
            return;
          }
          await handleMandalaData();
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      }
    };
    initApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Header currentTheme={currentTheme} onThemeChange={updateCurrentTheme} />

      <MandalaBoard getCurrentBackground={getCurrentBackground} />
      <Toaster position="top-center" />
      {isOnboardingOpen && <OnboardingTutorial />}
      {isAuthOpen && !wasLoggedIn && (
        <AuthComponent>{authComponentText}</AuthComponent>
      )}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
