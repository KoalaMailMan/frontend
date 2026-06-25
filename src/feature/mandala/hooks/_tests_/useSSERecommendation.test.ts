import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useSSERecommendation from "../useSSERecommendation";

// EventSource Mock
const mocks = vi.hoisted(() => {
  const mockEventSource = {
    close: vi.fn(),
    addEventListener: vi.fn(),

    onopen: null,
    onmessage: null,
    onerror: null,
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
});
