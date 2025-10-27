import { useCallback, useEffect, useRef, useState } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";

type UseSSERecommendationOptions = {
  goal: string;
  count: number;
  getAccessToken: () => Promise<string | undefined | null>;
  onComplete?: (items: string[]) => void;
  onError?: (error: string) => void;
};

const EventSource = EventSourcePolyfill;

const parseSSEChunks = (rawData: string[]) => {
  return rawData
    .join("\n")
    .split(/(?:\r\n|\r|\n)/g)
    .map((item) => item.replace("__COMPLETE__", "").trim())
    .filter(Boolean);
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
  count,
  onComplete,
  onError,
  getAccessToken,
}: UseSSERecommendationOptions) {
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setStreaming] = useState(false);
  const [recommendation, setRecommendation] = useState<string[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);

  const startStream = useCallback(async () => {
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
      setStreaming(true);
    };

    eventSource.onmessage = (event) => {
      const data = event.data;
      console.log(`📨 데이터 수신: ${data}`);
      // 완료 신호 체크
      if (data.includes("__COMPLETE__")) {
        console.log(`🎉 스트림 완료`);
        eventSource.close();
        setStreaming(false);
        onComplete?.(parseSSEChunks([...recommendation, data]));
        return;
      }
      setRecommendation((prev) => [...prev, data]);
    };

    eventSource.onerror = (error) => {
      console.error(`🚨 SSE 에러: ${error}`);
      const errorMsg = "스트림 연결 오류";
      setError(null);
      setStreaming(false);
      onError?.(errorMsg);
      eventSource.close();
    };
  }, [goal, count]);

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

  return {
    startStream,
    stopStream,
    error,
    isStreaming,
    recommendation: isStreaming ? null : parseSSEChunks(recommendation),
  };
}
