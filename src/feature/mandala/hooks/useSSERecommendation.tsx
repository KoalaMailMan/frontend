import { useStreamStore } from "@/lib/stores/streamStore";
import { useEffect, useRef } from "react";

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
  const { setError, setStreaming, setRecommendation, clearRecommendations } =
    useStreamStore();

  const eventSourceRef = useRef<EventSource | null>(null);

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
    clearRecommendations();
    setStreaming(false);

    const QEURY_URL = `?parentGoal=${goal}?recommendationCount=${count}`;
    const RECOMMEND_URL = `/api/recommend/streaming${QEURY_URL}`;

    console.log(`🚀 스트림 연결 시작: ${RECOMMEND_URL}`);
    const eventSource = new EventSource(RECOMMEND_URL);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("✅ 스트림 연결 성공");
    };

    eventSource.onmessage = (event) => {
      const data = event.data;
      const processingArrayData = data.split(/(?:\r\n|\r|\n)/g);
      console.log(`📨 데이터 수신: ${data}`);
      // 완료 신호 체크

      setRecommendation(processingArrayData);
    };

    eventSource.onerror = (error) => {
      console.error(`🚨 SSE 에러: ${error}`);
      const errorMsg = "스트림 연결 오류";
      setError(errorMsg);
      setStreaming(false);
      eventSource.close();
      onError?.(errorMsg);
    };
  };

  const stopStream = () => {
    console.log("❌ SSE 연결 중지");
    eventSourceRef.current?.close();
    setStreaming(false);
  };

  //   useEffect(() => {
  //     if (goal.trim() && count > 0 && enabled) {
  //       startStream();
  //     }

  //     return () => {
  //       eventSourceRef.current?.close();
  //     };
  //   }, [goal, count, enabled]);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return { startStream, stopStream };
}
