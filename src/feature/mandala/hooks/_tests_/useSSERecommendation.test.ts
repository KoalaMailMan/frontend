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
});
