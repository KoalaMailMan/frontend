import { useEffect, useRef, useState } from "react";

type UseSSERecommendationOptions = {
  goal: string;
  count: number;
  enabled: boolean;
  onComplete?: (items: string[]) => void;
  onError?: (error: string) => void;
};

export default function useSSERecommendation({
  goal,
  count,
  enabled,
  onError,
}: UseSSERecommendationOptions) {
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setStreaming] = useState(false);
  const [recommendation, setRecommendation] = useState<string[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startStream = () => {
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

    // 이전 연결 종료
    if (eventSourceRef.current != null) {
      eventSourceRef.current?.close();
    }
    // 초기화
    setError(null);
    setRecommendation([]);

    const QUERY_URL = `?parentGoal=${goal}&recommendationCount=${count}`;
    const RECOMMEND_URL = `/api/recommend/streaming${QUERY_URL}`;

    console.log(`🚀 스트림 연결 시작: ${RECOMMEND_URL}`);
    const eventSource = new EventSource(RECOMMEND_URL);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("✅ 스트림 연결 성공");
      setStreaming(true);
    };

    eventSource.onmessage = (event) => {
      const data = event.data;
      console.log(`📨 데이터 수신: ${data}`);
      // 완료 신호 체크

      setRecommendation((prev) => [...prev, event.data]);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        console.log("⏰ 유효 타임아웃");
        eventSource.close();
        setStreaming(false);
      }, 5000);
    };

    eventSource.onerror = (error) => {
      console.error(`🚨 SSE 에러: ${error}`);
      const errorMsg = "스트림 연결 오류";
      setError(null);
      setStreaming(false);
      setRecommendation([]);
      onError?.(errorMsg);
      timeoutRef.current = null;
      eventSource.close();
    };
  };

  const stopStream = () => {
    console.log("❌ SSE 연결 중지");
    setStreaming(false);
    timeoutRef.current = null;
    eventSourceRef.current?.close();
  };

  const parseSSEChunks = (rawData: string[]) => {
    return rawData
      .join("\n")
      .split(/(?:\r\n|\r|\n)/g)
      .map((item) => item.replace("[DONE]", "").trim())
      .filter(Boolean);
  };

  useEffect(() => {
    return () => {
      setStreaming(false);
      timeoutRef.current = null;
      eventSourceRef.current?.close();
    };
  }, []);

  return {
    startStream,
    stopStream,
    error,
    isStreaming,
    recommendation: parseSSEChunks(recommendation),
  };
}
