import { useQuery } from "@tanstack/react-query";
import { getUserProfileAPI } from "../api";

/**
 * 유저 정보 조회 훅
 ** accessToken(string): 쿼리 실행 조건 / 액세스 토큰이 있어야 쿼리 활성화
 */
export default function useUserInfo(accessToken: string) {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => {
      if (!accessToken) {
        throw new Error("accessToken이 없습니다.");
      }
      return getUserProfileAPI(accessToken);
    },
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
    gcTime: 1000 * 60 * 30, // 30분간 메모리에 보관
    select: (response) => response?.data, // 추출 반환
  });
}
