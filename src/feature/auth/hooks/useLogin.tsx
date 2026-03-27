import { useAuthStore } from "@/lib/stores/authStore";
import { useEffect } from "react";
import { clearURLQuery, getURLQuery } from "../\butils";
import { toast } from "sonner";

export default function useOAuthCallback() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setWasLoggedIn = useAuthStore((s) => s.setWasLoggedIn);
  const setLastLoginTime = useAuthStore((s) => s.setLastLoginTime);

  useEffect(() => {
    const errorFromUrl = getURLQuery("error");
    if (errorFromUrl) {
      toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
      clearURLQuery();
      return;
    }
    const token = getURLQuery("access_token");
    if (!token) return;

    setAccessToken(token);
    setWasLoggedIn(true);
    setLastLoginTime(new Date().toISOString());
    clearURLQuery();
  }, []);
}
