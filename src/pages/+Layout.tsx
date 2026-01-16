import { useEffect, useState } from "react";

import useTheme from "../shared/hooks/useTheme";
import { useAuthStore } from "../lib/stores/authStore";
import { useTutorialStore } from "../lib/stores/tutorialStore";
import AuthComponent from "../feature/auth/components/AuthComponent";
import OnboardingTutorial from "../feature/tutorial/page";
import Header from "@/shared/\bcomponents/header/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const { currentTheme, updateCurrentTheme } = useTheme();
  const isAuthOpen = useAuthStore((state) => state.isAuthOpen);
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);
  const authComponentText = useAuthStore((state) => state.authComponentText);
  const isOnboardingOpen = useTutorialStore((state) => state.isOnboardingOpen);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Header currentTheme={currentTheme} onThemeChange={updateCurrentTheme} />
      {children}

      {/* 클라이언트에서만 렌더링 */}
      {isClient && (
        <>
          {isOnboardingOpen && <OnboardingTutorial />}
          {isAuthOpen && !wasLoggedIn && (
            <AuthComponent>{authComponentText}</AuthComponent>
          )}
        </>
      )}
    </>
  );
}
