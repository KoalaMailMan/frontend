import { apiClient } from "@/lib/api/client";

/**
 * getRecommendList 함수: 주요 목표에 대한 세부 목표 추천
 * parentGoal: 주요 목표 필요
 * recommendationCount: 추천 받을 목표 갯수 필요
 */
export const getRecommendList = async (
  accessToken: string,
  parentGoal: string,
  recommendationCount: number
) => {
  const QEURY_URL = `?parentGoal=${parentGoal}?recommendationCount=${recommendationCount}`;
  const RECOMMEND_URL = `/api/recommend/list/${QEURY_URL}`;
  try {
    const res = await apiClient.get(RECOMMEND_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    return res;
  } catch (error) {
    console.error("getMandalaAPI failed:", error);
  }
};
