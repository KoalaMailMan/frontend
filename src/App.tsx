import { useEffect, useRef } from "react";
import { handleLogin } from "./feature/auth/service";
import { useAuthStore } from "./lib/stores/authStore";
import MandalaBoard from "./feature/mandala/pages/MandalaBoard";
import HomePage from "./feature/home/pages/HomePage";
import useTheme from "./shared/hooks/useTheme";

function App() {
  const isLoading = useRef(false);
  const { currentTheme, updateCurrentTheme, getCurrentBackground } = useTheme();
  // const accessToken = useAuthStore((state) => state.accessToken);
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);
  // const setWasLoggedIn = useAuthStore((state) => state.setWasLoggedIn);
  // useEffect(() => {
  //   let cancelled = false;

  //   const initializeAuth = async () => {
  //     isLoading.current = true;
  //     try {
  //       handleLogin();

  //       // if (shouldAttemptRefresh()) {
  //       //   // 새로고침/재접속/토큰자연만료 시 토큰 갱신
  //       //   const success = await APIWithRetry(reissueWithRefreshToken);
  //       //   if (!success && !cancelled) {
  //       //     setWasLoggedIn(false);
  //       //   }
  //       // }
  //     } catch (error) {
  //       console.error("Auth initialization failed:", error);
  //     } finally {
  //       if (!cancelled) {
  //         isLoading.current = false;
  //       }
  //     }
  //   };
  //   initializeAuth();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  // useEffect(() => {
  //   let timer: any;
  //   if (!accessToken && wasLoggedIn) {
  //     timer = setTimeout(() => {
  //       setWasLoggedIn(false);
  //       console.log("세션 종료로 처음 화면으로");
  //     }, 1000);
  //   }
  //   handleMandalaData();
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [accessToken]);

  if (wasLoggedIn) {
    return (
      <MandalaBoard
        currentTheme={currentTheme}
        onThemeChange={updateCurrentTheme}
        getCurrentBackground={getCurrentBackground}
      />
    );
  }

  if (!wasLoggedIn) {
    return (
      <HomePage
        currentTheme={currentTheme}
        onThemeChange={updateCurrentTheme}
        getCurrentBackground={getCurrentBackground}
      />
    );
  }
}

export default App;
