import { useEffect } from "react";
import { useAuthStore } from "./lib/stores/authStore";
import useTheme from "./shared/hooks/useTheme";
import { clearURLQuery, getURLQuery } from "./feature/auth/\butils";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./feature/ui/Sonner";
import { toast } from "sonner";
import Header from "./shared/\bcomponents/header/Header";
import { useTutorialStore } from "./lib/stores/tutorialStore";
import OnboardingTutorial from "./feature/tutorial/page";
import useResize from "./shared/hooks/useResize";
import AuthComponent from "./feature/auth/components/AuthComponent";
import AuthEntry from "./feature/auth/components/AuthGateway";
import { queryClient } from "./lib/utils";

function App() {
  useResize();
  const { currentTheme, updateCurrentTheme, getCurrentBackground } = useTheme();
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);
  const isAuthOpen = useAuthStore((state) => state.isAuthOpen);
  const authComponentText = useAuthStore((state) => state.authComponentText);
  const isOnboardingOpen = useTutorialStore((state) => state.isOnboardingOpen);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setTemporaryAuth = useAuthStore((state) => state.setTemporaryAuth);

  useEffect(() => {
    const initApp = async () => {
      try {
        // 최초 로그인
        const token = getURLQuery("access_token");
        const errorFromUrl = getURLQuery("error");
        if (errorFromUrl) {
          toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
          clearURLQuery();
          return;
        }
        if (token) {
          setAccessToken(token);
          clearURLQuery();
          return;
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setTemporaryAuth("none");
      }
    };
    initApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Header currentTheme={currentTheme} onThemeChange={updateCurrentTheme} />

      <AuthEntry getCurrentBackground={getCurrentBackground} />

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
