import { useEffect, useRef } from "react";
import HomePage from "./feature/home/pages/HomePage";
import Mandala from "./feature/mandala/components/Mandala";
import {
  handleLogin,
  reissueWithRefreshToken,
  shouldAttemptRefresh,
} from "./feature/auth/service";
import { APIWithRetry } from "./feature/auth/\butils";
import { useAuthStore } from "./lib/stores/authStore";

function App() {
  const isLoading = useRef(false);
  const store = useAuthStore();
  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      isLoading.current = true;
      try {
        handleLogin();

        if (shouldAttemptRefresh()) {
          // 새로고침/재접속/토큰자연만료 시 토큰 갱신
          const success = await APIWithRetry(reissueWithRefreshToken);
          if (!success && !cancelled) {
            useAuthStore.getState().setWasLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        if (!cancelled) {
          isLoading.current = false;
        }
      }
    };
    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <>
      {store.wasLoggedIn && <Mandala />}
      {!store.wasLoggedIn && <HomePage />}
    </>
  );
}

export default App;
