import { useQuery } from "@tanstack/react-query";
import { refreshTokenAPI } from "../api";
import { useAuthStore } from "@/lib/stores/authStore";

export default function useRefresh() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);

  return useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: () => {
      const token = refreshTokenAPI();
      if (!token) throw new Error("토큰 재발급 실패");
      return token;
    },
    enabled: !accessToken && wasLoggedIn,
    retry: 0,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
