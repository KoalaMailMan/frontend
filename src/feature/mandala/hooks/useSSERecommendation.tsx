import { useCallback, useEffect, useRef, useState } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";

type UseSSERecommendationOptions = {
  goal: string;
  getAccessToken: () => Promise<string | undefined | null>;
  onComplete?: (items: string[]) => void;
  onError?: (error: string) => void;
};

const EventSource = EventSourcePolyfill;

const parseSSEChunks = (rawData: string[]) => {
  return rawData
    .join("")
    .split(/\s*,\s*/g)
    .map((item) => item.replace("__COMPLETE__", ""))
    .filter((item) => item.length > 0);
};

const encodingURI = (options: Record<string, string>) => {
  const params = new URLSearchParams({
    ...options,
  });

  return params.toString();
};

const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function useSSERecommendation({
  goal,
  onComplete,
  onError,
  getAccessToken,
}: UseSSERecommendationOptions) {
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setStreaming] = useState(false);
  const [recommendation, setRecommendation] = useState<string[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startStream = useCallback(
    async (count: number) => {
      if (!goal || goal.trim() === "") {
        console.warn("유효하지 않은 매개변수: 주요 목표 설정 안됨.");
        setError("주요 목표를 작성해주세요.");
        return;
      }
      if (count <= 0) {
        console.warn("유효하지 않은 매개변수: count = 0");
        setError("추천을 위한 항목이 비어있지 않습니다.");
        return;
      }

      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.warn("인증 토큰이 없습니다.");
        setError("세션 종료로 인해 로그인 화면으로 돌아갑니다.");
        return;
      }

      // 이전 연결 종료
      if (eventSourceRef.current != null) {
        eventSourceRef.current?.close();
      }
      // 초기화
      setError(null);
      setRecommendation([]);
      const params = encodingURI({
        parentGoal: goal,
        recommendationCount: count.toString(),
      });
      const RECOMMEND_URL = `${baseURL}/api/recommend/streaming?${params}`;

      console.log(`🚀 스트림 연결 시작: ${RECOMMEND_URL}`);
      const eventSource = new EventSource(RECOMMEND_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("✅ 스트림 연결 성공");
        startTimeRef.current = performance.now();
        setStreaming(true);
      };
      eventSource.onmessage = (event) => {
        const data = event.data;
        console.log(`📨 데이터 수신: ${data}`);
        if (startTimeRef.current) {
          const end = performance.now();
          console.log(
            `⏱ 응답 시간: ${(end - startTimeRef.current).toFixed(2)}ms`
          );
        }
        // 완료 신호 체크
        if (data.includes("__COMPLETE__")) {
          console.log(`🎉 스트림 완료`);
          if (startTimeRef.current) {
            const end = performance.now();
            console.log(
              `⏱ 총 소요 시간: ${(end - startTimeRef.current).toFixed(2)}ms`
            );
          }
          startTimeRef.current = null;
          eventSource.close();
          setStreaming(false);
          return;
        }
        setRecommendation((prev) => [...prev, data]);
      };

      eventSource.onerror = (error) => {
        console.error(`🚨 SSE 에러: ${error}`);
        const errorMsg = "스트림 연결 오류";
        startTimeRef.current = null;
        setError(errorMsg);
        setStreaming(false);
        onError?.(errorMsg);
        eventSource.close();
      };
    },
    [goal]
  );

  const stopStream = useCallback(() => {
    console.log("❌ SSE 연결 중지");
    setStreaming(false);
    eventSourceRef.current?.close();
  }, []);

  useEffect(() => {
    return () => {
      setStreaming(false);
      eventSourceRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!isStreaming && !error && recommendation.length > 0) {
      onComplete?.(parseSSEChunks(recommendation));
    }
  }, [isStreaming, error, recommendation]);

  return {
    startStream,
    stopStream,
    error,
    isStreaming,
    recommendation: parseSSEChunks(recommendation),
  };
}
