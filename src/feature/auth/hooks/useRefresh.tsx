import { useQuery } from "@tanstack/react-query";
import { refreshTokenAPI } from "../api";
import { useAuthStore } from "@/lib/stores/authStore";

export default function useRefresh() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);

  return useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: () => {
      if (accessToken && !wasLoggedIn) return;
      return refreshTokenAPI();
    },
    enabled: !accessToken && wasLoggedIn,
    retry: 3,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
