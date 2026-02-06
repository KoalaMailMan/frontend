import { useQuery } from "@tanstack/react-query";
import { getMandalaAPI } from "../api/mandalart/getMandala";
import { type ServerMandalaType } from "../service";
import { useAuthStore } from "@/lib/stores/authStore";

export default function useMandalaData() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["mandalart"],
    queryFn: () => {
      if (!accessToken) {
        throw new Error("Mandala Data: accessToken이 없습니다.");
      }

      return getMandalaAPI(accessToken);
    },
    enabled: !!accessToken,
    staleTime: Infinity,
    gcTime: Infinity,
    select: (res: ServerMandalaType) => res.data,
  });
}
