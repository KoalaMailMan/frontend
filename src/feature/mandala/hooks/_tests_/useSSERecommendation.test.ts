import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useSSERecommendation, { splitSSEChunk } from "../useSSERecommendation";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// Mandalart Store Mock
const applyRecommendationChunk = vi.fn();

vi.mock("@/lib/stores/mandalaStore", () => ({
  useMandalaStore: (selector: any) =>
    selector({
      initRecommendationTargets: vi.fn(),
      applyRecommendationChunk,
      resetRecommendationText: vi.fn(),
    }),
}));

// EventSource Mock
const listener: Record<string, Function> = {};
const mocks = vi.hoisted(() => {
  const mockEventSource = {
    close: vi.fn(),
    addEventListener: vi.fn((event, callback) => {
      listener[event] = callback;
    }),
    onerror: null as ((event?: unknown) => void) | null,
    onopen: null as ((event?: unknown) => void) | null,
    onmessage: null as ((event: { data: string }) => void) | null,
  };

  return {
    mockEventSource,
    MockEventSourcePolyfill: vi.fn(function () {
      return mockEventSource;
    }),
  };
});

vi.mock("event-source-polyfill", () => ({
  EventSourcePolyfill: mocks.MockEventSourcePolyfill,
}));

describe("useSSERecommendation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("startStream 호출 시  EventSource를 생성한다", async () => {
    const getAccessToken = vi.fn().mockResolvedValue("mock-token");

    const { result } = renderHook(() =>
      useSSERecommendation({
        goal: "운동하기",
        subs: [{ goalId: "1", content: "", status: "UNDONE" }],
        getAccessToken,
      })
    );

    await act(async () => {
      await result.current.startStream(3);
    });

    expect(mocks.MockEventSourcePolyfill).toHaveBeenCalledTimes(1);

    expect(mocks.MockEventSourcePolyfill).toHaveBeenLastCalledWith(
      expect.stringContaining("/api/recommend/streaming"),
      expect.objectContaining({
        headers: {
          Authorization: "Bearer mock-token",
        },
      })
    );
  });
  it("토큰이 없으면 EventSource를 생성하지 않는다", async () => {
    const getAccessToken = vi.fn().mockResolvedValue(null);

    const { result } = renderHook(() =>
      useSSERecommendation({
        goal: "운동하기",
        subs: [{ goalId: "1", content: "", status: "UNDONE" }],
        getAccessToken,
      })
    );

    await act(async () => {
      await result.current.startStream(3);
    });

    expect(mocks.MockEventSourcePolyfill).not.toHaveBeenCalled();
    expect(result.current.error).toBe("로그인 후 이용해주세요.");
  });

  it("goal이 없으면 스트림을 생성하지 않는다", async () => {
    const getAccessToken = vi.fn().mockResolvedValue("mock-token");
    const goal = "";
    const { result } = renderHook(() =>
      useSSERecommendation({
        goal,
        subs: [{ goalId: "1", content: "", status: "UNDONE" }],
        getAccessToken,
      })
    );

    await act(async () => {
      await result.current.startStream(3);
    });

    expect(mocks.MockEventSourcePolyfill).not.toHaveBeenCalled();
    expect(result.current.error).toBe("주요 목표를 작성해주세요.");
  });
  it("count가 0이면 스트림을 생성하지 않는다", async () => {
    const getAccessToken = vi.fn().mockResolvedValue("mock-token");
    const count = 0;
    const { result } = renderHook(() =>
      useSSERecommendation({
        goal: "운동하기",
        subs: [{ goalId: "1", content: "", status: "UNDONE" }],
        getAccessToken,
      })
    );

    await act(async () => {
      await result.current.startStream(count);
    });

    expect(mocks.MockEventSourcePolyfill).not.toHaveBeenCalled();
    expect(result.current.error).toBe("추천을 위한 항목이 비어있지 않습니다.");
  });

  it("complete 이벤트 수신 시 스트림을 종료한다.", async () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useSSERecommendation({
        goal: "운동하기",
        subs: [{ goalId: "1", content: "", status: "UNDONE" }],
        getAccessToken: vi.fn().mockResolvedValue("mock-token"),
        onComplete,
      })
    );

    await act(async () => {
      await result.current.startStream(3);
    });

    act(() => {
      listener.complete();
    });
    expect(onComplete).toHaveBeenCalledWith(3);
    expect(mocks.mockEventSource.close).toHaveBeenCalled();
  });

  it("error 이벤트 수신 시 스트림을 종료한다.", async () => {
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useSSERecommendation({
        goal: "운동하기",
        subs: [{ goalId: "1", content: "", status: "UNDONE" }],
        getAccessToken: vi.fn().mockResolvedValue("mock-token"),
        onError,
      })
    );

    await act(async () => {
      await result.current.startStream(3);
    });

    act(() => {
      mocks.mockEventSource.onerror?.({
        type: "error",
      });
    });
    expect(onError).toHaveBeenCalledWith("스트림 연결 오류");
    expect(mocks.mockEventSource.close).toHaveBeenCalled();
  });
  it("onmessage 이벤트 수신 시  applyRecommendationChunk 함수를 호출한다", async () => {
    const { result } = renderHook(() =>
      useSSERecommendation({
        goal: "운동하기",
        subs: [{ goalId: "1", content: "", status: "UNDONE" }],
        getAccessToken: vi.fn().mockResolvedValue("mock-token"),
      })
    );

    await act(async () => {
      await result.current.startStream(3);
    });

    act(() => {
      mocks.mockEventSource.onmessage?.({
        data: "운동하기",
      });
    });
    act(() => {
      vi.runAllTimers();
    });

    expect(applyRecommendationChunk.mock.calls).toEqual([
      ["1", "운"],
      ["1", "동"],
      ["1", "하"],
      ["1", "기"],
      ["1", ","],
    ]);
  });

  it("언마운트 시 EventSource 연결을 종료한다", async () => {
    const { result, unmount } = renderHook(() =>
      useSSERecommendation({
        goal: "운동하기",
        subs: [{ goalId: "1", content: "", status: "DONE" }],
        getAccessToken: vi.fn().mockReturnValue("mock-token"),
      })
    );

    await act(async () => {
      await result.current.startStream(3);
    });

    act(() => {
      unmount();
    });

    expect(mocks.mockEventSource.close).toHaveBeenCalledTimes(1);
  });
});

describe("splitSSEChunk", () => {
  it("문자 단위로 분리한다.", () => {
    expect(
      splitSSEChunk("50분 가량의 근력 운동을 하고 30분 유산소 하기")
    ).toEqual([
      "5",
      "0",
      "분",
      " ",
      "가",
      "량",
      "의",
      " ",
      "근",
      "력",
      " ",
      "운",
      "동",
      "을",
      " ",
      "하",
      "고",
      " ",
      "3",
      "0",
      "분",
      " ",
      "유",
      "산",
      "소",
      " ",
      "하",
      "기",
      ",",
    ]);
  });
});
