import { useQuery } from "@tanstack/react-query";
import { getUserProfileAPI } from "../api";
import { useAuthStore } from "@/lib/stores/authStore";

/**
 * 유저 정보 조회 훅
 **
 */
export default function useUserInfo() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUserProfileAPI(accessToken!),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
    gcTime: 1000 * 60 * 30, // 30분간 메모리에 보관
    select: (response) => response && response.data, // 추출 반환
  });
}
