import { useQuery } from "@tanstack/react-query";
import { getMandalaAPI } from "../api/mandalart/getMandala";
import { emptyDummyData, type ServerMandalaType } from "../service";
import { useAuthStore } from "@/lib/stores/authStore";

export default function useMandalaData() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["mandalart"],
    queryFn: () => {
      if (!accessToken) {
        throw new Error("Mandala Data: accessToken이 없습니다.");
      }

      const res = getMandalaAPI(accessToken);

      // 상태 코드 체크
      if (res === null) {
        return emptyDummyData;
      }

      return res;
    },
    enabled: !!accessToken,
    staleTime: Infinity,
    gcTime: Infinity,
    select: (res: ServerMandalaType) => res.data,
  });
}
