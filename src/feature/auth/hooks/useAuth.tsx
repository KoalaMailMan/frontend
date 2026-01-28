import { useQuery } from "@tanstack/react-query";
import { refreshTokenAPI } from "../api";

export default function useAuth(
  accessToken: string | null,
  wasLoggedIn: boolean
) {
  return useQuery({
    queryKey: ["auth"],
    queryFn: () => {
      if (accessToken && !wasLoggedIn) return;
      return refreshTokenAPI();
    },
    enabled: !accessToken && wasLoggedIn,
    retry: 3,
  });
}
