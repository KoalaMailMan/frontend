import { useAuthStore } from "@/lib/stores/authStore";
import { useEffect } from "react";
import { clearURLQuery, getURLQuery } from "../\butils";
import { refreshTokenAPI } from "../api";
import { validateOAuthState } from "../service";
import { toast } from "sonner";

export default function useOAuthCallback() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setWasLoggedIn = useAuthStore((s) => s.setWasLoggedIn);
  const setLastLoginTime = useAuthStore((s) => s.setLastLoginTime);

  useEffect(() => {
    (async () => {
      const errorFromUrl = getURLQuery("error");
      console.log(errorFromUrl);
      if (errorFromUrl) {
        toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
        clearURLQuery();
        return;
      }
      // const token = getURLQuery("access_token");

      const state = getURLQuery("state");
      console.log(state);
      if (state) {
        const isValidState = validateOAuthState(state);
        console.log(isValidState);
        if (isValidState) {
          const accessToken = await refreshTokenAPI();
          if (!accessToken) return;

          setAccessToken(accessToken);
          setWasLoggedIn(true);
          setLastLoginTime(new Date().toISOString());
        }
      }

      // clearURLQuery();
    })();
  }, []);
}
