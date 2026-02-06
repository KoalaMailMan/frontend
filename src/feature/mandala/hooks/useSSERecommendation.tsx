import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useMandalaStore, type SubGoal } from "@/lib/stores/mandalaStore";

type UseSSERecommendationOptions = {
  goal: string;
  subs: SubGoal[];
  getAccessToken: () => Promise<string | undefined | null>;
  onComplete?: (items?: string[] | number) => void;
  onError?: (error: string) => void;
};

const EventSource = EventSourcePolyfill;

export const parseSSEChunks = (rawData: string[]) => {
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
  subs,
  onComplete,
  onError,
  getAccessToken,
}: UseSSERecommendationOptions) {
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setStreaming] = useState(false);
  const [rawChunks, setRawChunks] = useState<string[]>([]);

  const Queue = useRef<string[]>([]);
  const isProcessing = useRef(false);

  const timer = useRef<NodeJS.Timeout | null>(null);

  const processQueue = useCallback(() => {
    if (Queue.current.length === 0) return (isProcessing.current = false);

    isProcessing.current = true;

    const delay = Queue.current.length >= 20 ? 50 : 120;

    const chunk = Queue.current.shift();
    if (chunk) {
      applyRecommendationChunk(subs, chunk);
    }

    timer.current = setTimeout(() => {
      processQueue();
    }, delay);
  }, [subs]);

  const clearQueue = useCallback(() => {
    Queue.current = [];
    isProcessing.current = false;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const initRecommendationTargets = useMandalaStore(
    (state) => state.initRecommendationTargets
  );
  const applyRecommendationChunk = useMandalaStore(
    (state) => state.applyRecommendationChunk
  );
  const resetRecommendationText = useMandalaStore(
    (state) => state.resetRecommendationText
  );

  const eventSourceRef = useRef<EventSource | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const cleanupStream = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setStreaming(false);
    startTimeRef.current = null;
  }, []);

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
      cleanupStream();
      clearQueue();
      resetRecommendationText();

      // 초기화
      setError(null);
      setRawChunks([]);
      initRecommendationTargets(subs);

      const params = encodingURI({
        parentGoal: goal,
        recommendationCount: count.toString(),
      });
      const RECOMMEND_URL = `${baseURL}/api/recommend/streaming?${params}`;

      // 연결 시작
      setStreaming(true);
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
      };
      // 완료 신호 체크
      eventSource.addEventListener("complete", () => {
        console.log(`🎉 스트림 완료`);
        if (startTimeRef.current) {
          const end = performance.now();
          console.log(
            `⏱ 총 소요 시간: ${(end - startTimeRef.current).toFixed(2)}ms`
          );
        }
        onComplete?.(count);
        cleanupStream();
        return;
      });

      eventSource.onmessage = (event) => {
        const data = event.data;
        console.log(`📨 데이터 수신: ${data}`);
        if (startTimeRef.current) {
          const end = performance.now();
          console.log(
            `⏱ 응답 시간: ${(end - startTimeRef.current).toFixed(2)}ms`
          );
        }

        const chars = data.split("");

        chars.forEach((char: string) => {
          Queue.current.push(char);
        });
        Queue.current.push(",");

        if (!isProcessing.current) {
          processQueue();
        }
      };

      eventSource.onerror = (error) => {
        console.error(`🚨 SSE 에러 상세:`, {
          error,
          readyState: eventSource.readyState,
          type: error.type,
          target: error.target,
        });
        const errorMsg = "스트림 연결 오류";
        cleanupStream();
        // clearQueue();
        onError?.(errorMsg);
        eventSource.close();
      };
    },
    [
      goal,
      subs,
      cleanupStream,
      resetRecommendationText,
      initRecommendationTargets,
      applyRecommendationChunk,
      onError,
    ]
  );

  const stopStream = useCallback(() => {
    console.log("❌ SSE 연결 중지");
    cleanupStream();
    clearQueue();
  }, []);

  const parsed = useMemo(() => parseSSEChunks(rawChunks), [rawChunks]);

  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  useEffect(() => {
    if (isProcessing) return;
    clearQueue();
  }, [isProcessing]);

  useEffect(() => {
    if (!isStreaming && !error && parsed.length > 0) {
      onComplete?.(parsed);
    }
  }, [isStreaming, error, parsed, onComplete]);

  return {
    startStream,
    stopStream,
    error,
    isStreaming,
    recommendation: parsed,
  };
}
