import { useQuery } from "@tanstack/react-query";
import { getRecommendList } from "../api/suggestion/getRecommendList";
import { useAuthStore } from "@/lib/stores/authStore";

type Props = {
  enabled: boolean;
  goal: string;
  count: number;
};

/**
 * tanstack query를 이용한 목표 추천 훅
 ** enabled(boolean): 쿼리 실행 조건 / false: 수동 실행 / true: 자동 실행
 ** goal: 주요 목표
 ** count: 추천 받을 목록 개수
 */
export default function useGoalRecommendation({
  enabled = false,
  goal,
  count,
}: Props) {
  const accessToken = useAuthStore.getState().accessToken;
  const shouldFetch = enabled && !!goal && !!count && !!accessToken;

  return useQuery({
    queryKey: ["goal-recommendation", goal.trim().toLowerCase()],
    queryFn: () => {
      if (!accessToken) {
        throw new Error("accessToken이 없습니다.");
      }
      if (!goal || !count) {
        throw new Error("양식이 맞지 않습니다.");
      }
      return getRecommendList(accessToken, goal, count);
    },
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
    gcTime: 1000 * 60 * 30, // 30분간 메모리에 보관
    refetchOnWindowFocus: false, // 창 포커스 시 자동 재요청 여부
    retry: false, // 실패 시 재시도 횟수 (false: 실패해도 재시도 안 함)
    select: (response) => response.data.childGoals, // 추출 반환
  });
}
