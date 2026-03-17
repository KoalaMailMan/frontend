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
import AuthEntry from "./feature/auth/components/AuthProvider";
import { queryClient } from "./lib/utils";
import { useMandalaStore } from "./lib/stores/mandalaStore";
import ServiceIntroCompoenent from "./feature/home/components/ServiceIntroComponent";
import AuthProvider from "./feature/auth/components/AuthProvider";
import MandalaBoard from "./feature/mandala/pages/MandalaBoard";

function App() {
  useResize();
  const { currentTheme, updateCurrentTheme, getCurrentBackground } = useTheme();
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);
  const isAuthOpen = useAuthStore((state) => state.isAuthOpen);
  const authComponentText = useAuthStore((state) => state.authComponentText);
  const isOnboardingOpen = useTutorialStore((state) => state.isOnboardingOpen);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const isServiceIntroOpen = useMandalaStore(
    (state) => state.isServiceIntroOpen
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Header
          currentTheme={currentTheme}
          onThemeChange={updateCurrentTheme}
        />
        <MandalaBoard getCurrentBackground={getCurrentBackground} />

        <Toaster position="top-center" />
        {isOnboardingOpen && <OnboardingTutorial />}
        {isServiceIntroOpen && (
          <ServiceIntroCompoenent getCurrentBackground={getCurrentBackground} />
        )}
        {isAuthOpen && !wasLoggedIn && (
          <AuthComponent>{authComponentText}</AuthComponent>
        )}

        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
